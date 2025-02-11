import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import LocationDetails from '../components/LocationDetails';
import { useLocations } from '../context/LocationContext';

export default function LocationPage() {
  const { id } = useLocalSearchParams();
  const { locations } = useLocations();
  
  const location = locations.find(loc => loc.id === id);

  if (!location) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <LocationDetails location={location} />;
} 