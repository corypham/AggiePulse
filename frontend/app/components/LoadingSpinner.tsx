import React from 'react';
import { View, Animated, Easing } from 'react-native';

export const LoadingSpinner = ({ overlay = false }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (overlay) {
    return (
      <View className="absolute inset-0 bg-black/30 z-50 flex justify-center items-center">
        <Animated.View 
          className="w-12 h-12 border-4 border-background rounded-full border-t-primary"
          style={{ transform: [{ rotate }] }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Animated.View 
        className="w-12 h-12 border-4 border-background rounded-full border-t-primary"
        style={{ transform: [{ rotate }] }}
      />
    </View>
  );
}; 