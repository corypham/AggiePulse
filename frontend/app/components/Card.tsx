import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Heart } from "lucide-react-native";
import { router } from 'expo-router';
import type { Location } from '../types/location';
import { useFavorites } from '../context/FavoritesContext';
import { getStatusIcon } from '../_utils/statusIcons';

interface CardProps {
  location: Location;
}

const Card: React.FC<CardProps> = ({ location }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const StatusIcon = getStatusIcon(location.currentStatus);
  
  const handlePress = () => {
    router.push(`/location/${location.id}`);
  };

  const handleFavorite = () => {
    toggleFavorite(location.id);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="bg-white rounded-xl p-6 mx-4 my-2 border border-gray-100 h-28"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center h-full">
        {/* Status Icon */}
        <View className="w-14 h-14 mr-4">
          <StatusIcon />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-start">
            <Text className="text-lg font-aileron-bold flex-1 mr-2" numberOfLines={2}>
              {location.title}
            </Text>

            <TouchableOpacity 
              onPress={handleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart 
                size={24} 
                color={favorites[location.id] ? "#EF4444" : "#94A3B8"}
                fill={favorites[location.id] ? "#EF4444" : "transparent"}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          <View className="mt-1">
            <View className="flex-row items-center">
              <Text className={`font-aileron-bold ${location.isOpen ? 'text-open' : 'text-closed'}`}>
                {location.isOpen ? 'Open' : 'Closed'}
              </Text>
              <Text className="text-textSecondary font-aileron ml-1">
                until {location.closingTime} • {location.distance} mi
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;