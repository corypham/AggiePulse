// Path: frontend/app/(tabs)/home/index.tsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { CustomMapView } from '../../components/MapView';
import { SearchBar } from '../../components/SearchBar';
import { FacilityList } from '../../components/FacilityList';
import type { Location as LocationType } from '../../types/location';
import { useRouter } from "expo-router";
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { QuickFilterBar } from '../../components/QuickFilterBar';
import { useLocations } from '../../hooks/useLocations';
import { useFilters } from '../../context/FilterContext';
import { INITIAL_REGION } from '../../constants/map';
import BottomSheet from '@gorhom/bottom-sheet';
import EventEmitter  from '../../_utils/EventEmitter';

export default function HomeScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapCentered, setIsMapCentered] = useState(false);
  const userLocation = useRef<{ latitude: number; longitude: number } | null>(null);
  const isAnimating = useRef(false);
  const isNavigatingToUser = useRef(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { selectedFilters } = useFilters();
  const { locations, loading, error } = useLocations(selectedFilters);

  const handleMarkerPress = (location: LocationType) => {
    console.log('Selected location:', location);
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

  const handleReset = useCallback(() => {
    // Reset map to initial region
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
  }, []);

  useEffect(() => {
    const subscription = EventEmitter.addListener('resetHomeScreen', handleReset);
    
    return () => {
      subscription.remove();
    };
  }, [handleReset]);

  return (
    <View className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <CustomMapView 
        ref={mapRef}
        locations={locations}
        selectedFilters={selectedFilters}
        onMarkerPress={handleMarkerPress}
        onRegionChange={handleMapMovement}
        onRegionChangeComplete={handleMapMovement}
      />
      <View className="absolute w-full pl-1">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          onFilterPress={handleFilterPress}
        />
        <QuickFilterBar />
      </View>
      <FacilityList 
        locations={locations}
        loading={loading}
        error={error}
        onLocationPress={handleLocationPress}
        isMapCentered={isMapCentered}
        bottomSheetRef={bottomSheetRef}
      />
    </View>
  );
}