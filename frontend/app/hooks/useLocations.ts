import { useLocations as useLocationContext } from '../context/LocationContext';
import { useMemo } from 'react';
import type { Location } from '../types/location';
import { getStatusText } from '@/app/_utils/businessUtils';
import { isLocationOpen } from '@/app/_utils/timeUtils';
import { getDistanceValue, isWithinDistance } from '@/app/_utils/distanceUtils';

export const useLocations = (selectedFilters: string[] = []) => {
  // Get everything from the context
  const { locations, isLoading, lastUpdate, refreshLocations, forceRefresh } = useLocationContext();

  // Filter locations based on selected filters
  const filteredLocations = useMemo(() => {
    if (selectedFilters.length === 0) return locations;
    
    return locations.filter(location => {
      // Handle distance filter
      const distanceFilter = selectedFilters.find(f => f.startsWith('distance-'));
      if (distanceFilter) {
        const maxDistance = getDistanceValue(distanceFilter);
        if (!isWithinDistance(location, maxDistance)) {
          return false;
        }
      }

      const status = getStatusText(location);
      const percentage = location.crowdInfo?.percentage || 0;
      const isOpen = isLocationOpen(location);

      // Check if any of the selected filters match the location
      return selectedFilters.some(filter => {
        if (filter.startsWith('distance-')) return true; // Skip distance filters here
        
        // Handle status filters separately
        if (filter === 'open' || filter === 'closed') {
          const statusMatch = (filter === 'open' && isOpen) || (filter === 'closed' && !isOpen);
          // If there are other filters besides open/closed, check those too
          const otherFilters = selectedFilters.filter(f => f !== 'open' && f !== 'closed');
          if (otherFilters.length === 0) return statusMatch;
          
          // Check if location matches any other filter
          return statusMatch && otherFilters.some(otherFilter => {
            switch (otherFilter) {
              case 'very-busy':
                return status === 'Very Busy' || percentage >= 75;
              case 'fairly-busy':
                return status === 'Fairly Busy' || (percentage >= 40 && percentage < 75);
              case 'not-busy':
                return status === 'Not Busy' || percentage < 40;
              default:
                return Array.isArray(location.type) 
                  ? location.type.includes(otherFilter)
                  : location.type === otherFilter;
            }
          });
        }

        // Handle non-status filters
        switch (filter) {
          case 'very-busy':
            return status === 'Very Busy' || percentage >= 75;
          case 'fairly-busy':
            return status === 'Fairly Busy' || (percentage >= 40 && percentage < 75);
          case 'not-busy':
            return status === 'Not Busy' || percentage < 40;
          default:
            return Array.isArray(location.type) 
              ? location.type.includes(filter)
              : location.type === filter;
        }
      });
    });
  }, [locations, selectedFilters]);

  return { 
    locations: filteredLocations,
    loading: isLoading,
    lastUpdate,
    refreshLocations,
    forceRefresh
  };
};

export default useLocations; 