import React from 'react';
import { View } from 'react-native';
import { isLocationOpen } from './timeUtils';
import { staticLocations } from '../data/staticLocations';
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
  // White icons for type checking
  StudyWhite,
  GymWhite,
  DiningWhite,
  GamesWhite,
} from '../../assets';
import type { Location } from '../types/location';
import { getStatusText } from './businessUtils';

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

export const getPin = (location: Location, isFavorite: boolean) => {
  const staticLocation = staticLocations[location.id];
  
  // First check if location is closed using timeUtils
  const isOpen = isLocationOpen(location);
  if (!isOpen) {
    // Add Games handling for closed state
    if (staticLocation.icons.white === GamesWhite) {
      return React.createElement(ShadowWrapper, {
        children: React.createElement(isFavorite ? PinStudyNoInfo : PinStudyNoInfo, { width: 40, height: 40 })
      });
    }
    // Use the white icon to determine the pin type
    if (staticLocation.icons.white === StudyWhite) {
      return React.createElement(ShadowWrapper, {
        children: React.createElement(isFavorite ? PinStudyNoInfo : PinStudyNoInfo, { width: 40, height: 40 })
      });
    } else if (staticLocation.icons.white === GymWhite) {
      return React.createElement(ShadowWrapper, {
        children: React.createElement(isFavorite ? PinGymNoInfo : PinGymNoInfo, { width: 40, height: 40 })
      });
    } else {
      return React.createElement(ShadowWrapper, {
        children: React.createElement(isFavorite ? PinFoodNoInfo : PinFoodNoInfo, { width: 40, height: 40 })
      });
    }
  }

  // Use the same status determination as businessUtils
  const busynessStatus = getStatusText(location);
  let pin;

  // Add Games handling for open state
  if (staticLocation.icons.white === GamesWhite) {
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
  } else if (staticLocation.icons.white === DiningWhite) {
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
  } else if (staticLocation.icons.white === StudyWhite) {
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
  } else if (staticLocation.icons.white === GymWhite) {
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

  return React.createElement(ShadowWrapper, { children: pin });
}; 