import { Location, LocationStatic, LocationDynamic } from '../types/location';
import { staticLocations } from '../data/staticLocations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoLocation from 'expo-location';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';

const CACHE_KEYS = {
  LOCATION_DATA: 'location_data_',
  WEEKLY_DATA: 'weekly_data_',  // New key for weekly data
  CACHE_DURATION: {
    HOUR: 1000 * 60 * 5,      // Update every 5 minutes instead of hourly
    WEEK: 1000 * 60 * 60 * 24 * 7  // For weekly patterns
  }
};

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
      // Get static data
      const staticData = staticLocations[locationId];
      if (!staticData) {
        throw new Error(`No static data found for location: ${locationId}`);
      }

      // Try to get cached dynamic data
      let dynamicData = await getCachedData(locationId);

      // If no cached data, fetch from API
      if (!dynamicData) {
        console.log('LocationService: Fetching fresh data for:', locationId);
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

      return {
        ...staticData,
        hours: dynamicData?.hours || {},
        currentStatus: dynamicData?.currentStatus?.statusText || 'Unknown',
        currentCapacity: dynamicData?.currentStatus?.currentCapacity?.current || 0,
        bestTimes: {
          best: dynamicData?.bestTimes?.best || 'Unknown',
          worst: dynamicData?.bestTimes?.worst || 'Unknown'
        },
        crowdInfo: {
          level: dynamicData?.currentStatus?.statusText || 'Unknown',
          percentage: dynamicData?.currentStatus?.currentCapacity?.percentage || 0,
          description: dynamicData?.currentStatus?.description || 'Data currently unavailable'
        },
        weeklyBusyness: dynamicData?.weeklyBusyness || {},
        closingTime: dynamicData?.currentStatus?.untilText || 'Hours unavailable',
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
        distance: 0
      };
    }
  },

  // Add new getAllLocations method
  async getAllLocations(): Promise<Location[]> {
    try {
      // Get user's location first
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      let userLocation: ExpoLocation.LocationObject | null = null;
      
      if (status === 'granted') {
        userLocation = await ExpoLocation.getCurrentPositionAsync({});
      }

      const locations = await Promise.all(
        Object.keys(staticLocations).map(async (id) => {
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
        })
      );

      return locations;
    } catch (error) {
      console.error('Error fetching all locations:', error);
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
        closingTime: 'Hours unavailable',
        distance: 0
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

      // Try to get cached dynamic data
      const cachedData = await getCachedData(id);
      console.log('Dynamic data from cache:', cachedData);

      // If no cached data, fetch from API
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
          statusText: 'Closed',
          currentCapacity: {
            current: 0,
            percentage: 0
          },
          description: 'Location is currently closed',
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
  }
};

// Cache helper functions
async function getCachedData(locationId: string): Promise<LocationDynamic | null> {
  try {
    // Get weekly data (patterns and hours)
    const weeklyCache = await AsyncStorage.getItem(CACHE_KEYS.WEEKLY_DATA + locationId);
    const weeklyData: WeeklyData | null = weeklyCache ? JSON.parse(weeklyCache) : null;

    // Get current status (updates hourly)
    const currentCache = await AsyncStorage.getItem(CACHE_KEYS.LOCATION_DATA + locationId);
    const currentData: CurrentData | null = currentCache ? JSON.parse(currentCache) : null;

    const now = Date.now();

    // Check if we need new weekly data
    const needWeeklyUpdate = !weeklyData || (now - weeklyData.timestamp > CACHE_KEYS.CACHE_DURATION.WEEK);
    
    // Check if we need new current data
    const needCurrentUpdate = !currentData || (now - currentData.timestamp > CACHE_KEYS.CACHE_DURATION.HOUR);

    if (needWeeklyUpdate || needCurrentUpdate) {
      return null;
    }

    // Combine data with bestTimes
    return {
      hours: weeklyData.hours,
      weeklyBusyness: weeklyData.weeklyBusyness,
      currentStatus: currentData.currentStatus,
      bestTimes: weeklyData.bestTimes || {
        best: 'Unknown',
        worst: 'Unknown'
      }
    };
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

async function cacheData(locationId: string, data: LocationDynamic) {
  try {
    const now = Date.now();
    
    // Cache weekly data
    const weeklyData: WeeklyData = {
      timestamp: now,
      weeklyBusyness: data.weeklyBusyness,
      hours: data.hours,
      bestTimes: data.bestTimes || {
        best: 'Unknown',
        worst: 'Unknown'
      }
    };
    await AsyncStorage.setItem(
      CACHE_KEYS.WEEKLY_DATA + locationId, 
      JSON.stringify(weeklyData)
    );

    // Cache current status
    const currentData: CurrentData = {
      timestamp: now,
      currentStatus: data.currentStatus
    };
    await AsyncStorage.setItem(
      CACHE_KEYS.LOCATION_DATA + locationId, 
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
  if (busyness < 30) return 'Not Too Busy';
  if (busyness < 50) return 'A Bit Busy';
  if (busyness < 70) return 'Fairly Busy';
  if (busyness < 90) return 'Very Busy';
  return 'Extremely Busy';
}

export default LocationService;