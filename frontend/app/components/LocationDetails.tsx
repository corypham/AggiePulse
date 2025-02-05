import React, { useMemo, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, ChevronLeft, Share2 } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { formatOpenUntil } from '../_utils/formatters';
import { getStatusIcon } from '@/app/_utils/statusIcons';
import { getLocationStatus } from '@/app/_utils/locationStatus';
import type { Location } from '../types/location';

interface LocationDetailsProps {
  location: Location;
}

export function LocationDetails({ location }: LocationDetailsProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLocationFavorite = useMemo(() => 
    isFavorite(location.id),
    [isFavorite, location.id]
  );

  const StatusIcon = getStatusIcon(location.currentStatus);
  const statusInfo = getLocationStatus(location);

  const handleFavorite = () => {
    toggleFavorite(location.id);
  };

  // Add status bar effect
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header Image & Navigation */}
      <View className="relative h-64">
        <Image
          source={location.imageUrl}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-14 w-full px-4 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-white/90 p-2 rounded-full"
          >
            <ChevronLeft size={24} color="#535353" />
          </TouchableOpacity>
          <View className="flex-row space-x-2">
            <TouchableOpacity 
              onPress={handleFavorite}
              className="bg-white/90 p-2 rounded-full"
            >
              <Heart 
                size={24} 
                color={isLocationFavorite ? "#EF4444" : "#535353"}
                fill={isLocationFavorite ? "#EF4444": "transparent"}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-white/90 p-2 rounded-full"
            >
              <Share2 size={24} color="#535353" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Title Section with Icon */}
      <View className="px-5 py-5 bg-white -mt-5 rounded-t-3xl">
        <View className="flex-row items-start p-4 space-x-3">
          <View className="mt-1.5">
            <location.icons.blue width={28} height={28} />
          </View>
          <View className="flex-1 pl-6">
            <Text className="font-aileron-bold text-[22px] text-black">
              {location.name}
            </Text>
            <View className="flex-row items-center mt-0.5">
              <Text className={`${statusInfo.statusClass} text-lg`}>
                {statusInfo.statusText}
              </Text>
              <Text className="text-black font-aileron text-lg">
                {' '}{statusInfo.timeText} • {location.distance} mi
              </Text>
            </View>
            <View className="flex-row items-center space-x-2 mt-2.5">
              <View className={`
                ${location.currentStatus === 'Not Busy' ? 'bg-[#22C55E]' : 
                  location.currentStatus === 'Fairly Busy' ? 'bg-[#ff8003]' : 
                  'bg-[#EF4444]'} 
                px-2.5 py-1 rounded-lg
              `}>
                <Text className="text-xs font-aileron text-white">{location.currentStatus}</Text>
              </View>
              <Text className="text-[#6B7280] text-[13px] font-aileron">
                Best Time: {location.bestTimes.best}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-4 border-b border-gray-200">
        <TouchableOpacity className="px-4 py-3 border-b-2 border-primary">
          <Text className="font-aileron-bold text-black">Crowd Info</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-4 py-3">
          <Text className="font-aileron text-black">Details</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-4 py-3">
          <Text className="font-aileron text-black">Discussion</Text>
        </TouchableOpacity>
      </View>

      {/* Crowd Levels Section */}
      <View className="px-4 py-4">
        <Text className="font-aileron-bold text-xl mb-4">Crowd Levels</Text>
        <View className="flex-row items-center space-x-4">
          <View className="flex-1">
            <StatusIcon width={120} height={120} />
            <Text className="text-center font-aileron-bold text-[#6B7280] mt-2">
              {location.currentStatus}
            </Text>
          </View>
          <View className="flex-1 bg-[#FFF9E7] p-4 rounded-xl">
            <Text className="font-aileron-bold text-base mb-2">
              Overall: {Math.round((location.currentCapacity / location.maxCapacity) * 100)}% full
            </Text>
            <Text className="font-aileron text-sm text-[#6B7280]">
              • {location.currentCapacity}/{location.maxCapacity} of full capacity
            </Text>
            <Text className="font-aileron text-sm text-[#6B7280]">
              • {location.crowdInfo.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Best Spot Section */}
      <View className="px-4 py-4">
        <Text className="font-aileron-bold text-xl mb-4">Best Spot: Main Library</Text>
        {location.subLocations.map((subLocation, index) => (
          <View 
            key={index}
            className="bg-[#F6F6F6] p-4 rounded-xl mb-2"
          >
            <View className="flex-row items-center space-x-2">
              <View className={`w-2 h-2 rounded-full ${
                subLocation.status === 'Not Busy' ? 'bg-[#22C55E]' : 
                subLocation.status === 'Fairly Busy' ? 'bg-[#F3A952]' : 'bg-[#EF4444]'
              }`} />
              <Text className="font-aileron-bold text-black">{subLocation.name}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Details Section */}
      <View className="px-4 py-4 bg-white mt-2">
        <Text className="font-aileron-bold text-xl mb-2">Details</Text>
        <Text className="font-aileron text-sm text-[#6B7280]">
          {location.description}
        </Text>
      </View>

      {/* Hours Section */}
      <View className="px-4 py-4 bg-white mt-2">
        <Text className="font-aileron-bold text-xl mb-4">Hours</Text>
        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={statusInfo.statusClass}>
              {statusInfo.statusText}
            </Text>
            <Text className="font-aileron text-black">
              Main Building: {location.hours.main.open} - {location.hours.main.close}
            </Text>
          </View>
          {location.hours.study && (
            <View className="flex-row justify-between items-center">
              <Text className="font-aileron-bold text-open">Open</Text>
              <Text className="font-aileron text-black">
                24-Hour Study Room: {location.hours.study.open} - {location.hours.study.close}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Amenities Section */}
      <View className="px-4 py-4 bg-white mt-2 mb-8">
        <Text className="font-aileron-bold text-xl mb-4">Amenities</Text>
        <View className="flex-row flex-wrap gap-4">
          {location.features.map((feature, index) => (
            <View key={index} className="flex-row items-center">
              <Text className="font-aileron text-black ml-2">{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 