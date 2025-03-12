// Path: frontend/components/MapView.tsx

import React, { forwardRef, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import  MapMarker  from './MapMarker';
import type { Location as LocationType } from '../types/location';
import { GOOGLE_MAPS_STYLE_ID_IOS, GOOGLE_MAPS_STYLE_ID_ANDROID } from '@env';
import {MiniCard}  from './MiniCard';
import  {INITIAL_REGION}  from '../constants/map';
import { getStatusText } from '@/app/_utils/businessUtils';
import { isLocationOpen } from '@/app/_utils/timeUtils';

interface CustomMapViewProps {
  locations: LocationType[];
  selectedFilters: string[];
  onMarkerPress?: (location: LocationType) => void;
  onRegionChange?: (region: Region) => void;
  onRegionChangeComplete?: (region: Region) => void;
}

export const CustomMapView = forwardRef<MapView, CustomMapViewProps>(({
  locations,
  selectedFilters,
  onMarkerPress,
  onRegionChange,
  onRegionChangeComplete,
}, ref) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const mapId = Platform.select({
    ios: "7c6f8776af6cff7a",     // Your iOS map ID from the screenshot
    android: "4b98c933183c656f", // Your Android map ID from the screenshot
  });

  // Get user location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(status === 'granted');
        
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
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getUserLocation();
  }, []);

  // Forward the ref to parent component
  useEffect(() => {
    if (ref) {
      // @ts-ignore - known issue with forwardRef typing
      ref.current = mapRef.current;
    }
  }, [ref]);

  const handleMarkerPress = useCallback((location: LocationType) => {
    mapRef.current?.animateToRegion({
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }, 500);

    if (onMarkerPress) onMarkerPress(location);
  }, [onMarkerPress]);

  // Filter locations based on selectedFilters
  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    if (selectedFilters.length === 0) return locations;
    
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
  }, [locations, selectedFilters]);


  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "landscape",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          }
        ]}
        googleMapId={mapId}
        onMapReady={() => console.log('Map loaded successfully')}
        onError={(e) => console.error('Map error:', e.nativeEvent)}
        loadingEnabled={true}
      >
        {filteredLocations.map((location) => (
          <MapMarker
            key={`${location.id}-${selectedFilters.join('-')}`}
            location={location}
            onPress={handleMarkerPress}
            style={{ zIndex: 1 }}
          />
        ))}
      </MapView>
      
      <LinearGradient
        colors={['rgb(255,255,255)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.05)', 'transparent']}
        locations={[0, 0.2, 0.7, 1]}
        style={[styles.gradient, { zIndex: 0 }]}
        pointerEvents="none"
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
    overflow: 'visible',
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