import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LocationDetails } from '../components/LocationDetails';
import { useLocations } from '../hooks/useLocations';

export default function LocationPage() {
  const { id } = useLocalSearchParams();
  const { locations, loading, error } = useLocations([]);
  
  const location = locations.find(loc => loc.id === id);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!location || error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-aileron text-base">Location not found</Text>
      </View>
    );
  }

  return <LocationDetails location={location} />;
} 