import { Location, LocationStatic, LocationDynamic } from '../types/location';
import { staticLocations } from '../data/staticLocations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoLocation from 'expo-location';

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

export const LocationService = {
  // Get a single location with combined static and dynamic data
  async getLocation(locationId: string): Promise<Location> {
    try {
      const staticData = staticLocations[locationId];
      if (!staticData) {
        throw new Error(`No static data found for location: ${locationId}`);
      }

      // Get dynamic data
      let dynamicData = await getCachedData(locationId);
      
      if (!dynamicData) {
        const response = await fetch(`${API_BASE_URL}/locations/${locationId}/crowd-data`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        dynamicData = await response.json() as LocationDynamic;
        await cacheData(locationId, dynamicData);
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
    // Add artificial delay to test loading state
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      // Get user's location first
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      let userLocation: ExpoLocation.LocationObject | null = null;
      
      if (status === 'granted') {
        userLocation = await ExpoLocation.getCurrentPositionAsync({});
      }

      const locations = await Promise.all(
        Object.keys(staticLocations).map(async (id) => {
          try {
            const location = await this.getLocation(id);
            
            // Calculate distance if we have user location
            if (userLocation?.coords && staticLocations[id].coordinates) {
              const distance = calculateDistance(
                userLocation.coords.latitude,
                userLocation.coords.longitude,
                staticLocations[id].coordinates.latitude,
                staticLocations[id].coordinates.longitude
              );
              location.distance = Number(distance.toFixed(1));
            }
            
            return location;
          } catch (error) {
            console.error(`Error fetching location ${id}:`, error);
            // Return fallback data with all required properties
            return {
              ...staticLocations[id],
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
        })
      );

      return locations;
    } catch (error) {
      console.error('Error fetching all locations:', error);
      // Return fallback data for all locations
      return Object.entries(staticLocations).map(([id, staticData]) => ({
        ...staticData,
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
      }));
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
      console.log('Received data:', data);
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
      console.log('Received bulk data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching bulk location data:', error);
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
    // Get weekly patterns
    const weeklyCache = await AsyncStorage.getItem(CACHE_KEYS.WEEKLY_PATTERNS + locationId);
    const weeklyData: WeeklyPatterns | null = weeklyCache ? JSON.parse(weeklyCache) : null;

    // Get current status
    const currentCache = await AsyncStorage.getItem(CACHE_KEYS.CURRENT_STATUS + locationId);
    const currentData: CurrentStatus | null = currentCache ? JSON.parse(currentCache) : null;

    const now = Date.now();

    // Check if we need new data
    const needWeeklyUpdate = !weeklyData || (now - weeklyData.timestamp > CACHE_KEYS.CACHE_DURATION.WEEKLY);
    const needCurrentUpdate = !currentData || (now - currentData.timestamp > CACHE_KEYS.CACHE_DURATION.CURRENT);

    if (needWeeklyUpdate || needCurrentUpdate) {
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
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Check if location is currently open
  const todayHours = data.hours?.[currentDay];
  const isOpen = checkIfOpen(todayHours, currentHour, currentMinutes);

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

function convertTimeToMinutes(timeStr: string): number {
  const [time, period] = timeStr.split(' ');
  let [hoursStr, minutesStr = '0'] = time.split(':');
  let totalMinutes = parseInt(minutesStr);
  
  let hours = parseInt(hoursStr);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  totalMinutes += hours * 60;
  return totalMinutes;
}

function checkIfOpen(hours: { open: string; close: string } | undefined, currentHour: number, currentMinutes: number): boolean {
  if (!hours || hours.open === 'Closed') return false;

  const openTime = convertTimeToMinutes(hours.open);
  const closeTime = convertTimeToMinutes(hours.close);
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
    const hour = parseInt(data.time.split(' ')[0]);
    const isPM = data.time.includes('PM');
    return (isPM ? hour + 12 : hour) === currentHour;
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