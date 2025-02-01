import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Heart } from "lucide-react-native";
import { router } from 'expo-router';

interface CardProps {
  id: string;
  title: string;
  status: 'Very Busy' | 'Fairly Busy' | 'Not Busy';
  isOpen: boolean;
  closingTime: string;
  distance: number;
  isFavorite?: boolean;
  onFavoritePress?: (id: string) => void;
  statusIcon?: React.ReactNode;
}

const Card = ({ 
  id,
  title, 
  status, 
  isOpen, 
  closingTime, 
  distance,
  isFavorite = false,
  onFavoritePress,
  statusIcon
}: CardProps) => {
  
  const handlePress = () => {
    router.push(`/location/${id}`);
  };

  const handleFavorite = () => {
    if (onFavoritePress) {
      onFavoritePress(id);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="bg-white rounded-xl p-6 mx-4 my-2 border border-gray-100 h-28"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center h-full">
        {/* Status Icon */}
        <View className="w-14 h-14 mr-4">
          {statusIcon}
        </View>

        {/* Content */}
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-start">
            {/* Title */}
            <Text className="text-lg font-aileron-bold flex-1 mr-2" numberOfLines={2}>
              {title}
            </Text>

            {/* Favorite Button */}
            <TouchableOpacity 
              onPress={handleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart 
                size={24} 
                color={isFavorite ? "#ff4c4c" : "#848484"}
                fill={isFavorite ? "#ff4c4c" : "none"}
              />
            </TouchableOpacity>
          </View>

          {/* Status and Details */}
          <View className="mt-1">
            <View className="flex-row items-center">
              <Text className={`font-aileron ${isOpen ? 'text-[#338456]' : 'text-closed'}`}>
                {isOpen ? 'Open' : 'Closed'}
              </Text>
              <Text className="text-textSecondary font-aileron ml-1">
                until {closingTime} • {distance} mi
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;