import React from 'react';
import { View } from 'react-native';
import { isLocationOpen } from './timeUtils';
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
import type { Location } from '../types/location';

// Create a shadow wrapper component
const ShadowWrapper = ({ children }: { children: React.ReactNode }) => (
  <View style={{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2, // for Android
  }}>
    {children}
  </View>
);

export const getPin = (location: Location, isFavorite: boolean, busynessStatus: string) => {
  const { type } = location;
  const isClosed = !isLocationOpen(location);
  let pin;

  // If location is closed, return NoInfo pin
  if (isClosed) {
    if (Array.isArray(type) && type.includes('study')) {
      pin = React.createElement(PinStudyNoInfo, { width: 40, height: 40 });
    } else if (Array.isArray(type) && type.includes('gym')) {
      pin = React.createElement(PinGymNoInfo, { width: 40, height: 40 });
    } else {
      pin = React.createElement(PinFoodNoInfo, { width: 40, height: 40 });
    }
    return React.createElement(ShadowWrapper, { children: pin });
  }

  // Regular pin logic for open locations
  if (Array.isArray(type) && type.includes('study')) {
    // Non-favorite pins should use regular pins
    switch (busynessStatus) {
      case 'Very Busy':
        pin = React.createElement(isFavorite ? PinFavoriteStudyVeryBusy : PinStudyVeryBusy, { width: 40, height: 40 });
        break;
      case 'Fairly Busy':
        pin = React.createElement(isFavorite ? PinFavoriteStudyFairlyBusy : PinStudyFairlyBusy, { width: 40, height: 40 });
        break;
      default:
        pin = React.createElement(isFavorite ? PinFavoriteStudyNotBusy : PinStudyNotBusy, { width: 40, height: 40 });
    }
  }
  // Gym locations
  else if (Array.isArray(type) && type.includes('gym')) {
    switch (busynessStatus) {
      case 'Very Busy':
        pin = React.createElement(isFavorite ? PinFavoriteGymVeryBusy : PinGymVeryBusy, { width: 40, height: 40 });
        break;
      case 'Fairly Busy':
        pin = React.createElement(isFavorite ? PinFavoriteGymFairlyBusy : PinGymFairlyBusy, { width: 40, height: 40 });
        break;
      default:
        pin = React.createElement(isFavorite ? PinFavoriteGymNotBusy : PinGymNotBusy, { width: 40, height: 40 });
    }
  }
  // Food/dining locations (default)
  else {
    switch (busynessStatus) {
      case 'Very Busy':
        pin = React.createElement(isFavorite ? PinFavoriteFoodVeryBusy : PinFoodVeryBusy, { width: 40, height: 40 });
        break;
      case 'Fairly Busy':
        pin = React.createElement(isFavorite ? PinFavoriteFoodFairlyBusy : PinFoodFairlyBusy, { width: 40, height: 40 });
        break;
      default:
        pin = React.createElement(isFavorite ? PinFavoriteFoodNotBusy : PinFoodNotBusy, { width: 40, height: 40 });
    }
  }

  return React.createElement(ShadowWrapper, { children: pin });
}; 