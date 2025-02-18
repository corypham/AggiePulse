import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { LocationService } from '../services/locationService';
import type { Location } from '../types/location';
import * as ExpoLocation from 'expo-location';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Define refresh intervals
const REFRESH_INTERVALS = {
  REALTIME_API: 2 * 60 * 60 * 1000,    // 2 hours for fresh API calls
  STATUS_UPDATE: 30 * 60 * 1000,       // 30 minutes for status/busyness updates
  LOCATION: 30 * 1000,                 // 30 seconds for user location updates
  WEEKLY: 7 * 24 * 60 * 60 * 1000,    // 7 days for weekly patterns
  LIBRARY: 5 * 60 * 1000              // 5 minutes for library real-time data
};

interface LocationContextType {
  locations: Location[];
  refreshLocations: () => Promise<void>;
  getLocation: (locationId: string) => Location | undefined;
  lastUpdate: number;
  lastWeeklyUpdate: number;
  isLoading: boolean;
}


export const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [lastWeeklyUpdate, setLastWeeklyUpdate] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  
  const realtimeInterval = useRef<ReturnType<typeof setTimeout>>();
  const weeklyInterval = useRef<ReturnType<typeof setTimeout>>();
  const locationWatcher = useRef<ExpoLocation.LocationSubscription>();

  const updateDistances = useCallback(async (userLocation: ExpoLocation.LocationObject) => {
    setLocations(currentLocations => 
      currentLocations.map(location => ({
        ...location,
        distance: calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          location.coordinates.latitude,
          location.coordinates.longitude
        )
      }))
    );
  }, []);

  const startLocationTracking = useCallback(async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      // Store the subscription directly
      locationWatcher.current = (await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.Balanced,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 30000   // Or at least every 30 seconds
        },
        (location) => {
          updateDistances(location);
        }
      ));
    } catch (error) {
      console.error('Error setting up location tracking:', error);
    }
  }, [updateDistances]);

  // Separate refresh functions for different data types
  const refreshRealtimeData = async () => {
    try {
      setIsLoading(true);
      const updatedLocations = await LocationService.getAllLocations();
      setLocations(updatedLocations);
      setLastUpdate(Date.now());
      
      // Update distances immediately if we have permission
      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await ExpoLocation.getCurrentPositionAsync({});
        await updateDistances(currentLocation);
      }
    } catch (error) {
      console.error('Error refreshing realtime data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWeeklyData = async () => {
    try {
      const updatedLocations = await LocationService.getAllLocationsData(); // Bulk fetch including weekly patterns
      setLocations(prev => prev.map(loc => ({
        ...loc,
        weeklyBusyness: updatedLocations.find(ul => ul.id === loc.id)?.weeklyBusyness || loc.weeklyBusyness,
        bestTimes: updatedLocations.find(ul => ul.id === loc.id)?.bestTimes || loc.bestTimes
      })));
      setLastWeeklyUpdate(Date.now());
    } catch (error) {
      console.error('Error refreshing weekly data:', error);
    }
  };

  const refreshLibraryData = async () => {
    try {
      const libraryData = await LocationService.getLocation('library');
      setLocations(prev => prev.map(loc => 
        loc.id === 'library' ? libraryData : loc
      ));
    } catch (error) {
      console.error('Error refreshing library data:', error);
    }
  };

  const updateStatusFromCache = async () => {
    try {
      const currentLocations = [...locations];
      const updatedLocations = await Promise.all(
        currentLocations.map(async (loc) => {
          const cachedData = await LocationService.getCachedLocationStatus(loc.id);
          if (cachedData) {
            return {
              ...loc,
              currentStatus: {
                ...loc.currentStatus,
                ...cachedData.currentStatus
              },
              isOpen: cachedData.isOpen
            } as Location;
          }
          return loc;
        })
      );
      setLocations(updatedLocations);
    } catch (error) {
      console.error('Error updating status from cache:', error);
    }
  };
  
  useEffect(() => {
    let statusInterval: ReturnType<typeof setInterval>;
    let libraryInterval: ReturnType<typeof setInterval>;
  
    const initialize = async () => {
      // Initial data fetch
      await Promise.all([refreshRealtimeData(), refreshWeeklyData()]);
      await startLocationTracking();
  
      // Set up intervals only after initial data is loaded
      realtimeInterval.current = setInterval(refreshRealtimeData, REFRESH_INTERVALS.REALTIME_API);
      statusInterval = setInterval(updateStatusFromCache, REFRESH_INTERVALS.STATUS_UPDATE);
      weeklyInterval.current = setInterval(refreshWeeklyData, REFRESH_INTERVALS.WEEKLY);
      libraryInterval = setInterval(refreshLibraryData, REFRESH_INTERVALS.LIBRARY);
    };
    
    initialize();
  
    return () => {
      if (realtimeInterval.current) clearInterval(realtimeInterval.current);
      if (statusInterval) clearInterval(statusInterval);
      if (weeklyInterval.current) clearInterval(weeklyInterval.current);
      if (libraryInterval) clearInterval(libraryInterval);
      if (locationWatcher.current) locationWatcher.current.remove();
    };
  }, []);

  const getLocation = useCallback((locationId: string) => {
    return locations.find(loc => loc.id === locationId);
  }, [locations]);

  const contextValue: LocationContextType = {
    locations,
    refreshLocations: refreshRealtimeData,
    getLocation,
    lastUpdate,
    lastWeeklyUpdate,
    isLoading
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
      {isLoading && <LoadingSpinner overlay />}
    </LocationContext.Provider>
  );
};


// Helper function to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const useLocations = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocations must be used within a LocationProvider');
  }
  return context;
}; 