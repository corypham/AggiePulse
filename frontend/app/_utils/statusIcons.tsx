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
  // Use the same percentage calculation as getLocationStatus
  const percentage = (location.currentCapacity / location.maxCapacity) * 100;
  
  if (percentage >= 75) {
    return VeryBusyStatus;
  } else if (percentage >= 40) {
    return FairlyBusyStatus;
  } else {
    return NotBusyStatus;
  }
};

// Helper function to get status text - using same thresholds
export const getStatusText = (location: Location): string => {
  const percentage = (location.currentCapacity / location.maxCapacity) * 100;
  
  if (location.currentStatus === 'Closed') {
    return "Closed";
  }
  
  if (percentage >= 75) {
    return "Very Busy";
  } else if (percentage >= 40) {
    return "Fairly Busy";
  } else {
    return "Not Busy";
  }
};

// Helper function to get color for status - using same thresholds
export const getStatusColor = (location: Location): string => {
  const percentage = (location.currentCapacity / location.maxCapacity) * 100;
  
  if (location.currentStatus === 'Closed') {
    return "#6B7280"; // Gray color for closed
  }
  
  if (percentage >= 75) {
    return "#EF4444"; // Red
  } else if (percentage >= 40) {
    return "#F59E0B"; // Orange/Yellow
  } else {
    return "#10B981"; // Green
  }
};