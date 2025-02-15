import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { LocationService } from '../services/locationService';
import type { Location } from '../types/location';

interface LocationContextType {
  locations: Location[];
  refreshLocations: () => Promise<void>;
  getLocation: (locationId: string) => Location | undefined;
  lastUpdate: number;
  isLoading: boolean;
}

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const refreshInterval = useRef<ReturnType<typeof setInterval>>();

  const refreshLocations = async () => {
    try {
      setIsLoading(true);
      const updatedLocations = await LocationService.getAllLocations();
      setLocations(updatedLocations);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error refreshing locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLocations();

    // Set up auto-refresh every 5 minutes
    refreshInterval.current = setInterval(refreshLocations, 5 * 60 * 1000);

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
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
      isLoading
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