// Path: frontend/app/(tabs)/home/index.tsx

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { CustomMapView } from '../../components/MapView';
import { SearchBar } from '../../components/SearchBar';
import { FacilityList } from '../../components/FacilityList';
import type { Location as LocationType } from '../../types/location';
import { useRouter, useNavigation } from "expo-router";
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { QuickFilterBar } from '../../components/QuickFilterBar';
import { useLocations } from '../../hooks/useLocations';
import { useFilters } from '../../context/FilterContext';
import { INITIAL_REGION } from '../../constants/map';
import BottomSheet from '@gorhom/bottom-sheet';
import EventEmitter from '../../_utils/EventEmitter';
import { searchLocations } from '../../_utils/searchUtils';
import { getStatusText } from '../../_utils/businessUtils';
import { isLocationOpen } from '../../_utils/timeUtils';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const mapRef = useRef<MapView | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMapCentered, setIsMapCentered] = useState(false);
  const userLocation = useRef<{ latitude: number; longitude: number } | null>(null);
  const isAnimating = useRef(false);
  const isNavigatingToUser = useRef(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [lastToggledLocationId, setLastToggledLocationId] = useState<string | null>(null);

  const { selectedFilters, clearFilters } = useFilters();
  const { locations, loading, error, forceRefresh } = useLocations(selectedFilters);
  
  // Filter locations based on both search and filters
  const filteredLocations = useMemo(() => {
    // If there's a search query, prioritize search and ignore filters
    if (actualSearchQuery.trim()) {
      return searchLocations(locations, actualSearchQuery);
    }
    
    // If no search but has filters, apply filters
    if (selectedFilters.length > 0) {
      return locations.filter(location => 
        selectedFilters.some(filter => {
          const status = getStatusText(location);
          const percentage = location.crowdInfo?.percentage || 0;
          const isOpen = isLocationOpen(location);

          switch (filter) {
            case 'open':
              return isOpen;
            case 'closed':
              return !isOpen;
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
        })
      );
    }
    
    // If no search and no filters, return all locations
    return locations;
  }, [locations, actualSearchQuery, selectedFilters]);

  // Handle search submission
  const handleSearchSubmit = useCallback(async () => {
    setIsSearching(true);
    // Simulate some delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    setActualSearchQuery(searchQuery);
    setIsSearching(false);
  }, [searchQuery]);

  // Clear filters when search is used
  useEffect(() => {
    if (actualSearchQuery.trim()) {
      if (selectedFilters.length > 0) {
        clearFilters();
      }
    }
  }, [actualSearchQuery]);

  useEffect(() => {
  }, [locations]);

  // Listen for navigation focus and location toggle events
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (lastToggledLocationId) {
        mapRef.current?.forceUpdate();
        setLastToggledLocationId(null);
      }
    });

    // Listen for favorite toggle events
    const toggleSubscription = EventEmitter.addListener('locationFavoriteToggled', (locationId: string) => {
      setLastToggledLocationId(locationId);
      // Force immediate map update
      mapRef.current?.forceUpdate();
    });

    return () => {
      unsubscribe();
      toggleSubscription.remove();
    };
  }, [navigation, lastToggledLocationId]);

  const handleMarkerPress = (location: LocationType) => {
    // removed console.log
  };

  const handleFilterPress = () => {
    router.push("/screens/FilterPage");
  };

  const handleLocationPress = async () => {
    if (isAnimating.current) return;
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      userLocation.current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      if (mapRef.current && userLocation.current) {
        isAnimating.current = true;
        isNavigatingToUser.current = true;
        setIsMapCentered(true);

        mapRef.current.animateToRegion({
          latitude: userLocation.current.latitude,
          longitude: userLocation.current.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);

        // Reset flags after animation completes
        setTimeout(() => {
          isAnimating.current = false;
          isNavigatingToUser.current = false;
        }, 1000);
      }
    } catch (error) {
      setIsMapCentered(false);
      isAnimating.current = false;
      isNavigatingToUser.current = false;
    }
  };

  const handleMapMovement = useCallback((region: Region) => {
    if (!userLocation.current || isAnimating.current || isNavigatingToUser.current) return;

    const latDiff = Math.abs(region.latitude - userLocation.current.latitude);
    const lonDiff = Math.abs(region.longitude - userLocation.current.longitude);
    const threshold = 0.0001;

    const isCentered = latDiff < threshold && lonDiff < threshold;
    setIsMapCentered(isCentered);
  }, []);

  const handleReset = useCallback(async () => {
    // Start animation to initial region
    if (mapRef.current) {
      mapRef.current.animateToRegion(INITIAL_REGION, 1000);
    }
    
    // Collapse bottom sheet
    if (bottomSheetRef.current) {
      bottomSheetRef.current.collapse();
    }
    
    // Reset map center state
    setIsMapCentered(false);
    
    // Reset search
    setSearchQuery('');
    setActualSearchQuery('');

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show loading spinner and refresh all data
    setIsSearching(true);
    try {
      await forceRefresh();
    } finally {
      setIsSearching(false);
    }
  }, [forceRefresh]);

  useEffect(() => {
    const subscription = EventEmitter.addListener('resetHomeScreen', handleReset);
    
    return () => {
      subscription.remove();
    };
  }, [handleReset]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setActualSearchQuery('');
    // If there are any filters, they will be automatically applied
    // to the full location list once actualSearchQuery is cleared
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: 'transparent' }}>
      {isSearching && <LoadingSpinner overlay />}
      <CustomMapView 
        ref={mapRef}
        locations={filteredLocations}
        selectedFilters={selectedFilters}
        onMarkerPress={handleMarkerPress}
        onRegionChange={handleMapMovement}
        onRegionChangeComplete={handleMapMovement}
      />
      <View className="absolute w-full pl-1">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          onFilterPress={handleFilterPress}
          onSubmitEditing={handleSearchSubmit}
        />
        <QuickFilterBar />
      </View>
      <FacilityList 
        locations={filteredLocations}
        error={error}
        onLocationPress={handleLocationPress}
        isMapCentered={isMapCentered}
        bottomSheetRef={bottomSheetRef}
      />
    </View>
  );
}
