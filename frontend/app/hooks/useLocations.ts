import { useLocations as useLocationContext } from '../context/LocationContext';

export const useLocations = (selectedFilters: string[] = []) => {
  const context = useLocationContext();

  // Filter locations based on selected filters
  const filteredLocations = selectedFilters.length === 0 
    ? context.locations 
    : context.locations.filter(location => 
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
    lastUpdate: context.lastUpdate,
    refreshLocations: context.refreshLocations
  };
};

export default {
  useLocations
}; 