// Path: frontend/components/MapMarker.tsx

import React from 'react';
import { Marker } from 'react-native-maps';
import type { Location } from '../types/location';

interface MapMarkerProps {
  location: Location;
  onPress?: () => void;
}

export function MapMarker({ location, onPress }: MapMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      }}
      onPress={onPress}
      title={location.name}
      description={location.description}
    />
  );
}

export default MapMarker;