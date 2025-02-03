// Path: frontend/components/MapView.tsx

import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { MapMarker } from './MapMarker';
import type { Location as LocationType } from '../types/location';
import { GOOGLE_MAPS_API_KEY_IOS, GOOGLE_MAPS_API_KEY_ANDROID } from '@env';

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
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
      } else {
        Alert.alert(
          "Location Permission Required",
          "Please enable location services to see your current location on the map.",
          [{ text: "OK" }]
        );
      }
    })();
  }, []);

  const initialRegion = {
    latitude: 38.5382,  // UC Davis coordinates
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
        showsCompass
        showsScale
        showsBuildings
        showsTraffic={false}
        loadingEnabled={true}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        onMapLoaded={() => {
          console.log('Map loaded successfully');
        }}
        onError={(error) => {
          console.error('Map error:', error.nativeEvent);
        }}
      >
        <Marker
          coordinate={{
            latitude: 38.5382,
            longitude: -121.7617
          }}
          title="UC Davis"
          description="Main Campus"
        />
      </MapView>
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
  }
});

CustomMapView.displayName = 'CustomMapView';

export default CustomMapView;