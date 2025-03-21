import { VeryBusyStatus, FairlyBusyStatus, NotBusyStatus } from "../../assets";
import { Location } from "../types/location";
import { SafeSpaceService } from '../services/safeSpaceService';
import { isLocationOpen } from './timeUtils';

// Cache SafeSpace data in memory
let safeSpaceCache: any = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Synchronously get cached SafeSpace data
const getCachedSafeSpaceData = () => {
  const now = Date.now();
  if (safeSpaceCache && (now - lastFetchTime < CACHE_DURATION)) {
    return safeSpaceCache;
  }
  return null;
};

// Update cache asynchronously
const updateSafeSpaceCache = async () => {
  try {
    const data = await SafeSpaceService.getOccupancyData();
    if (data) {
      safeSpaceCache = data;
      lastFetchTime = Date.now();
    }
  } catch (error) {
    console.log('Error updating SafeSpace cache:', error);
  }
};

// Keep cache fresh
setInterval(updateSafeSpaceCache, CACHE_DURATION);
// Initial fetch
updateSafeSpaceCache();

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
  // First check if location is closed
  if (!isLocationOpen(location)) {
    return NotBusyStatus;  // Return not busy icon when closed
  }

  // Special handling for SafeSpace locations
  if (location.id === 'library' || location.id === '24hr') {
    const safeSpaceData = getCachedSafeSpaceData();
    if (safeSpaceData) {
      const data = location.id === 'library' 
        ? safeSpaceData.mainBuilding
        : safeSpaceData.studyRoom;

      if (data) {
        const percentage = data.percentage;
        if (percentage >= 75) return VeryBusyStatus;
        if (percentage >= 40) return FairlyBusyStatus;
        return NotBusyStatus;
      }
    }
  }

  // Default handling for other locations
  const percentage = location.crowdInfo?.percentage || 0;
  const level = location.crowdInfo?.level || 'Not Busy';
  
  if (level === 'Very Busy' || percentage >= 75) {
    return VeryBusyStatus;
  } else if (level === 'Fairly Busy' || percentage >= 40) {
    return FairlyBusyStatus;
  } else {
    return NotBusyStatus;
  }
};

// Helper function to get status text
export const getStatusText = (location: Location): string => {
  // First check if location is closed
  if (!isLocationOpen(location)) {
    return "Closed";
  }

  // Special handling for SafeSpace locations
  if (location.id === 'library' || location.id === '24hr') {
    const safeSpaceData = getCachedSafeSpaceData();
    if (safeSpaceData) {
      const data = location.id === 'library' 
        ? safeSpaceData.mainBuilding
        : safeSpaceData.studyRoom;

      if (data) {
        const percentage = data.percentage;
        if (percentage >= 75) return 'Very Busy';
        if (percentage >= 40) return 'Fairly Busy';
        return 'Not Busy';
      }
    }
  }
  
  // Default handling for other locations
  const percentage = location.crowdInfo?.percentage || 0;
  const level = location.crowdInfo?.level || 'Not Busy';
  
  if (level === 'Very Busy' || percentage >= 75) {
    return 'Very Busy';
  } else if (level === 'Fairly Busy' || percentage >= 40) {
    return 'Fairly Busy';
  } else {
    return 'Not Busy';
  }
};

// Helper function to get color for status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Not Busy':
      return '#0fbc43';  // Green
    case 'A Bit Busy':
    case 'Busy':
    case 'Fairly Busy':
      return '#ff8003';  // Orange
    case 'Very Busy':
    case 'Extremely Busy':
      return '#EF4444';  // Red
    case 'Closed':
      return '#6B7280';  // Gray
    default:
      return '#0fbc43';  // Default to green for unknown status
  }
};

// Helper function to get background color class for status
export const getStatusBgClass = (status: string): string => {
  switch (status) {
    case 'Not Busy':
      return 'bg-green-50'; // Light green background
    case 'A Bit Busy':
    case 'Busy':
    case 'Fairly Busy':
      return 'bg-amber-50'; // Light orange/amber background
    case 'Very Busy':
    case 'Extremely Busy':
      return 'bg-red-50'; // Light red background
    case 'Closed':
      return 'bg-gray-50';
    default:
      return 'bg-green-50';
  }
};

// Helper function to get text color for percentage
export const getPercentageTextColor = (status: string): string => {
  switch (status) {
    case 'Not Busy':
      return 'text-green-500';
    case 'A Bit Busy':
    case 'Busy':
    case 'Fairly Busy':
      return 'text-[#f97316]'; // Orange color
    case 'Very Busy':
    case 'Extremely Busy':
      return 'text-red-500';
    case 'Closed':
      return 'text-gray-500';
    default:
      return 'text-green-500';
  }
};

// Helper function to get complete status info
export const getLocationStatus = (location: Location) => {
  // First check if location is closed
  if (!isLocationOpen(location)) {
    return {
      crowdInfo: {
        percentage: 0,
        level: 'Not Busy',
        description: 'Location is currently closed'
      },
      currentStatus: 'Closed',
      isOpen: false
    };
  }

  // Special handling for SafeSpace locations
  if (location.hasSafeSpace && location.currentStatus?.realTimeOccupancy) {
    const data = location.id === 'library' 
      ? location.currentStatus.realTimeOccupancy.mainBuilding
      : location.currentStatus.realTimeOccupancy.studyRoom;

    if (data) {
      const percentage = data.percentage;
      if (percentage >= 75) {
        return {
          crowdInfo: {
            percentage: percentage,
            level: 'Very Busy',
            description: 'Limited seating available'
          },
          currentStatus: 'Very Busy',
          isOpen: true
        };
      } else if (percentage >= 40) {
        return {
          crowdInfo: {
            percentage: percentage,
            level: 'Fairly Busy',
            description: 'Moderate seating available'
          },
          currentStatus: 'Fairly Busy',
          isOpen: true
        };
      } else {
        return {
          crowdInfo: {
            percentage: percentage,
            level: 'Not Busy',
            description: 'Plenty of seating available'
          },
          currentStatus: 'Not Busy',
          isOpen: true
        };
      }
    }
  }

  // Default handling for other locations
  const percentage = location.crowdInfo?.percentage || 0;
  const level = location.crowdInfo?.level || 'Not Busy';
  
  return {
    crowdInfo: {
      percentage: percentage,
      level: level,
      description: level === 'Very Busy' ? 'Limited seating available' :
                  level === 'Fairly Busy' ? 'Moderate seating available' :
                  'Plenty of seating available'
    },
    currentStatus: level,
    isOpen: true
  };
};

// For the title section status badge (solid background)
export const getStatusTitleBgClass = (status: string): string => {
  switch (status) {
    case 'Not Busy':
      return 'bg-[#0fbc43]'; // Solid green
    case 'A Bit Busy':
    case 'Busy':
    case 'Fairly Busy':
      return 'bg-[#ff8003]'; // Solid orange
    case 'Very Busy':
    case 'Extremely Busy':
      return 'bg-[#EF4444]'; // Solid red
    case 'Closed':
      return 'bg-gray-500';
    default:
      return 'bg-[#0fbc43]';
  }
};

// For the crowd levels section (light background)
export const getStatusCrowdLevelBgClass = (status: string): string => {
  switch (status) {
    case 'Not Busy':
      return 'bg-green-50';
    case 'A Bit Busy':
    case 'Busy':
    case 'Fairly Busy':
      return 'bg-amber-50';
    case 'Very Busy':
    case 'Extremely Busy':
      return 'bg-red-50';
    case 'Closed':
      return 'bg-gray-50';
    default:
      return 'bg-green-50';
  }
};