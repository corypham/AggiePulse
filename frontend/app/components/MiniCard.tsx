import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { getStatusIcon, getStatusText, getStatusTitleBgClass } from '@/app/_utils/businessUtils';
import type { Location } from '@/app/types/location';
import { getLocationHours, isLocationOpen, getOpenStatusText, getCurrentDay } from '@/app/_utils/timeUtils';
import { formatDistance } from '../_utils/distanceUtils';
import { useLocations } from '@/app/context/LocationContext';

interface MiniCardProps {
  location: Location;
}

export const MiniCard = React.memo(({ location }: MiniCardProps) => {
  const { lastUpdate, getLocation } = useLocations();
  
  // Get real-time location data from context
  const currentLocation = useMemo(() => 
    getLocation(location.id) || location,
    [getLocation, location.id, lastUpdate]
  );

  const StatusIcon = getStatusIcon(currentLocation);
  const status = getStatusText(currentLocation);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get hours data
  const { nextOpenDay, openTime, closeTime } = React.useMemo(() => 
    getLocationHours(currentLocation),
    [currentLocation.hours]
  );

  // Check if location is currently open based on busyness data
  const isOpen = useMemo(() => 
    isLocationOpen(currentLocation),
    [currentLocation.hours]
  );

  // Get status text
  const statusText = React.useMemo(() => {
    // If location is open but hours are unavailable
    if (isOpen && (!currentLocation.hours || !currentLocation.hours[getCurrentDay()])) {
      return 'Hours unavailable';
    }
    
    // If location is closed and we have next opening time, show it regardless of hours availability
    if (!isOpen && openTime) {
      return `until ${openTime}${nextOpenDay ? ` ${nextOpenDay}` : ''}`;
    }
    
    // If location is open and we have closing time
    if (isOpen && closeTime) {
      return `until ${closeTime}`;
    }

    // Fallback case
    return 'Hours unavailable';
  }, [currentLocation.hours, isOpen, closeTime, openTime, nextOpenDay]);

  // Get formatted distance
  const distance = React.useMemo(() => 
    formatDistance(currentLocation),
    [currentLocation.distance]
  );

  useEffect(() => {
    // Reset animation value
    fadeAnim.setValue(0);
    // Start animation with a slight delay
    const animationTimeout = setTimeout(() => {
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
        velocity: 0.5
      }).start();
    }, 100);

    return () => clearTimeout(animationTimeout);
  }, []); // Run only on mount

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{
        scale: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1]
        })
      }]
    }}>
      <View className="items-center">
        <View className="px-4 py-0.5">
          <View style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 2,
            backgroundColor: 'transparent',
          }}>
            {/* Main Card */}
            <View className="flex-row p-3 bg-white rounded-3xl w-[284px] items-center relative">
              {/* Card content */}
              <View className="absolute top-3 right-3">
                <Text className="text-xs font-aileron text-black">
                  {distance}
                </Text>
              </View>

              <View className="mr-3">
                <StatusIcon width={56} height={56} />
              </View>
              
              <View className="flex-1 pr-12">
                <Text 
                  className="text-base font-aileron-bold text-black mb-0.5"
                  numberOfLines={2}
                >
                  {currentLocation.title}
                </Text>
                <View className="flex-row items-center">
                  <Text 
                    style={{ fontSize: 12 }}
                    className={`font-aileron-bold ${
                      isOpen ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isOpen ? 'Open' : 'Closed'}
                  </Text>
                  <Text 
                    style={{ fontSize: 12 }}
                    className="font-aileron text-black ml-1"
                  >
                    {statusText}
                  </Text>
                </View>
              </View>
            </View>

            {/* Triangle pointer - now part of the main card's shadow */}
            <View style={{
              alignSelf: 'center',
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderTopWidth: 18,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: 'white',
              marginTop: -1, // Slightly overlap with the card to prevent gap
              zIndex: -1, // Place behind the card
            }} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return prevProps.location.id === nextProps.location.id;
}); 