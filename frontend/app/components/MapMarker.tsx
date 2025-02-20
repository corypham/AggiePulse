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
import { getStatusText } from '@/app/_utils/businessUtils';

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
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // Get real-time location data
  const currentLocationData = useMemo(() => 
    locations.find(loc => loc.id === location.id) || location,
    [locations, location.id, lastUpdate]
  );

  const isLocationFavorite = useMemo(() => {
    return isFavorite(location.id);
  }, [isFavorite, location.id, shouldUpdate]);

  const busynessStatus = useMemo(() => {
    if (!isLocationOpen(currentLocationData)) return 'Closed';
    return getStatusText(currentLocationData);
  }, [currentLocationData]);

  const pin = useMemo(() => {
    return getPin(currentLocationData, isLocationFavorite);
  }, [currentLocationData, isLocationFavorite, lastUpdate]);

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

  // Add useEffect to handle view changes tracking
  useEffect(() => {
    // Enable view changes tracking when favorite status changes
    setTracksViewChanges(true);
    
    // Disable view changes tracking after a short delay
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLocationFavorite, shouldUpdate]);

  useEffect(() => {
    const subscription = EventEmitter.addListener('locationFavoriteToggled', (locationId: string) => {
      if (locationId === location.id) {
        setTracksViewChanges(true); // Enable tracking before update
        setShouldUpdate(prev => !prev);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [location.id]);

  // Update currentLocationData when favorites change
  useEffect(() => {
    setCurrentLocation(currentLocationData);
  }, [currentLocationData, isLocationFavorite]);

  return (
    <Marker
      key={`${currentLocationData.id}-${isLocationFavorite}-${busynessStatus}-${shouldUpdate}-${lastUpdate}`}
      ref={markerRef}
      coordinate={{
        latitude: currentLocationData.coordinates.latitude,
        longitude: currentLocationData.coordinates.longitude
      }}
      onPress={handleMarkerPress}
      tracksViewChanges={tracksViewChanges}
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