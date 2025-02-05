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
    <ScrollView className="flex-1 bg-background">
      {/* Header Image & Navigation */}
      <View className="relative h-48">
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
            <Heart size={24} color={isLocationFavorite ? "#ff4c4c" : "#848484"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title Section */}
      <View className="px-4 py-2">
        <View className="flex-row items-center space-x-2">
          <Text className="font-aileron-bold text-lg">{location.name}</Text>
          <View className="bg-[#F3A952] px-2 py-1 rounded-full">
            <Text className="text-sm font-aileron text-white">Fairly busy</Text>
          </View>
        </View>
        <Text className="font-aileron text-sm text-textSecondary">
          Open until {location.closingTime} • {location.distance} mi
        </Text>
        <Text className="font-aileron text-sm text-textSecondary mt-1">
          Best Time: {location.bestTimes.best}
        </Text>
      </View>

      {/* Crowd Info Section */}
      <View className="px-4 py-4 bg-white mt-2">
        <Text className="font-aileron-bold text-lg mb-4">Crowd Levels</Text>
        <View className="bg-[#FFF9E7] p-4 rounded-xl">
          <Text className="font-aileron-bold text-base mb-2">
            Overall: {location.crowdInfo.percentage}% full
          </Text>
          <Text className="font-aileron text-sm text-textSecondary">
            • {location.currentCapacity}/{location.maxCapacity} of full capacity
          </Text>
          <Text className="font-aileron text-sm text-textSecondary">
            • {location.crowdInfo.description}
          </Text>
        </View>
      </View>

      {/* Sub Locations */}
      <View className="px-4 py-4 bg-white mt-2">
        <Text className="font-aileron-bold text-lg mb-4">Best Spot: Main Library</Text>
        {location.subLocations.map((subLocation, index) => (
          <TouchableOpacity 
            key={index}
            className="flex-row items-center justify-between bg-background p-4 rounded-xl mb-2"
          >
            <View className="flex-row items-center space-x-3">
              <View className={`w-2 h-2 rounded-full ${
                subLocation.status === 'Not Busy' ? 'bg-open' : 
                subLocation.status === 'Fairly Busy' ? 'bg-[#F3A952]' : 'bg-closed'
              }`} />
              <Text className="font-aileron-bold">{subLocation.name}</Text>
            </View>
            <View className="flex-row">
              {subLocation.features.map((feature, idx) => (
                <View key={idx} className="ml-2">
                  {/* You would import and use the appropriate icon here */}
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Details Section */}
      <View className="px-4 py-4 bg-white mt-2">
        <Text className="font-aileron-bold text-lg mb-2">Details</Text>
        <Text className="font-aileron text-sm text-textSecondary">
          {location.description}
        </Text>
      </View>

      {/* Hours Section */}
      <View className="px-4 py-4 bg-white mt-2">
        <Text className="font-aileron-bold text-lg mb-4">Hours</Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="font-aileron text-red-500">Closed</Text>
            <Text className="font-aileron">Main Building: {location.hours.main.open} - {location.hours.main.close}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-aileron text-open">Open</Text>
            <Text className="font-aileron">24-Hour Study Room: {location.hours.study?.open} - {location.hours.study?.close}</Text>
          </View>
        </View>
      </View>

      {/* Amenities Section */}
      <View className="px-4 py-4 bg-white mt-2 mb-8">
        <Text className="font-aileron-bold text-lg mb-4">Amenities</Text>
        <View className="flex-row flex-wrap">
          {location.features.map((feature, index) => (
            <View key={index} className="flex-row items-center mr-4 mb-2">
              {/* You would import and use the appropriate icon here */}
              <Text className="font-aileron text-sm ml-2">{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 