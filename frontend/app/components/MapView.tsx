// Path: frontend/components/MapView.tsx

import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { MapMarker } from './MapMarker';
import type { Location as LocationType } from '../types/location';
import { GOOGLE_MAPS_API_KEY_IOS, GOOGLE_MAPS_API_KEY_ANDROID, GOOGLE_MAPS_STYLE_ID_IOS, GOOGLE_MAPS_STYLE_ID_ANDROID } from '@env';

interface CustomMapViewProps {
  locations: LocationType[];
  selectedFilters: string[];
  onMarkerPress?: (location: LocationType) => void;
  onRegionChange?: (region: Region) => void;
  onRegionChangeComplete?: (region: Region) => void;
}

export const CustomMapView = forwardRef<MapView, CustomMapViewProps>(({
  locations,
  selectedFilters = [],
  onMarkerPress,
  onRegionChange,
  onRegionChangeComplete
}, ref) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const apiKey = Platform.select({
    ios: GOOGLE_MAPS_API_KEY_IOS,
    android: GOOGLE_MAPS_API_KEY_ANDROID,
  });

  const mapId = Platform.select({
    ios: GOOGLE_MAPS_STYLE_ID_IOS,
    android: GOOGLE_MAPS_STYLE_ID_ANDROID,
  });

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (__DEV__) {
          // Set mock location for development
          setUserLocation({
            latitude: 38.5382,
            longitude: -121.7617
          });
        } else {
          // Use real location in production
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
        }
        
        setHasLocationPermission(true);
      } catch (error) {
      }
    };

    getUserLocation();
  }, []);

  // UC Davis coordinates
  const initialRegion = {
    latitude: 38.5382,
    longitude: -121.7617,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        camera={{
          center: {
            latitude: 38.5382,
            longitude: -121.7617,
          },
          pitch: 0,
          altitude: 1000,
          zoom: 15,
          heading: 0
        }}
        googleMapId={mapId}
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "administrative",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "building",
            elementType: "geometry",
            stylers: [{ visibility: "on" }]
          }
        ]}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        followsUserLocation={false}
        loadingEnabled={true}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {locations.map((location) => (
          <MapMarker
            key={location.id}
            location={location}
            onPress={() => onMarkerPress?.(location)}
          />
        ))}
      </MapView>
      <LinearGradient
        colors={['rgb(255,255,255)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.05)', 'transparent' ]}
        locations={[0, 0.2, 0.7, 1]}
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
    height: 140,
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