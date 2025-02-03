// Path: frontend/components/MapView.tsx

import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { MapMarker } from './MapMarker';
import type { Location as LocationType } from '../types/location';
import { GOOGLE_MAPS_API_KEY_IOS, GOOGLE_MAPS_API_KEY_ANDROID, GOOGLE_MAPS_STYLE_ID } from '@env';

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
  console.log('MapView rendering');
  console.log("API KEY: ", GOOGLE_MAPS_API_KEY_IOS);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const apiKey = Platform.select({
    ios: GOOGLE_MAPS_API_KEY_IOS,
    android: GOOGLE_MAPS_API_KEY_ANDROID,
  });

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Location permission status:', status);
        if (status !== 'granted') {
          console.log('Permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log('Got user location:', location);
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        setHasLocationPermission(true);
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    getUserLocation();
  }, []);

  // UC Davis coordinates
  const initialRegion = {
    latitude: 38.5382,
    longitude: -121.7617,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        followsUserLocation={false}
        loadingEnabled={true}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        onMapLoaded={() => {
          console.log('Map loaded successfully');
        }}
        onError={(error) => {
          console.error('Map error:', error.nativeEvent);
          setMapError(error.nativeEvent.message);
        }}
      >
        <Marker
          coordinate={{
            latitude: 38.5382,
            longitude: -121.7617,
          }}
          title="UC Davis"
          description="Test Marker"
        />
      </MapView>
      <LinearGradient
        colors={['rgba(255,255,255,.99)', 'rgba(255,255,255,0)', 'transparent']}
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      />
      {mapError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{mapError}</Text>
        </View>
      )}
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
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
  },
});

CustomMapView.displayName = 'CustomMapView';

export default CustomMapView;