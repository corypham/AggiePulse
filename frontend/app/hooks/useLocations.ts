import { useLocations as useLocationContext } from '../context/LocationContext';
import { useMemo } from 'react';
import type { Location } from '../types/location';

export const useLocations = (selectedFilters: string[] = []) => {
  // Get everything from the context
  const { locations, isLoading, lastUpdate, refreshLocations } = useLocationContext();

  // Filter locations based on selected filters using useMemo to optimize performance
  const filteredLocations = useMemo(() => 
    selectedFilters.length === 0 
      ? locations 
      : locations.filter(location => 
          selectedFilters.some(filter => {
            switch (filter) {
              case 'very-busy':
                return location.currentStatus?.statusText === 'Very Busy';
              case 'fairly-busy':
                return location.currentStatus?.statusText === 'Fairly Busy';
              case 'not-busy':
                return location.currentStatus?.statusText === 'Not Busy';
              default:
                return location.type?.includes(filter);
            }
          })
        ),
    [locations, selectedFilters]
  );

  return { 
    locations: filteredLocations,
    loading: isLoading,
    lastUpdate,
    refreshLocations
  };
};

export default useLocations; 