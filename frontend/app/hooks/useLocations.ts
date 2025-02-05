import { useState, useEffect, useCallback, useRef } from 'react';
import { Location } from '../types/location';
import { LocationService } from '../services/locationService';
import { cacheService } from '../services/cacheService';

export const useLocations = (selectedFilters: string[] = []) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        const cachedLocations = cacheService.get<Location[]>('locations');
        if (cachedLocations) {
          setLocations(cachedLocations);
        } else {
          // Fetch fresh data
          const data = await LocationService.getAllLocations();
          cacheService.set('locations', data);
          if (isMounted.current) {
            setLocations(data);
          }
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
  }, []);

  // Filter locations based on selected filters
  useEffect(() => {
    const filterLocations = () => {
      if (selectedFilters.length === 0) {
        setFilteredLocations(locations);
        return;
      }

      const filtered = locations.filter(location => {
        return selectedFilters.some(filter => {
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
        });
      });

      setFilteredLocations(filtered);
    };

    filterLocations();
  }, [locations, selectedFilters]);

  // Update business meters periodically
  useEffect(() => {
    if (locations.length === 0) return;
    const isMounted = useRef(true);

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
            } as Location;
          })
        );

        if (isMounted.current) {
          setLocations(prev => {
            // Only update if there are actual changes
            const hasChanges = updatedLocations.some((loc, index) => 
              loc.currentStatus !== prev[index].currentStatus
            );
            return hasChanges ? updatedLocations : prev;
          });
        }
      } catch (error) {
        console.error('Error updating business meters:', error);
      }
    };

    const interval = setInterval(updateBusinessMeters, 60000);
    
    return () => {
      clearInterval(interval);
      isMounted.current = false;
    };
  }, []); // Empty dependency array since we're using setLocations with function update

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { 
    locations: filteredLocations,
    loading, 
    error 
  };
}; 