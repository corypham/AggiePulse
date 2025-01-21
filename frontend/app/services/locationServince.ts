// Path: frontend/services/locationService.ts

import { Location } from '../types/location';
import { mockLocations } from '../data/mockLocations';

export const LocationService = {
  // Get all locations
  getAllLocations: async (): Promise<Location[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLocations;
  },

  // Search locations by name or building
  searchLocations: async (query: string): Promise<Location[]> => {
    const searchTerm = query.toLowerCase();
    return mockLocations.filter(location => 
      location.name.toLowerCase().includes(searchTerm) || 
      location.buildingName.toLowerCase().includes(searchTerm)
    );
  },

  // Filter locations by type
  filterByType: async (types: ('study' | 'gym' | 'dining')[]): Promise<Location[]> => {
    return mockLocations.filter(location => 
      location.type.some(t => types.includes(t))
    );
  },

  // Filter by status
  filterByStatus: async (status: 'Not Busy' | 'Busy' | 'Very Busy'): Promise<Location[]> => {
    return mockLocations.filter(location => location.status === status);
  },

  // Get a single location by ID
  getLocationById: async (id: string): Promise<Location | undefined> => {
    return mockLocations.find(location => location.id === id);
  }
};

export default LocationService;