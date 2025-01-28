import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Heart } from "lucide-react-native";

interface CardProps {
  title: string;
  status: 'Very Busy' | 'Fairly Busy' | 'Not Busy';
  isOpen: boolean;
  closingTime: string;
  distance: number;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

const Card = ({ 
  title, 
  status, 
  isOpen, 
  closingTime, 
  distance,
  isFavorite = false,
  onFavoritePress 
}: CardProps) => {
  
  const getStatusColor = () => {
    switch (status) {
      case 'Very Busy':
        return 'bg-red-500';
      case 'Fairly Busy':
        return 'bg-orange-400';
      case 'Not Busy':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <TouchableOpacity className="bg-white rounded-2xl p-6 shadow-sm mx-5 my-2 border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center gap-4">
          {/* Status Indicator */}
          <View className={`w-12 h-12 rounded-full ${getStatusColor()} opacity-20`}>
            <View className={`w-12 h-12 rounded-full ${getStatusColor()} opacity-50`} style={{ position: 'absolute' }}>
              <View className={`w-6 h-6 rounded-full ${getStatusColor()} m-3`} />
            </View>
          </View>
          
          {/* Title and Status */}
          <View>
            <Text className="text-lg font-aileron-bold">{title}</Text>
            <Text className="text-sm font-aileron text-gray-600">{status}</Text>
          </View>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity 
          onPress={onFavoritePress}
          className="p-2"
        >
          <Heart 
            size={24} 
            color={isFavorite ? "#0038FF" : "#CBD5E1"}
            fill={isFavorite ? "#0038FF" : "none"}
          />
        </TouchableOpacity>
      </View>

      {/* Open Status and Distance */}
      <View className="mt-2">
        <View className="flex-row items-center gap-1">
          <Text className="text-green-600 font-aileron-bold">
            {isOpen ? 'Open' : 'Closed'}
          </Text>
          <Text className="text-gray-600 font-aileron">
            until {closingTime} • {distance} mi
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;