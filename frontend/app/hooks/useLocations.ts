import { useLocations as useLocationContext } from '../context/LocationContext';
import { useState, useCallback, useEffect } from 'react';
import LocationService from '../services/locationService';
import { Location } from '../types/location';

export const useLocations = (selectedFilters: string[] = []) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const context = useLocationContext();

  const fetchLocations = useCallback(async () => {
    try {
      const data: Location[] = await LocationService.getAllLocations();
      setLocations(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
    
    // Poll for updates every 5 minutes
    const interval = setInterval(fetchLocations, 1000 * 60 * 15);
    
    return () => clearInterval(interval);
  }, [fetchLocations]);

  // Filter locations based on selected filters
  const filteredLocations = selectedFilters.length === 0 
    ? locations 
    : locations.filter(location => 
        selectedFilters.some(filter => {
          switch (filter) {
            case 'very-busy':
              return location.currentStatus === 'Very Busy';
            case 'fairly-busy':
              return location.currentStatus === 'Fairly Busy';
            case 'not-busy':
              return location.currentStatus === 'Not Busy';
            default:
              return location.type.includes(filter);
          }
        })
      );

  return { 
    locations: filteredLocations,
    loading: context.isLoading,
    lastUpdate,
    refreshLocations: fetchLocations
  };
};

export default useLocations; 