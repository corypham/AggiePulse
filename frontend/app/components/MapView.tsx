// Path: frontend/components/MapView.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocationService } from '../services/locationServince';
import { Location as LocationType } from '../types/location';
import MapMarker from './MapMarker'; 

const initialRegion = {
  latitude: 38.5382,
  longitude: -121.755,
  latitudeDelta: 0.03,
  longitudeDelta: 0.02,
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
    <View style={{ flex: 1 }}>
      <MapView
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={true}
        showsPointsOfInterest={false}
        showsScale={false}
        showsBuildings={true}
        showsCompass={false}
        showsTraffic={false}
        style={{ width: '100%', height: '100%' }}
        legalLabelInsets={{ 
          top: 20,
          bottom: 20,
          left: -100,  // Move the logo off screen to the left
          right: 20
        }}
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

export default CustomMapView;