import { Location, LocationStatic, LocationDynamic } from '../types/location';
import { staticLocations } from '../data/staticLocations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoLocation from 'expo-location';
import { parseTimeString } from '../_utils/timeUtils';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';

const CACHE_KEYS = {
  CURRENT_STATUS: 'current_status_',
  WEEKLY_PATTERNS: 'weekly_patterns_',
  CACHE_DURATION: {
    CURRENT: 1000 * 60 * 30,    // 30 minutes for real-time data
    WEEKLY: 1000 * 60 * 60 * 24 * 7  // 7 days for weekly patterns
  }
};

interface WeeklyPatterns {
  timestamp: number;
  weeklyBusyness: LocationDynamic['weeklyBusyness'];
  hours: LocationDynamic['hours'];
  bestTimes: LocationDynamic['bestTimes'];
  dayData: LocationDynamic['dayData'];
}

interface CurrentStatus {
  timestamp: number;
  currentBusyness: number;
  statusText: string;
  description: string;
  untilText: string;
}

interface WeeklyData {
  timestamp: number;
  weeklyBusyness: LocationDynamic['weeklyBusyness'];
  hours: LocationDynamic['hours'];
  bestTimes: LocationDynamic['bestTimes'];
}

interface CurrentData {
  timestamp: number;
  currentStatus: LocationDynamic['currentStatus'];
}

interface CachedData {
  timestamp: number;
  data: LocationDynamic;
}

interface CachedLocationStatus {
  currentStatus: {
    statusText: string;
    currentCapacity?: {
      current: number;
      percentage: number;
    };
    description: string;
    untilText: string;
    realTimeOccupancy?: {
      mainBuilding?: {
        count: number;
        capacity: number;
        percentage: number;
      };
      studyRoom?: {
        count: number;
        capacity: number;
        percentage: number;
      };
    };
  };
  isOpen: boolean;
}

const KILOMETERS_TO_MILES = 0.621371;

// Add at the top of the file with other imports and constants
const cacheTimestamps: {
  [locationId: string]: {
    current: number;
    weekly: number;
  };
} = {};

// Helper function to convert and format distance
function formatDistance(distanceInKm: number): number {
  // Convert to miles and round to 1 decimal place
  return Number((distanceInKm * KILOMETERS_TO_MILES).toFixed(1));
}

// Helper function to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Add a startup flag
let isInitialLoad = true;

// Add a new method to reset all cache timestamps
const resetAllCacheTimestamps = () => {
  const now = Date.now();
  Object.keys(staticLocations).forEach(locationId => {
    cacheTimestamps[locationId] = {
      current: now,
      weekly: now
    };
  });
};

export const LocationService = {
  resetInitialLoadFlag: () => {
    isInitialLoad = true;
    resetAllCacheTimestamps(); // Reset all cache timestamps when resetting initial load
  },
  // Get a single location with combined static and dynamic data
  async getLocation(locationId: string): Promise<Location> {
    try {
      const staticData = staticLocations[locationId];
      if (!staticData) {
        throw new Error(`No static data found for location: ${locationId}`);
      }

      // Always fetch fresh data on initial load
      let dynamicData: LocationDynamic | null = null;
      
      if (isInitialLoad) {
        console.log('[getLocation] Initial load - fetching fresh API data');
        const response = await fetch(`${API_BASE_URL}/locations/${locationId}/crowd-data`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        dynamicData = await response.json() as LocationDynamic;
        console.log('[getLocation] Fresh API data received');
        await cacheData(locationId, dynamicData);
        
        // Set isInitialLoad to false after first successful load
        if (locationId === 'games' || locationId === '24hr') {
          isInitialLoad = false;
        }
      } else {
        // Try cache first on subsequent loads
        dynamicData = await getCachedData(locationId);
        
        if (!dynamicData) {
          console.log('[getLocation] Cache miss - fetching from API');
          const response = await fetch(`${API_BASE_URL}/locations/${locationId}/crowd-data`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          dynamicData = await response.json() as LocationDynamic;
          await cacheData(locationId, dynamicData);
        }
      }

      // Get user's location and calculate distance
      let distance = 0;
      try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const userLocation = await ExpoLocation.getCurrentPositionAsync({});
          if (staticData.coordinates) {
            distance = calculateDistance(
              userLocation.coords.latitude,
              userLocation.coords.longitude,
              staticData.coordinates.latitude,
              staticData.coordinates.longitude
            );
          }
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }

      // Get current status from day data
      const currentStatusData = getCurrentStatusFromDayData(dynamicData.dayData);
      const currentDay = getCurrentDay();

      // Log comparison between prediction and actual
      const currentHour = new Date().getHours();
      const currentPrediction = dynamicData?.weeklyBusyness?.[currentDay]?.find(
        hourData => parseInt(hourData.time) === currentHour
      );

      // Combine weekly hours with any special hours for today
      const hours = {
        ...dynamicData?.hours || {}, // Keep all weekly hours
        ...(dynamicData?.hours?.[currentDay] ? { // Override today's hours if available
          [currentDay]: dynamicData.hours[currentDay]
        } : {})
      };

      return {
        ...staticData,
        ...currentStatusData,
        hours,
        dayData: dynamicData?.dayData || [],
        weeklyBusyness: dynamicData?.weeklyBusyness || {},
        currentCapacity: currentStatusData.crowdInfo.percentage,
        bestTimes: dynamicData?.bestTimes || {
          best: 'Unknown',
          worst: 'Unknown'
        },
        closingTime: hours[currentDay]?.close || 'Hours unavailable',
        distance: Number(distance.toFixed(1))
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
      return {
        ...staticLocations[locationId],
        hours: {},
        currentStatus: 'Unknown',
        currentCapacity: 0,
        bestTimes: {
          best: 'Unknown',
          worst: 'Unknown'
        },
        crowdInfo: {
          level: 'Unknown',
          percentage: 0,
          description: 'Data currently unavailable'
        },
        weeklyBusyness: {},
        closingTime: 'Hours unavailable',
        distance: 0,
        dayData: []
      };
    }
  },

  // Add new getAllLocations method
  async getAllLocations(): Promise<Location[]> {
    try {
      
      let locations: Location[] = [];
      
      if (isInitialLoad) {
        // Bulk fetch on initial load
        console.log('[getAllLocations] Performing bulk fetch for initial load');
        const response = await fetch(`${API_BASE_URL}/locations/bulk-data`);
        if (!response.ok) throw new Error('Bulk fetch failed');
        
        const bulkData = await response.json();        
        // Cache the bulk data
        for (const [id, data] of Object.entries(bulkData)) {
          await cacheData(id, data as LocationDynamic);
        }
        
        // Set initial load to false after successful fetch
        isInitialLoad = false;
      }
      
      // Get all locations (either from cache or individual API calls)
      locations = await Promise.all(
        Object.keys(staticLocations).map(id => this.getLocation(id))
      );

      return locations;
    } catch (error) {
      console.error('Error in getAllLocations:', error);
      isInitialLoad = false; // Reset on error
      // ... error handling ...
    }
  },

  async getLocationDetails(id: string): Promise<Location> {
    try {
      // Fetch basic location data
      const response = await fetch(`${API_BASE_URL}/locations/${id}`);
      const locationData = await response.json();

      // Fetch crowd data separately if needed
      const crowdResponse = await fetch(`${API_BASE_URL}/locations/${id}/crowd`);
      const crowdData = await crowdResponse.json();

      // Combine the data
      return {
        ...locationData,
        weeklyBusyness: crowdData.weeklyBusyness || {},
      };
    } catch (error) {
      console.error('Error fetching location details:', error);
      throw error;
    }
  },

  // Add a specific method for crowd data if needed
  async getLocationCrowdData(id: string) {
    try {
      // Get static data
      const staticData = staticLocations[id];
      if (!staticData) {
        throw new Error(`No static data found for location: ${id}`);
      }

      // Try to get cached data
      const cachedData = await getCachedData(id);
      
      // If no cached data or current status is stale, fetch new data
      if (!cachedData) {
        console.log('Fetching fresh data from API');
        const response = await fetch(`${API_BASE_URL}/locations/${id}/crowd-data`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData = await response.json();
        await cacheData(id, apiData);
        return formatCrowdData(apiData);
      }

      return formatCrowdData(cachedData);
    } catch (error) {
      console.error('Error fetching crowd data:', error);
      return {
        weeklyBusyness: {},
        currentStatus: {
          statusText: 'Unknown',
          currentCapacity: {
            current: 0,
            percentage: 0
          },
          description: 'Unable to fetch current data',
          untilText: ''
        },
        hours: {}
      };
    }
  },

  // 2. Add bulk fetch method
  async getAllLocationsData(): Promise<Location[]> {
    try {
      // Single API call to get all locations
      const response = await fetch(`${API_BASE_URL}/locations/bulk-data`);
      if (!response.ok) throw new Error('Bulk fetch failed');
      const data = await response.json();
      
      // Cache all locations at once
      Object.entries(data).forEach(([id, locationData]) => {
        cacheData(id, locationData as LocationDynamic);
      });
      
      return this.getAllLocations(); // Use existing method to combine with static data
    } catch (error) {
      console.error('Bulk fetch failed:', error);
      return this.getAllLocations(); // Fallback to individual fetches
    }
  },

  // Get a single location with combined static and dynamic data
  async getLocationData(locationId: string): Promise<any> {
    try {
      // Log the API call attempt
      console.log(`Fetching data for location: ${locationId}`);
      
      // Make sure this URL matches your backend route
      const response = await fetch(`http://localhost:3000/api/locations/${locationId}/crowd-data`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Received data:');
      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  },

  // Get bulk location data
  async getBulkLocationData(): Promise<any> {
    try {
      console.log('Fetching bulk location data');
      const response = await fetch('http://localhost:3000/api/locations/bulk-data');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Received bulk data');
      return data;
    } catch (error) {
      console.error('Error fetching bulk location data');
      throw error;
    }
  },

  async getCachedLocationStatus(locationId: string): Promise<CachedLocationStatus | null> {
    try {
      // Get cached data
      const currentCache = await AsyncStorage.getItem(CACHE_KEYS.CURRENT_STATUS + locationId);
      if (!currentCache) return null;

      const data = JSON.parse(currentCache);
      const now = Date.now();

      // Check if cache is still valid (within 2 hours)
      if (now - data.timestamp > CACHE_KEYS.CACHE_DURATION.CURRENT) {
        return null;
      }

      // Special handling for library
      if (locationId === 'library' && data.currentStatus?.realTimeOccupancy) {
        return {
          currentStatus: data.currentStatus,
          isOpen: Boolean(data.currentStatus.realTimeOccupancy.mainBuilding?.count > 0)
        };
      }

      // For other locations
      return {
        currentStatus: {
          statusText: data.statusText,
          currentCapacity: data.currentCapacity,
          description: data.description,
          untilText: data.untilText
        },
        isOpen: data.isOpen
      };
    } catch (error) {
      console.error('Error getting cached location status:', error);
      return null;
    }
  }
};

// Cache helper functions
async function getCachedData(locationId: string): Promise<LocationDynamic | null> {
  try {
    const currentCache = await AsyncStorage.getItem(CACHE_KEYS.CURRENT_STATUS + locationId);
    const weeklyCache = await AsyncStorage.getItem(CACHE_KEYS.WEEKLY_PATTERNS + locationId);
    
    if (!currentCache || !weeklyCache) {
      console.log('[getCachedData] No cache found for:', locationId);
      return null;
    }

    const currentData = JSON.parse(currentCache);
    const weeklyData = JSON.parse(weeklyCache);
    const now = Date.now();

    // Log cache status
    console.log('[getCachedData] Cache status for', locationId, {
      currentAge: now - currentData.timestamp,
      weeklyAge: now - weeklyData.timestamp,
      currentValid: now - currentData.timestamp < CACHE_KEYS.CACHE_DURATION.CURRENT,
      weeklyValid: now - weeklyData.timestamp < CACHE_KEYS.CACHE_DURATION.WEEKLY
    });

    // Stricter cache validation
    if (now - currentData.timestamp >= CACHE_KEYS.CACHE_DURATION.CURRENT) {
      console.log('[getCachedData] Current data cache expired');
      return null;
    }

    // Combine the data
    return {
      hours: weeklyData.hours,
      weeklyBusyness: weeklyData.weeklyBusyness,
      currentStatus: {
        statusText: currentData.statusText,
        currentCapacity: {
          current: currentData.currentBusyness,
          percentage: currentData.currentBusyness
        },
        description: currentData.description,
        untilText: currentData.untilText
      },
      bestTimes: weeklyData.bestTimes,
      dayData: weeklyData.weeklyBusyness[getCurrentDay()] || []
    };
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

async function cacheData(locationId: string, data: LocationDynamic) {
  try {
    const now = Date.now();
    
    // Cache weekly patterns
    const weeklyData: WeeklyPatterns = {
      timestamp: now,
      weeklyBusyness: data.weeklyBusyness,
      hours: data.hours,
      bestTimes: data.bestTimes,
      dayData: data.dayData
    };
    await AsyncStorage.setItem(
      CACHE_KEYS.WEEKLY_PATTERNS + locationId, 
      JSON.stringify(weeklyData)
    );

    // Cache current status
    const currentData: CurrentStatus = {
      timestamp: now,
      currentBusyness: data.currentStatus.currentCapacity?.current || 0,
      statusText: data.currentStatus.statusText,
      description: data.currentStatus.description,
      untilText: data.currentStatus.untilText
    };
    await AsyncStorage.setItem(
      CACHE_KEYS.CURRENT_STATUS + locationId, 
      JSON.stringify(currentData)
    );
  } catch (error) {
    console.error('Cache storage error:', error);
  }
}

function formatCrowdData(data: any) {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[now.getDay()];
  const todayHours = data.hours?.[currentDay];
  
  // Use timeUtils for consistency
  const isOpen = checkIfOpen(todayHours, now.getHours(), now.getMinutes());

  if (!isOpen) {
    return {
      weeklyBusyness: data.weeklyBusyness || {},
      currentStatus: {
        statusText: 'Closed',
        currentCapacity: {
          current: 0,
          percentage: 0
        },
        description: 'Location is currently closed',
        untilText: todayHours?.open ? `Opens at ${todayHours.open}` : 'Closed today'
      },
      hours: data.hours || {}
    };
  }

  // Special handling for library and 24hr study room
  if (data.id === 'library' || data.id === '24hr') {
    return {
      weeklyBusyness: data.weeklyBusyness || {},
      currentStatus: {
        statusText: data.currentStatus?.statusText || 'Unknown',
        currentCapacity: data.currentStatus?.currentCapacity || {
          current: 0,
          percentage: 0
        },
        description: data.currentStatus?.description || '',
        untilText: data.currentStatus?.untilText || '',
        realTimeOccupancy: data.currentStatus?.realTimeOccupancy
      },
      hours: data.hours || {}
    };
  }

  return {
    weeklyBusyness: data.weeklyBusyness || {},
    currentStatus: {
      statusText: getBusyStatusText(data.currentStatus?.busyness),
      currentCapacity: {
        current: data.currentStatus?.busyness || 0,
        percentage: data.currentStatus?.busyness || 0
      },
      description: data.currentStatus?.description || '',
      untilText: data.currentStatus?.typicalDuration || ''
    },
    hours: data.hours || {}
  };
}

function checkIfOpen(hours: { open: string; close: string } | undefined, currentHour: number, currentMinutes: number): boolean {
  // Use timeUtils parsing for consistency
  if (!hours || hours.open === 'Closed') return false;

  const openTime = parseTimeString(hours.open);
  const closeTime = parseTimeString(hours.close, true);
  const currentTime = currentHour * 60 + currentMinutes;

  return currentTime >= openTime && currentTime <= closeTime;
}

function getBusyStatusText(busyness: number | undefined): string {
  if (busyness === undefined || busyness === null) return 'Unknown';
  if (busyness === 0) return 'Not Busy';
  if (busyness < 20) return 'Not Too Busy';
  if (busyness < 50) return 'A Bit Busy';
  if (busyness < 70) return 'Fairly Busy';
  if (busyness < 90) return 'Very Busy';
  return 'Extremely Busy';
}

const getCurrentStatusFromDayData = (dayData: any[]) => {
  const currentHour = new Date().getHours();
  const currentData = dayData?.find(data => {
    // Use timeUtils parsing for consistency
    const timeValue = parseTimeString(data.time);
    const hour = Math.floor(timeValue / 60);
    return hour === currentHour;
  });

  return {
    currentStatus: currentData?.description || 'Unknown',
    crowdInfo: {
      level: currentData?.description || 'Unknown',
      percentage: currentData?.busyness || 0,
      description: currentData?.description || 'No current data'
    }
  };
};

// Helper function to get current day
const getCurrentDay = (): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

export default LocationService;