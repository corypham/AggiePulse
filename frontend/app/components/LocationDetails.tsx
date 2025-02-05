import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, ChevronLeft, Clock, Users } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { getStatusIcon } from '../_utils/statusIcons';
import { formatOpenUntil } from '../_utils/formatters';
import type { Location } from '../types/location';

interface LocationDetailsProps {
  location: Location;
}

export function LocationDetails({ location }: LocationDetailsProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Memoize the StatusIcon to prevent unnecessary re-renders
  const StatusIcon = useMemo(() => 
    getStatusIcon(location.currentStatus),
    [location.currentStatus]
  );

  // Memoize the favorite status
  const isLocationFavorite = useMemo(() => 
    isFavorite(location.id),
    [isFavorite, location.id]
  );

  const handleFavorite = () => {
    toggleFavorite(location.id);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header Image */}
      <View className="h-72 relative">
        <Image
          source={location.imageUrl}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-12 w-full px-4 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-white/90 p-2 rounded-full"
          >
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleFavorite}
            className="bg-white/90 p-2 rounded-full"
          >
            <Heart 
              size={24}
              color={isLocationFavorite ? "#EF4444" : "#94A3B8"}
              fill={isLocationFavorite ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Title and Status */}
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-aileron-bold">{location.name}</Text>
          <View className="w-14 h-14">
            <StatusIcon width="100%" height="100%" />
          </View>
        </View>

        {/* Crowd Info */}
        <View className="mt-2">
          <Text className="font-aileron text-base text-gray-600">
            {location.crowdInfo.description} • {location.crowdInfo.percentage}% full
          </Text>
        </View>

        {/* Hours and Capacity */}
        <View className="mt-4 bg-white rounded-xl p-4">
          <View className="flex-row items-center">
            <Clock size={20} className="mr-2" />
            <Text className="font-aileron-bold text-lg">
              {location.isOpen ? (
                <Text className="text-open">Open</Text>
              ) : (
                <Text className="text-closed">Closed</Text>
              )}
              <Text className="font-aileron text-black">
                {" "}until {location.hours.main.close}
              </Text>
            </Text>
          </View>
          
          {/* Capacity */}
          <View className="flex-row items-center mt-3">
            <Users size={20} className="mr-2" />
            <Text className="font-aileron text-base">
              {location.currentCapacity} / {location.maxCapacity} people
            </Text>
          </View>
        </View>

        {/* Best Times */}
        <View className="mt-4 bg-white rounded-xl p-4">
          <Text className="font-aileron-bold text-lg mb-2">Best Times to Visit</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="font-aileron text-green-600">Best: {location.bestTimes.best}</Text>
            </View>
            <View>
              <Text className="font-aileron text-red-600">Worst: {location.bestTimes.worst}</Text>
            </View>
          </View>
        </View>

        {/* Sub Locations */}
        {location.subLocations && location.subLocations.length > 0 && (
          <View className="mt-4">
            <Text className="font-aileron-bold text-lg mb-2">Areas</Text>
            {location.subLocations.map((subLocation, index) => (
              <View key={index} className="bg-white rounded-xl p-4 mb-2">
                <Text className="font-aileron-bold">{subLocation.name}</Text>
                <Text className="font-aileron text-gray-600">{subLocation.status}</Text>
                <View className="flex-row flex-wrap mt-2">
                  {subLocation.features.map((feature, idx) => (
                    <Text key={idx} className="font-aileron text-sm mr-2">• {feature}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Amenities */}
        <View className="mt-4">
          <Text className="font-aileron-bold text-lg mb-2">Amenities</Text>
          
          {/* Atmosphere */}
          <View className="bg-white rounded-xl p-4 mb-2">
            <Text className="font-aileron-bold mb-2">Atmosphere</Text>
            {location.amenities.atmosphere.map((item, index) => (
              <Text key={index} className="font-aileron text-base mb-1">• {item}</Text>
            ))}
          </View>
          
          {/* Accessibility */}
          <View className="bg-white rounded-xl p-4">
            <Text className="font-aileron-bold mb-2">Accessibility</Text>
            {location.amenities.accessibility.map((item, index) => (
              <Text key={index} className="font-aileron text-base mb-1">• {item}</Text>
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="mt-4 mb-8">
          <Text className="font-aileron-bold text-lg mb-2">About</Text>
          <Text className="font-aileron text-base">{location.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
} 