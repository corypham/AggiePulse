// Path: frontend/services/locationService.ts

import { Location, BusyStatus } from '../types/location';
import { getInitialMockLocations } from '../data/mockLocations';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - you'll change this later
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://your-production-api.com/api'; // Production

// This will be replaced with real API endpoints later
const API_ENDPOINTS = {
  getAllLocations: '/locations',
  getLocationById: (id: string) => `/locations/${id}`,
  getOperatingHours: (id: string) => `/locations/${id}/hours`,
  getBusinessMeters: (id: string) => `/locations/${id}/metrics`,
} as const;

interface CachedData {
  timestamp: number;
  data: any;
}

const CACHE_KEYS = {
  LOCATION_DATA: 'location_data_',  // Will be appended with locationId
  CACHE_DURATION: {
    HOURS: 1000 * 60 * 60,         // 1 hour in milliseconds
    DAY: 1000 * 60 * 60 * 24,      // 1 day in milliseconds
    WEEK: 1000 * 60 * 60 * 24 * 7  // 1 week in milliseconds
  }
};

export const LocationService = {
  // Get all locations (will be API-based later)
  getAllLocations: async (): Promise<Location[]> => {
    try {
      // In development, use mock data
      if (__DEV__) {
        return getInitialMockLocations();
      }
      // In production, this will be replaced with actual API call:
      // const response = await fetch(API_BASE_URL + API_ENDPOINTS.getAllLocations);
      // return response.json();
      
      return getInitialMockLocations();
    } catch (error) {
      throw new Error('Failed to fetch locations');
    }
  },

  // Get real-time business meters
  getBusinessMeters: async (locationId: string): Promise<{
    occupancy: number;
    lastUpdated: string;
  }> => {
    try {
      return {
        occupancy: Math.floor(Math.random() * 100),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw new Error('Failed to fetch business meters');
    }
  },

  // Get operating hours
  getOperatingHours: async (locationId: string): Promise<{
    isOpen: boolean;
    closingTime: string;
    schedule: Record<string, { open: string; close: string }>;
  }> => {
    try {
      const location = getInitialMockLocations().find(loc => loc.id === locationId);
      return {
        isOpen: location?.isOpen ?? false,
        closingTime: location?.closingTime ?? '',
        schedule: {
          monday: { open: '7:00', close: '23:00' },
          tuesday: { open: '7:00', close: '23:00' },
          wednesday: { open: '7:00', close: '23:00' },
          thursday: { open: '7:00', close: '23:00' },
          friday: { open: '7:00', close: '21:00' },
          saturday: { open: '9:00', close: '21:00' },
          sunday: { open: '9:00', close: '21:00' },
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch operating hours');
    }
  },

  // Search locations (will be API-based later)
  searchLocations: async (query: string): Promise<Location[]> => {
    const searchTerm = query.toLowerCase();
    return getInitialMockLocations().filter(location => 
      location.name.toLowerCase().includes(searchTerm)
    );
  },

  // Filter locations by type
  filterByType: async (types: string[]): Promise<Location[]> => {
    return getInitialMockLocations().filter(location => 
      location.type.some(t => types.includes(t))
    );
  },

  // Filter by status
  filterByStatus: async (status: BusyStatus): Promise<Location[]> => {
    return getInitialMockLocations().filter(location => 
      location.currentStatus === status
    );
  },

  // Get a single location by ID
  getLocationById: async (id: string): Promise<Location | undefined> => {
    try {
      // This structure makes it easy to replace with real API call later
      return getInitialMockLocations().find(location => location.id === id);
    } catch (error) {
      throw new Error('Failed to fetch location');
    }
  },

  getLocationCrowdData: async (locationId: string) => {
    try {
      // Try to get cached data first
      const cachedData = await getCachedData(locationId);
      
      if (cachedData) {
        console.log('LocationService: Using cached data for:', locationId);
        return cachedData;
      }

      // If no cache or expired, fetch new data
      console.log('LocationService: Fetching fresh data for:', locationId);
      const response = await fetch(`${API_BASE_URL}/location/${locationId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the new data
      await cacheData(locationId, data);
      
      return data;
    } catch (error) {
      console.error('LocationService Error:', error);
      throw error;
    }
  },
};

async function getCachedData(locationId: string): Promise<any | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.LOCATION_DATA + locationId);
    if (!cached) return null;

    const { timestamp, data }: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Different cache durations for different data types
    const isHoursCurrent = now - timestamp < CACHE_KEYS.CACHE_DURATION.WEEK;  // Weekly for hours
    const isBusynessCurrent = now - timestamp < CACHE_KEYS.CACHE_DURATION.DAY; // Daily for busyness

    // If either needs updating, return null to trigger fresh fetch
    if (!isHoursCurrent || !isBusynessCurrent) {
      console.log('LocationService: Cache expired for:', locationId);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

async function cacheData(locationId: string, data: any): Promise<void> {
  try {
    const cacheData: CachedData = {
      timestamp: Date.now(),
      data
    };
    await AsyncStorage.setItem(
      CACHE_KEYS.LOCATION_DATA + locationId, 
      JSON.stringify(cacheData)
    );
  } catch (error) {
    console.error('Cache storage error:', error);
  }
}

export default LocationService;