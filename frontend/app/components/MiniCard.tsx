import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { getStatusIcon } from '@/app/_utils/statusIcons';
import type { Location } from '@/app/types/location';
import { getLocationHours, isLocationOpen, getOpenStatusText } from '../_utils/timeUtils';
import { formatDistance } from '../_utils/distanceUtils';

interface MiniCardProps {
  location: Location;
}

export function MiniCard({ location }: MiniCardProps) {
  const StatusIcon = getStatusIcon(location);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Get hours data
  const { nextOpenDay, openTime, closeTime } = React.useMemo(() => 
    getLocationHours(location),
    [location.hours]
  );

  // Check if location is currently open
  const isOpen = React.useMemo(() => 
    isLocationOpen(location),
    [location.hours]
  );

  // Get status text
  const statusText = React.useMemo(() => {
    if (!location.hours) return 'Hours unavailable';

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    const todayHours = location.hours[today];

    if (isOpen && todayHours?.close) {
      return `until ${todayHours.close}`;
    }

    // If it's closed, find next opening time
    if (todayHours?.open === 'Closed') {
      // Find next day that's not closed
      for (let i = 1; i <= 7; i++) {
        const nextDay = days[(new Date().getDay() + i) % 7];
        const nextDayHours = location.hours[nextDay];
        if (nextDayHours?.open && nextDayHours.open !== 'Closed') {
          const dayName = i === 1 ? 'Mon' : nextDay.slice(0, 3).charAt(0).toUpperCase() + nextDay.slice(1, 3);
          return `until ${nextDayHours.open} ${dayName}`;
        }
      }
    }

    // If opening later today
    if (todayHours?.open) {
      return `until ${todayHours.open}`;
    }

    return 'Hours unavailable';
  }, [location.hours, isOpen]);

  // Get formatted distance
  const distance = React.useMemo(() => 
    formatDistance(location),
    [location.distance]
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
        {/* Combined Card and Triangle Container */}
        <View style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 2,
        }}>
          {/* Main Card */}
          <View className="flex-row p-3 bg-white rounded-3xl w-[284px] items-center relative">
            {/* Distance (top-right) */}
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
                {location.title}
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

          {/* Triangle pointer */}
          <View style={{
            alignSelf: 'center',
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderTopWidth: 16,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: 'white',
            marginTop: -1,
          }} />
        </View>
      </View>
    </Animated.View>
  );
} 