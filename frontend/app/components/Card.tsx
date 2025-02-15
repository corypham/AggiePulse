import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";
import { router, useRouter } from 'expo-router';
import type { Location } from '../types/location';
import { useFavorites } from '../context/FavoritesContext';
import { getStatusIcon, getStatusText } from '../_utils/statusIcons';
import { DEVICE, CARD } from '../constants/_layout';
import { getLocationHours, isLocationOpen } from '../_utils/timeUtils';
import { formatDistance } from '../_utils/distanceUtils';
import { useLocations } from '../context/LocationContext';
import EventEmitter from '../_utils/EventEmitter';

// Calculate sizes based on card height
const getElementSizes = (cardHeight: number) => ({
  // Status icon sizing (40% of card height)
  statusIcon: {
    width: cardHeight * 0.85,
    height: cardHeight * 0.85,
  },
  // Text sizes
  title: {
    fontSize: cardHeight * 0.165,
    lineHeight: cardHeight * 0.19,
  },
  status: {
    fontSize: cardHeight * 0.134,
    lineHeight: cardHeight * 0.21,
  },
  // Spacing
  spacing: {
    betweenLines: cardHeight * 0.0001,
  },
  // Heart icon (25% of card height)
  heart: cardHeight * 0.25,
});

interface CardProps {
  location: Location;
  onPress?: (location: Location) => void;
}

const Card = React.memo(({ location }: CardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { lastUpdate, getLocation } = useLocations();
  const router = useRouter();
  
  // Convert lastUpdate number to Date object
  const lastUpdateDate = useMemo(() => new Date(lastUpdate), [lastUpdate]);

  // Get real-time location data from context
  const currentLocation = useMemo(() => 
    getLocation(location.id) || location,
    [getLocation, location.id, lastUpdate]
  );

  // Check if location is currently open
  const isOpen = useMemo(() => 
    isLocationOpen(currentLocation),
    [currentLocation.hours, lastUpdate]
  );

  // Get status icon based on current time
  const StatusIcon = useMemo(() => 
    getStatusIcon(currentLocation),
    [currentLocation, lastUpdate]
  );
  
  // Get card height based on device size
  const cardHeight = DEVICE.isSmallDevice 
    ? CARD.height.small 
    : DEVICE.isMediumDevice 
      ? CARD.height.medium 
      : CARD.height.large;

  // Get proportional sizes for all elements
  const sizes = getElementSizes(cardHeight);

  // Get hours data
  const { nextOpenDay, openTime, closeTime } = useMemo(() => 
    getLocationHours(currentLocation),
    [currentLocation.hours]
  );

  // Format the status text with distance
  const statusText = useMemo(() => {
    if (!currentLocation.hours) return 'Hours unavailable';

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[lastUpdateDate.getDay()];
    const todayHours = currentLocation.hours[today];

    // Format distance
    const distanceStr = currentLocation.distance 
      ? ` • ${currentLocation.distance.toFixed(1)} mi` 
      : '';

    if (isOpen && todayHours?.close) {
      return `until ${todayHours.close}${distanceStr}`;
    }

    // If it's closed, find next opening time
    if (todayHours?.open === 'Closed') {
      // Find next day that's not closed
      for (let i = 1; i <= 7; i++) {
        const nextDay = days[(lastUpdateDate.getDay() + i) % 7];
        const nextDayHours = currentLocation.hours[nextDay];
        if (nextDayHours?.open && nextDayHours.open !== 'Closed') {
          const dayName = i === 1 ? 'Mon' : nextDay.slice(0, 3).charAt(0).toUpperCase() + nextDay.slice(1, 3);
          return `until ${nextDayHours.open} ${dayName}${distanceStr}`;
        }
      }
    }

    // If opening later today
    if (todayHours?.open) {
      return `until ${todayHours.open}${distanceStr}`;
    }

    return `Hours unavailable${distanceStr}`;
  }, [currentLocation.hours, currentLocation.distance, isOpen, lastUpdateDate]);

  // Get formatted distance
  const distance = React.useMemo(() => 
    formatDistance(currentLocation),
    [currentLocation.distance]
  );

  return (
    <TouchableOpacity 
      onPress={() => {
        router.push(`/location/${currentLocation.id}`);
      }}
      className="bg-white rounded-xl mx-3 my-2 border border-gray-200"
      style={{
        height: cardHeight,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.13,
        shadowRadius: 5,
        elevation: 10,
      }}
    >
      {/* Main Container */}
      <View className="p-3 h-full">
        {/* Status Icon and Title Row */}
        <View className="flex-row items-center h-full">
          {/* Status Icon */}
          <View 
            style={{ 
              width: sizes.statusIcon.width, 
              height: sizes.statusIcon.height 
            }} 
            className="mr-3"
          >
            <StatusIcon width="100%" height="100%" />
          </View>

          {/* Title and Status */}
          <View className="flex-1 pr-2">
            <Text 
              className="font-aileron-bold" 
              numberOfLines={2}
              style={{ 
                fontSize: sizes.title.fontSize,
                lineHeight: sizes.title.lineHeight,
              }}
            >
              {currentLocation.title}
            </Text>
            
            <View className="flex-row items-center">
              <Text 
                className={`font-aileron-bold ${
                  isOpen ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isOpen ? 'Open' : 'Closed'}
              </Text>
              <Text className="font-aileron text-black ml-1">
                {statusText}
              </Text>
            </View>
          </View>

          {/* Heart Icon */}
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              console.log('[Card] Before toggle for location:', currentLocation.id);
              toggleFavorite(currentLocation.id);
              console.log('[Card] Emitting toggle event for location:', currentLocation.id);
              EventEmitter.emit('locationFavoriteToggled', currentLocation.id);
              console.log('[Card] After toggle event emitted');
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="ml-2 self-start pt-0.5"
          >
            <Heart 
              size={sizes.heart}
              color={isFavorite(currentLocation.id) ? "#EF4444" : "#94A3B8"}
              fill={isFavorite(currentLocation.id) ? "#EF4444" : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Update memo comparison to include relevant fields
  return (
    prevProps.location.id === nextProps.location.id &&
    prevProps.location.currentStatus === nextProps.location.currentStatus &&
    prevProps.location.closingTime === nextProps.location.closingTime &&
    prevProps.location.crowdInfo?.percentage === nextProps.location.crowdInfo?.percentage &&
    prevProps.location.distance === nextProps.location.distance
  );
});

export default Card;