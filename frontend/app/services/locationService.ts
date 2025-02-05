// Path: frontend/services/locationService.ts

import { Location, BusyStatus } from '../types/location';
import { mockLocations } from '../data/mockLocations';

// Base API URL - you'll change this later
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://your-production-api.com/api'; // Production

export const LocationService = {
  // Get all locations (will be API-based later)
  getAllLocations: async (): Promise<Location[]> => {
    try {
      // Currently using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockLocations;
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
      const location = mockLocations.find(loc => loc.id === locationId);
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
    return mockLocations.filter(location => 
      location.name.toLowerCase().includes(searchTerm)
    );
  },

  // Filter locations by type
  filterByType: async (types: string[]): Promise<Location[]> => {
    return mockLocations.filter(location => 
      location.type.some(t => types.includes(t))
    );
  },

  // Filter by status
  filterByStatus: async (status: BusyStatus): Promise<Location[]> => {
    return mockLocations.filter(location => 
      location.currentStatus === status
    );
  },

  // Get a single location by ID
  getLocationById: async (id: string): Promise<Location | undefined> => {
    try {
      return mockLocations.find(location => location.id === id);
    } catch (error) {
      throw new Error('Failed to fetch location');
    }
  }
};

export default LocationService;