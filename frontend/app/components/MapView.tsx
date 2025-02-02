// Path: frontend/components/MapView.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocationService } from '../services/locationServince';
import { Location as LocationType } from '../types/location';
import MapMarker from './MapMarker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    // Load locations
    const loadLocations = async () => {
      const data = await LocationService.getAllLocations();
      setLocations(data);
    };

    // Get user location permission
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    };

    loadLocations();
    getUserLocation();
  }, []);

  // Filter locations based on selected filters
  const filteredLocations = locations.filter(location =>
    selectedFilters.length === 0 || location.type.some(t => selectedFilters.includes(t))
  );

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude
            }}
            onPress={() => onMarkerPress?.(location)}
          >
            <MapMarker type="default" status={location.currentStatus} />
          </Marker>
        ))}
      </MapView>
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(255,255,255,.99)', 'rgba(255,255,255,0)', 'transparent']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.create({
          gradient: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 400,
            zIndex: 0,
            pointerEvents: 'none',
          }
        }).gradient}
      />

      <TouchableOpacity 
        style={styles.locationButton}
        onPress={centerOnUser}
      >
        <Ionicons name="navigate" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationButton: {
    position: 'absolute',
    right: 16,
    bottom: 180,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CustomMapView;