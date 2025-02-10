import React, { createContext, useContext, useEffect, useRef } from 'react';
import { LocationService } from '../services/locationService';
import type { Location } from '../types/location';

interface LocationContextType {
  locations: Location[];
  refreshLocations: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = React.useState<Location[]>([]);
  const refreshInterval = useRef<number>();

  const refreshLocations = async () => {
    try {
      const updatedLocations = await LocationService.getAllLocations();
      setLocations(updatedLocations);
    } catch (error) {
      console.error('Error refreshing locations:', error);
    }
  };

  useEffect(() => {
    refreshLocations(); // Initial load
    refreshInterval.current = setInterval(refreshLocations, 60000) as number; // Refresh every minute

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, []);

  return (
    <LocationContext.Provider value={{ locations, refreshLocations }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocations must be used within a LocationProvider');
  }
  return context;
}; 