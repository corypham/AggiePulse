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
  // If location is closed, return Not Busy icon
  if (location.currentStatus === 'Closed') {
    return NotBusyStatus;
  }

  // Get busyness percentage from crowdInfo
  const busyness = location.crowdInfo?.percentage || 0;
  
  // Return appropriate icon based on busyness percentage
  if (busyness >= 70) {
    return VeryBusyStatus;
  } else if (busyness >= 30) {
    return FairlyBusyStatus;
  } else {
    return NotBusyStatus;
  }
};

// Helper function to get status text
export const getStatusText = (location: Location): string => {
  if (location.currentStatus === 'Closed') {
    return "Closed";
  }
  
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
  
  const busyness = location.crowdInfo?.percentage || 0;
  
  if (busyness >= 70) {
    return "#EF4444"; // Red for very busy
  } else if (busyness >= 30) {
    return "#F59E0B"; // Orange/Yellow for fairly busy
  } else {
    return "#10B981"; // Green for not busy
  }
};