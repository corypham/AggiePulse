import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { LocationService } from '../services/locationService';
import type { Location } from '../types/location';

interface LocationContextType {
  locations: Location[];
  refreshLocations: () => Promise<void>;
  lastUpdate: Date;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const refreshInterval = useRef<number>();
  const isInitialLoad = useRef(true);

  const refreshLocations = async () => {
    try {
      const updatedLocations = await LocationService.getAllLocationsData();
      setLocations(updatedLocations);
      setLastUpdate(new Date());
      isInitialLoad.current = false;
    } catch (error) {
      console.error('Error refreshing locations:', error);
    }
  };

  useEffect(() => {
    // Immediate first load
    refreshLocations();

    // Set up refresh interval
    refreshInterval.current = setInterval(refreshLocations, 5 * 60 * 1000);

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, []);

  return (
    <LocationContext.Provider value={{ 
      locations, 
      refreshLocations, 
      lastUpdate,
      isLoading: isInitialLoad.current 
    }}>
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