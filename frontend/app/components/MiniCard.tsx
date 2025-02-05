import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { formatDistance, formatOpenUntil } from '@/app/_utils/formatters';
import { getStatusIcon } from '@/app/_utils/statusIcons';
import type { Location } from '@/app/types/location';

interface MiniCardProps {
  location: Location;
}

export function MiniCard({ location }: MiniCardProps) {
  const StatusIcon = getStatusIcon(location.currentStatus);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

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
                {formatDistance(location.distance)} mi
              </Text>
            </View>

            <View className="mr-3">
              <StatusIcon width={56} height={56} fill="#4B5563" />
            </View>
            
            <View className="flex-1 pr-16">
              <Text className="text-base font-aileron-bold text-black mb-1" numberOfLines={2}>
                {location.name}
              </Text>
              <Text className="text-sm text-black" numberOfLines={1}>
                {location.isOpen ? (
                  <Text className="text-open font-aileron-bold">Open</Text>
                ) : (
                  <Text className="text-closed font-aileron-bold">Closed</Text>
                )}
                <Text className="text-sm text-black font-aileron"> until {formatOpenUntil(location.hours.main.close)}</Text>
              </Text>
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