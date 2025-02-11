import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { LocationService } from '../services/locationService';
import type { Location } from '../types/location';

interface LocationContextType {
  locations: Location[];
  refreshLocations: () => Promise<void>;
  getLocation: (locationId: string) => Location | undefined;
  lastUpdate: Date;
  isLoading: boolean;
}

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

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
    refreshLocations();
    refreshInterval.current = setInterval(refreshLocations, 5 * 60 * 1000);
    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, []);

  const getLocation = useCallback((locationId: string) => {
    return locations.find(loc => loc.id === locationId);
  }, [locations]);

  return (
    <LocationContext.Provider value={{ 
      locations, 
      refreshLocations,
      getLocation,
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