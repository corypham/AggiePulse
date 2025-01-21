// Path: frontend/components/MapView.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocationService } from '../services/locationServince';
import { Location as LocationType } from '../types/location';
import MapMarker from './MapMarker'; // We'll create this next

const initialRegion = {
  latitude: 38.5382, // UC Davis center coordinates
  longitude: -121.7617,
  latitudeDelta: 0.0222,
  longitudeDelta: 0.0121,
};

interface CustomMapViewProps {
  selectedFilters?: string[];
  onMarkerPress?: (location: LocationType) => void;
}

export const CustomMapView: React.FC<CustomMapViewProps> = ({
  selectedFilters = [],
  onMarkerPress,
}) => {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Load locations
    const loadLocations = async () => {
      const data = await LocationService.getAllLocations();
      setLocations(data);
    };

    // Get user location permission
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };

    loadLocations();
    getUserLocation();
  }, []);

  // Filter locations based on selected filters
  const filteredLocations = locations.filter(location =>
    selectedFilters.length === 0 || location.type.some(t => selectedFilters.includes(t))
  );

  return (
    <View className="flex-1">
      <MapView
        // provider={PROVIDER_GOOGLE}  // Comment this out temporarily
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        className="w-full h-full"
      >
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinates}
            onPress={() => onMarkerPress?.(location)}
          >
            <MapMarker type={location.type[0]} status={location.status} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};