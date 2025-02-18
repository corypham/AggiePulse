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
export const getStatusIcon = (location: Location) => {
  // Get current hour's data from dayData
  const currentHour = new Date().getHours();
  const currentData = location?.dayData?.find(data => {
    const hour = parseInt(data.time.split(' ')[0]);
    const isPM = data.time.includes('PM');
    return (isPM ? hour + 12 : hour) === currentHour;
  });
  
  const busyness = currentData?.busyness ?? 0;
  
  if (busyness >= 75) {
    return VeryBusyStatus;
  } else if (busyness >= 40) {
    return FairlyBusyStatus;
  } else {
    return NotBusyStatus;
  }
};

// Helper function to get status text - using same thresholds
export const getStatusText = (location: Location): string => {
  const currentHour = new Date().getHours();
  const currentData = location?.dayData?.find(data => {
    const hour = parseInt(data.time.split(' ')[0]);
    const isPM = data.time.includes('PM');
    return (isPM ? hour + 12 : hour) === currentHour;
  });
  
  const busyness = currentData?.busyness ?? 0;
  
  if (location?.currentStatus === 'Closed') {
    return "Closed";
  }
  
  if (busyness >= 75) {
    return "Very Busy";
  } else if (busyness >= 40) {
    return "Fairly Busy";
  } else {
    return "Not Busy";
  }
};

// Helper function to get color for status - using same thresholds
export const getStatusColor = (location: Location): string => {
  const currentHour = new Date().getHours();
  const currentData = location?.dayData?.find(data => {
    const hour = parseInt(data.time.split(' ')[0]);
    const isPM = data.time.includes('PM');
    return (isPM ? hour + 12 : hour) === currentHour;
  });
  
  const busyness = currentData?.busyness ?? 0;
  
  if (location?.currentStatus === 'Closed') {
    return "#6B7280"; // Gray color for closed
  }
  
  if (busyness >= 75) {
    return "#EF4444"; // Red
  } else if (busyness >= 40) {
    return "#F59E0B"; // Orange/Yellow
  } else {
    return "#10B981"; // Green
  }
};