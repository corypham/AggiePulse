import { VeryBusyStatus, FairlyBusyStatus, NotBusyStatus } from "../../assets";
import { Location } from "../types/location";

interface CrowdInfo {
  percentage: number;
  level: string;
  description: string;
}

interface LocationStatus {
  crowdInfo: CrowdInfo;
  currentStatus: string;
  isOpen?: boolean;
}

// Get the appropriate status icon based on location data
export const getStatusIcon = (location: Location, currentTime: Date = new Date()) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayLower = days[currentTime.getDay()];
  const currentHour = currentTime.getHours();

  // Get the current day's data
  const todayData = location.weeklyBusyness?.[currentDayLower];
  
  // Find the current hour's data
  const currentHourData = todayData?.find((timeSlot: any) => {
    const timeHour = parseInt(timeSlot.time.split(' ')[0]);
    const period = timeSlot.time.split(' ')[1];
    
    // Convert to 24-hour format for comparison
    let hour24 = timeHour;
    if (period === 'PM' && timeHour !== 12) hour24 += 12;
    if (period === 'AM' && timeHour === 12) hour24 = 0;
    
    return hour24 === currentHour;
  });

  const description = currentHourData?.description?.toLowerCase() || '';

  // Return icon based on description
  if (description.includes('not busy') || description.includes('less busy')) {
    return NotBusyStatus;
  } else if (description.includes('very busy') || description.includes('extremely busy')) {
    return VeryBusyStatus;
  } else if (description.includes('fairly busy') || description.includes('bit busy')) {
    return FairlyBusyStatus;
  }

  // Fallback to NotBusy if no description found
  return NotBusyStatus;
};

// Helper function to get status text
export const getStatusText = (location: Location): string => {
  if (location.currentStatus === 'Closed') {
    return "Closed";
  }
  
  // Use the description from crowdInfo
  if (location.crowdInfo?.description) {
    return location.crowdInfo.description;
  }
  
  // Fallback to percentage-based text
  const busyness = location.crowdInfo?.percentage || 0;
  if (busyness >= 70) {
    return "Very Busy";
  } else if (busyness >= 30) {
    return "Fairly Busy";
  } else {
    return "Not Busy";
  }
};

// Helper function to get color for status
export const getStatusColor = (location: Location): string => {
  if (location.currentStatus === 'Closed') {
    return "#6B7280"; // Gray color for closed
  }
  
  const description = location.crowdInfo?.description?.toLowerCase() || '';
  
  if (description.includes('not busy') || description.includes('less busy')) {
    return "#10B981"; // Green for not busy
  } else if (description.includes('very busy') || description.includes('extremely busy')) {
    return "#EF4444"; // Red for very busy
  } else if (description.includes('fairly busy') || description.includes('bit busy')) {
    return "#F59E0B"; // Orange/Yellow for fairly busy
  }
  
  // Fallback to percentage-based colors
  const busyness = location.crowdInfo?.percentage || 0;
  if (busyness >= 70) {
    return "#EF4444"; // Red
  } else if (busyness >= 30) {
    return "#F59E0B"; // Orange/Yellow
  } else {
    return "#10B981"; // Green
  }
};