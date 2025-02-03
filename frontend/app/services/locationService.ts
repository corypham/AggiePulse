// Path: frontend/services/locationService.ts

import { Location, BusyStatus } from '../types/location';
import { mockLocations } from '../data/mockLocations';

export const LocationService = {
  // Get all locations
  getAllLocations: async (): Promise<Location[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLocations;
  },

  // Search locations by name
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
    return mockLocations.filter(location => location.currentStatus === status);
  },

  // Get a single location by ID
  getLocationById: async (id: string): Promise<Location | undefined> => {
    return mockLocations.find(location => location.id === id);
  }
};

export default LocationService;