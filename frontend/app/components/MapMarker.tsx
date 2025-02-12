// Path: frontend/components/MapMarker.tsx

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { MiniCard } from './MiniCard';
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
  const markerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isLocationFavorite = useMemo(() => 
    isFavorite(location.id),
    [isFavorite, location.id]
  );

  const isOpen = useMemo(() => 
    isLocationOpen(location),
    [location.hours, currentTime]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  const getBusynessStatus = useCallback(() => {
    if (!isOpen) return 'Closed';
    
    // Get current day and hour
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayLower = days[now.getDay()];
    const currentHour = now.getHours();

    // Get the current day's data
    const todayData = location.weeklyBusyness?.[currentDayLower];
    
    // Find the current hour's data
    const currentHourData = todayData?.find((timeSlot: any) => {
      const timeHour = parseInt(timeSlot.time.split(' ')[0]);
      const period = timeSlot.time.split(' ')[1];
      
      // Convert to 24-hour format for comparison
      let hour24 = timeHour;
      if (period === 'PM' && timeHour !== 12) hour24 += 12;
      if (period === 'AM' && timeHour === 12) hour24 = 0;
      
      return hour24 === currentHour;
    });

    // Return the description or default to 'Not Busy'
    if (currentHourData?.description) {
      if (currentHourData.description.includes('Very Busy')) return 'Very Busy';
      if (currentHourData.description.includes('Fairly Busy')) return 'Fairly Busy';
      if (currentHourData.description.includes('Not Busy')) return 'Not Busy';
    }

    return 'Not Busy'; // Default fallback
  }, [isOpen, location.weeklyBusyness]);

  const getPin = useCallback(() => {
    const type = location.type;
    const status = getBusynessStatus();
    let PinComponent;

    if (isLocationFavorite) {
      if (type.includes('study')) {
        switch (status) {
          case 'Not Busy': PinComponent = PinFavoriteStudyNotBusy; break;
          case 'Fairly Busy': PinComponent = PinFavoriteStudyFairlyBusy; break;
          case 'Very Busy': PinComponent = PinFavoriteStudyVeryBusy; break;
          default: PinComponent = PinStudyNoInfo;
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
  }, [location.type, getBusynessStatus, isLocationFavorite, isOpen]);

  const pin = useMemo(() => getPin(), [getPin]);

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

  const handleCalloutPress = () => {
    router.push(`/location/${location.id}`);
  };

  const handleMarkerPress = () => {
    if (onPress) onPress(location);
  };

  return (
    <Marker
      key={`${location.id}-${isLocationFavorite}-${isOpen}`}
      ref={markerRef}
      coordinate={{
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
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
        <MiniCard location={location} />
      </Callout>
    </Marker>
  );
});

MapMarker.displayName = 'MapMarker';

export default MapMarker;