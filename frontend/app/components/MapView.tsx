// Path: frontend/components/MapView.tsx

import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { MapMarker } from './MapMarker';
import type { Location as LocationType } from '../types/location';

interface CustomMapViewProps {
  selectedFilters: string[];
  onMarkerPress?: (location: LocationType) => void;
  onRegionChange?: (region: Region) => void;
  onRegionChangeComplete?: (region: Region) => void;
}

export const CustomMapView = forwardRef<MapView, CustomMapViewProps>(({
  selectedFilters = [],
  onMarkerPress,
  onRegionChange,
  onRegionChangeComplete
}, ref) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    getUserLocation();
  }, []);

  const initialRegion = {
    latitude: 42.023350,
    longitude: -93.647640,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={ref}
        provider={Platform.select({
          ios: PROVIDER_GOOGLE,
          android: PROVIDER_GOOGLE,
        })}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        loadingEnabled={true}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {/* Your existing markers */}
      </MapView>
      <LinearGradient
        colors={['rgba(255,255,255,.99)', 'rgba(255,255,255,0)', 'transparent']}
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
});

CustomMapView.displayName = 'CustomMapView';

export default CustomMapView;