// Path: frontend/components/MapMarker.tsx

import React from 'react';
import { Marker } from 'react-native-maps';
import { Image } from 'react-native';
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

interface MapMarkerProps {
  location: Location;
  onPress?: () => void;
}

export function MapMarker({ location, onPress }: MapMarkerProps) {
  const { isFavorite } = useFavorites();
  const isLocationFavorite = isFavorite(location.id);

  const getPin = () => {
    const type = location.type;
    const status = location.status || 'No Info';
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
    }

    // Only use regular pins if no favorite pin was selected
    if (!PinComponent) {
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
  };

  return (
    <Marker
      coordinate={{
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      }}
      onPress={onPress}
      title={location.name}
      description={location.description}
    >
      {getPin()}
    </Marker>
  );
}

export default MapMarker;