// Path: frontend/components/MapMarker.tsx

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import  {MiniCard}  from './MiniCard';
import type { Location } from '../types/location';
import { useFavorites } from '../context/FavoritesContext';
import {
  // Regular pins
  PinStudyNotBusy,
  PinStudyFairlyBusy,
  PinStudyVeryBusy,
  PinStudyNoInfo,
  PinGymNotBusy,
  PinGymFairlyBusy,
  PinGymVeryBusy,
  PinGymNoInfo,
  PinFoodNotBusy,
  PinFoodFairlyBusy,
  PinFoodVeryBusy,
  PinFoodNoInfo,
  // Favorite pins
  PinFavoriteStudyNotBusy,
  PinFavoriteStudyFairlyBusy,
  PinFavoriteStudyVeryBusy,
  PinFavoriteGymNotBusy,
  PinFavoriteGymFairlyBusy,
  PinFavoriteGymVeryBusy,
  PinFavoriteFoodNotBusy,
  PinFavoriteFoodFairlyBusy,
  PinFavoriteFoodVeryBusy,
} from '../../assets';
import EventEmitter from '../_utils/EventEmitter';

interface MapMarkerProps {
  location: Location;
  onPress?: (location: Location) => void;
}

export function MapMarker({ location, onPress }: MapMarkerProps) {
  const router = useRouter();
  const { isFavorite, favorites } = useFavorites();
  const markerRef = useRef(null);

  // Memoize the favorite status to ensure it updates properly
  const isLocationFavorite = useMemo(() => 
    isFavorite(location.id),
    [isFavorite, location.id, favorites] // Add favorites as dependency
  );

  const getPin = useCallback(() => {
    const type = location.type;
    const status = location.currentStatus || 'No Info';
    let PinComponent;

    if (isLocationFavorite) {
      if (type.includes('study')) {
        switch (status) {
          case 'Not Busy': 
            PinComponent = PinFavoriteStudyNotBusy; 
            break;
          case 'Fairly Busy': 
            PinComponent = PinFavoriteStudyFairlyBusy;
            break;
          case 'Very Busy': 
            PinComponent = PinFavoriteStudyVeryBusy;
            break;
          default: 
            PinComponent = PinStudyNoInfo;
        }
      } else if (type.includes('gym')) {
        switch (status) {
          case 'Not Busy': PinComponent = PinFavoriteGymNotBusy; break;
          case 'Fairly Busy': PinComponent = PinFavoriteGymFairlyBusy; break;
          case 'Very Busy': PinComponent = PinFavoriteGymVeryBusy; break;
          default: PinComponent = PinGymNoInfo;
        }
      } else if (type.includes('dining')) {
        switch (status) {
          case 'Not Busy': PinComponent = PinFavoriteFoodNotBusy; break;
          case 'Fairly Busy': PinComponent = PinFavoriteFoodFairlyBusy; break;
          case 'Very Busy': PinComponent = PinFavoriteFoodVeryBusy; break;
          default: PinComponent = PinFoodNoInfo;
        }
      }
    } else {
      // Regular pins logic
      if (type.includes('study')) {
        switch (status) {
          case 'Not Busy': PinComponent = PinStudyNotBusy; break;
          case 'Fairly Busy': PinComponent = PinStudyFairlyBusy; break;
          case 'Very Busy': PinComponent = PinStudyVeryBusy; break;
          default: PinComponent = PinStudyNoInfo;
        }
      } else if (type.includes('gym')) {
        switch (status) {
          case 'Not Busy': PinComponent = PinGymNotBusy; break;
          case 'Fairly Busy': PinComponent = PinGymFairlyBusy; break;
          case 'Very Busy': PinComponent = PinGymVeryBusy; break;
          default: PinComponent = PinGymNoInfo;
        }
      } else if (type.includes('dining')) {
        switch (status) {
          case 'Not Busy': PinComponent = PinFoodNotBusy; break;
          case 'Fairly Busy': PinComponent = PinFoodFairlyBusy; break;
          case 'Very Busy': PinComponent = PinFoodVeryBusy; break;
          default: PinComponent = PinFoodNoInfo;
        }
      }
    }

    return PinComponent ? <PinComponent width={40} height={40} /> : null;
  }, [location.type, location.currentStatus, isLocationFavorite]); // Add proper dependencies

  // Memoize the pin with all necessary dependencies
  const pin = useMemo(() => getPin(), [
    getPin,
    location.currentStatus,
    isLocationFavorite,
    location.type
  ]);

  useEffect(() => {
    const subscription = EventEmitter.addListener('resetHomeScreen', () => {
      // Hide callout when reset event is fired
      if (markerRef.current) {
        (markerRef.current as any).hideCallout();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleCalloutPress = () => {
    router.push(`/location/${location.id}`);
  };

  const handleMarkerPress = () => {
    if (onPress) onPress(location);
  };

  return (
    <Marker
      key={`${location.id}-${isLocationFavorite}-${location.currentStatus}`}
      ref={markerRef}
      coordinate={{
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      }}
      onPress={handleMarkerPress}
      tracksViewChanges={true} // Temporarily set to true for testing
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
        <MiniCard location={location} />
      </Callout>
    </Marker>
  );
}

export default MapMarker;