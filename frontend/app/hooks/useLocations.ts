import { useState, useEffect } from 'react';
import { Location } from '../types/location';
import { LocationService } from '../services/locationService';

export const useLocations = (selectedFilters: string[] = []) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await LocationService.getAllLocations();
        setLocations(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchLocations();
  }, [updateTrigger]);

  // Filter locations based on selected filters
  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredLocations(locations);
      return;
    }

    const filtered = locations.filter(location => 
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

    setFilteredLocations(filtered);
  }, [locations, selectedFilters]);

  return { 
    locations: filteredLocations,
    loading,
    error,
    refreshLocations: () => {
      setUpdateTrigger(prev => prev + 1);
    }
  };
};

export default {
  useLocations
}; 