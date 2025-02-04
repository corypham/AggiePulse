import { useState, useEffect, useCallback, useRef } from 'react';
import { Location } from '../types/location';
import { LocationService } from '../services/locationService';
import { cacheService } from '../services/cacheService';

export const useLocations = (selectedFilters: string[] = []) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        const cachedLocations = cacheService.get<Location[]>('locations');
        if (cachedLocations) {
          setLocations(cachedLocations);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const data = await LocationService.getAllLocations();
        
        // Apply filters if any
        const filteredData = selectedFilters.length > 0
          ? data.filter(location => 
              location.type.some(t => selectedFilters.includes(t))
            )
          : data;

        // Cache the results
        cacheService.set('locations', filteredData);
        if (isMounted.current) {
          setLocations(filteredData);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchLocations();
  }, [selectedFilters]);

  // Update business meters periodically
  useEffect(() => {
    if (locations.length === 0) return;

    const updateBusinessMeters = async () => {
      try {
        const updatedLocations = await Promise.all(
          locations.map(async (location) => {
            const meters = await LocationService.getBusinessMeters(location.id);
            return {
              ...location,
              currentStatus: meters.occupancy > 80 ? 'Very Busy' 
                : meters.occupancy > 40 ? 'Fairly Busy' 
                : 'Not Busy'
            } as Location; // Type assertion to ensure type safety
          })
        );

        if (isMounted.current) {
          setLocations(updatedLocations);
        }
      } catch (error) {
        console.error('Error updating business meters:', error);
      }
    };

    const interval = setInterval(updateBusinessMeters, 60000); // Every minute
    
    return () => {
      clearInterval(interval);
      isMounted.current = false;
    };
  }, [locations]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { locations, loading, error };
}; 