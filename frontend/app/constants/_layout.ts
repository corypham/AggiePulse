import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DEVICE = {
  width,
  height,
  isSmallDevice: width < 375, // iPhone SE, etc.
  isMediumDevice: width >= 375 && width < 428, // iPhone 13, etc.
  isLargeDevice: width >= 428, // iPhone Pro Max, etc.
};

export const CARD = {
  height: {
    small: 80,
    medium: 100,
    large: 100,
  },
  padding: {
    small: 12,
    medium: 20,
    large: 20,
  },
};