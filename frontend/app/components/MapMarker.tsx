// Path: frontend/components/MapMarker.tsx

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { MiniCard } from './MiniCard';
import type { Location } from '../types/location';
import { useFavorites } from '../context/FavoritesContext';
import { useLocations } from '../context/LocationContext';
import { getPin } from '../_utils/pinUtils';
import EventEmitter from '../_utils/EventEmitter';
import { isLocationOpen } from '../_utils/timeUtils';
import { View, StyleSheet } from 'react-native';

interface MapMarkerProps {
  location: Location;
  onPress?: (location: Location) => void;
  style?: any;
}

const MapMarker: React.FC<MapMarkerProps> = React.memo(({ location, onPress, style }) => {
  const router = useRouter();
  const { isFavorite } = useFavorites();
  const { locations, lastUpdate } = useLocations();
  const markerRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(location);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  // Get real-time location data
  const currentLocationData = useMemo(() => 
    locations.find(loc => loc.id === location.id) || location,
    [locations, location.id, lastUpdate]
  );

  const isLocationFavorite = useMemo(() => {
    return isFavorite(location.id);
  }, [isFavorite, location.id, shouldUpdate]);

  const busynessStatus = useMemo(() => {
    if (!isLocationOpen(currentLocationData)) return 'Not Busy';
    const percentage = (currentLocationData.currentCapacity / currentLocationData.maxCapacity) * 100;
    if (percentage >= 75) return 'Very Busy';
    if (percentage >= 40) return 'Fairly Busy';
    return 'Not Busy';
  }, [currentLocationData]);

  const pin = useMemo(() => {
    return getPin(currentLocationData, isLocationFavorite, busynessStatus);
  }, [currentLocationData, isLocationFavorite, busynessStatus]);

  const handleMarkerPress = useCallback(() => {
    if (onPress) onPress(currentLocationData);
  }, [currentLocationData, onPress]);

  const handleCalloutPress = useCallback(() => {
    router.push(`/location/${currentLocationData.id}`);
  }, [currentLocationData.id, router]);

  useEffect(() => {
    const subscription = EventEmitter.addListener('resetHomeScreen', () => {
      if (markerRef.current) {
        (markerRef.current as any).hideCallout();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Listen for specific location updates
  useEffect(() => {
    const subscription = EventEmitter.addListener('locationFavoriteToggled', (locationId: string) => {
      if (locationId === location.id) {
        setShouldUpdate(prev => !prev); // Toggle to force re-render
      }
    });

    return () => subscription.remove();
  }, [location.id]);

  return (
    <Marker
      key={`${currentLocationData.id}-${isLocationFavorite}-${busynessStatus}`}
      ref={markerRef}
      coordinate={{
        latitude: currentLocationData.coordinates.latitude,
        longitude: currentLocationData.coordinates.longitude
      }}
      onPress={handleMarkerPress}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 1.0 }}
      centerOffset={{ x: 0, y: -20 }}
    >
      {pin}
      <Callout
        onPress={handleCalloutPress}
        tooltip={true}
        style={{
          backgroundColor: 'transparent',
          borderWidth: 0,
        }}
      >
        <MiniCard location={currentLocationData} />
      </Callout>
    </Marker>
  );
});

MapMarker.displayName = 'MapMarker';

export default MapMarker;