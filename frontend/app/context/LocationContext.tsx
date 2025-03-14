import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { LocationService } from '../services/locationService';
import type { Location } from '../types/location';
import * as ExpoLocation from 'expo-location';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SafeSpaceService } from '../services/safeSpaceService';

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
  getFilteredLocations: (filters: string[]) => Location[];
  lastUpdate: number;
  lastWeeklyUpdate: number;
  isLoading: boolean;
  manualRefresh: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}


export const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [lastWeeklyUpdate, setLastWeeklyUpdate] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  
  const realtimeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const weeklyInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationWatcher = useRef<ExpoLocation.LocationSubscription | null>(null);

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
  
  // Update refreshLibrarySafeSpace function
  const refreshLibrarySafeSpace = async () => {
    try {
      const safeSpaceData = await SafeSpaceService.getOccupancyData();
      if (safeSpaceData) {
        const updatedLibrary = await LocationService.getLocationDetails('library');
        if (updatedLibrary) {
          setLocations(prev => prev.map(loc => 
            loc.id === 'library' ? {
              ...updatedLibrary,
              currentStatus: {
                ...updatedLibrary.currentStatus,
                realTimeOccupancy: safeSpaceData
              }
            } : loc
          ));
        }
      }
    } catch (error) {
      console.error('Error updating library SafeSpace:', error);
    }
  };

  // Function to refresh from all caches
  const refreshFromCaches = async () => {
    try {
      console.log('[LocationContext] Starting cache refresh...', new Date().toLocaleTimeString());
      
      // Get all location IDs
      const locationIds = locations.map(loc => loc.id);
      
      const updatedLocations = await Promise.all(
        locationIds.map(async (id) => {
          const location = locations.find(loc => loc.id === id);
          if (!location) return null;

          // Get cached status
          const cachedStatus = await LocationService.getCachedLocationStatus(id);
          
          return {
            ...location,
            ...(cachedStatus && {
              currentStatus: cachedStatus.currentStatus,
              isOpen: cachedStatus.isOpen
            })
          };
        })
      );

      // Filter out null values and update state
      const filteredLocations = updatedLocations.filter((loc): loc is Location => loc !== null);
      if (filteredLocations.length > 0) {
        setLocations(filteredLocations);
        setLastUpdate(Date.now());
        console.log('[LocationContext] Cache refresh complete, UI should update', new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error refreshing from caches:', error);
    }
  };

  // Initial data load
  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const initialLocations = await LocationService.getAllLocations();
      setLocations(initialLocations);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual refresh function (for home button)
  const manualRefresh = async () => {
    await refreshFromCaches();
  };

  const forceRefresh = async () => {
    setIsLoading(true);
    try {
      // Reset the initial load flag in LocationService
      LocationService.resetInitialLoadFlag();
      // Refresh all data types
      await Promise.all([
        refreshRealtimeData(),
        refreshWeeklyData(),
        refreshLibraryData()
      ]);
    } catch (error) {
      console.error('Error during force refresh:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadLocations();

    // Set up intervals for data refresh
    realtimeInterval.current = setInterval(refreshRealtimeData, REFRESH_INTERVALS.REALTIME_API);
    weeklyInterval.current = setInterval(refreshWeeklyData, REFRESH_INTERVALS.WEEKLY);

    // Set up 5-minute cache refresh interval
    const cacheRefreshInterval = setInterval(refreshFromCaches, 5 * 60 * 1000); // 5 minutes

    // Start location tracking
    startLocationTracking();

    // Cleanup
    return () => {
      console.log('[LocationContext] Cleaning up intervals');
      if (realtimeInterval.current) clearInterval(realtimeInterval.current);
      if (weeklyInterval.current) clearInterval(weeklyInterval.current);
      if (locationWatcher.current) locationWatcher.current.remove();
      clearInterval(cacheRefreshInterval);
    };
  }, []);

  const getLocation = useCallback((locationId: string) => {
    return locations.find(loc => loc.id === locationId);
  }, [locations]);

  // Add this helper function to check if a location matches busyness filters
  const matchesBusynessFilter = (location: Location, filter: string): boolean => {
    const crowdLevel = location.crowdInfo?.level || 'Unknown';
    const percentage = location.crowdInfo?.percentage || 0;
    
    switch (filter) {
      case 'not-busy':
        return crowdLevel === 'Not Busy' || percentage < 40;
      case 'fairly-busy':
        return crowdLevel === 'Fairly Busy' || (percentage >= 40 && percentage < 75);
      case 'very-busy':
        return crowdLevel === 'Very Busy' || percentage >= 75;
      default:
        return true;
    }
  };

  // Add this helper function to check if a location matches type filters
  const matchesTypeFilter = (location: Location, filter: string): boolean => {
    switch (filter) {
      case 'study':
        return location.type.includes('study');
      case 'dining':
        return location.type.includes('dining');
      case 'gym':
        return location.type.includes('gym');
      default:
        return true;
    }
  };

  // Add this function to get filtered locations
  const getFilteredLocations = useCallback((filters: string[]): Location[] => {
    if (!filters.length) return locations;

    return locations.filter(location => {
      // Separate filters by type
      const busynessFilters = filters.filter(f => ['not-busy', 'fairly-busy', 'very-busy'].includes(f));
      const typeFilters = filters.filter(f => ['study', 'dining', 'gym'].includes(f));

      // If there are busyness filters, location must match at least one
      const passesBusyness = busynessFilters.length === 0 || 
        busynessFilters.some(filter => matchesBusynessFilter(location, filter));

      // If there are type filters, location must match at least one
      const passesType = typeFilters.length === 0 || 
        typeFilters.some(filter => matchesTypeFilter(location, filter));

      return passesBusyness && passesType;
    });
  }, [locations]);

  const contextValue: LocationContextType = {
    locations,
    refreshLocations: manualRefresh,
    getLocation,
    getFilteredLocations,
    lastUpdate,
    lastWeeklyUpdate,
    isLoading,
    manualRefresh,
    forceRefresh
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
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