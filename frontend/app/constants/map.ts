import { Region } from 'react-native-maps';

export const INITIAL_REGION: Region = {
  latitude: 38.5395,
  longitude: -121.7541,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

// You can add other map-related constants here as needed
export const MAP_ANIMATION_DURATION = 100; // milliseconds
export const MIN_ZOOM_LEVEL = 20;
export const MAX_ZOOM_LEVEL = 50; 