import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { Heart } from "lucide-react-native";
import { router } from 'expo-router';
import type { Location } from '../types/location';
import { useFavorites } from '../context/FavoritesContext';
import { getStatusIcon } from '../_utils/statusIcons';
import { DEVICE, CARD } from '../constants/_layout';

// Calculate sizes based on card height
const getElementSizes = (cardHeight: number) => ({
  // Status icon sizing (40% of card height)
  statusIcon: {
    width: cardHeight * 0.8,
    height: cardHeight * 0.8,
  },
  // Text sizes
  title: {
    fontSize: cardHeight * 0.18,
    lineHeight: cardHeight * 0.25,
  },
  status: {
    fontSize: cardHeight * 0.15,
    lineHeight: cardHeight * 0.2,
  },
  // Spacing
  spacing: {
    betweenLines: cardHeight * 0.00001,
  },
  // Heart icon (25% of card height)
  heart: cardHeight * 0.25,
});

interface CardProps {
  location: Location;
}

const Card: React.FC<CardProps> = ({ location }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const StatusIcon = getStatusIcon(location.currentStatus);
  
  // Get card height based on device size
  const cardHeight = DEVICE.isSmallDevice 
    ? CARD.height.small 
    : DEVICE.isMediumDevice 
      ? CARD.height.medium 
      : CARD.height.large;

  // Get proportional sizes for all elements
  const sizes = getElementSizes(cardHeight);
  
  const handlePress = () => {
    router.push(`/location/${location.id}`);
  };

  const handleFavorite = () => {
    toggleFavorite(location.id);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="bg-white rounded-xl mx-4 my-2 border border-gray-100"
      style={{
        height: cardHeight,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Main Container */}
      <View className="p-4 h-full">
        {/* Status Icon and Title Row */}
        <View className="flex-row items-center h-full">
          {/* Status Icon */}
          <View 
            style={{ 
              width: sizes.statusIcon.width, 
              height: sizes.statusIcon.height 
            }} 
            className="mr-3"
          >
            <StatusIcon width="100%" height="100%" />
          </View>

          {/* Title and Status */}
          <View className="flex-1 pr-5">
            <Text 
              className="font-aileron-bold" 
              numberOfLines={2}
              style={{ 
                fontSize: sizes.title.fontSize,
                lineHeight: sizes.title.lineHeight,
              }}
            >
              {location.title}
            </Text>
            
            <View 
              className="flex-row items-center"
              style={{ marginTop: sizes.spacing.betweenLines }}
            >
              <Text 
                className="font-aileron-bold text-open"
                style={{ 
                  fontSize: sizes.status.fontSize,
                  lineHeight: sizes.status.lineHeight,
                }}
              >
                Open
              </Text>
              <Text 
                className="font-aileron"
                style={{ 
                  fontSize: sizes.status.fontSize,
                  lineHeight: sizes.status.lineHeight,
                }}
              >
                {` until ${location.closingTime} • ${location.distance} mi`}
              </Text>
            </View>
          </View>

          {/* Heart Icon */}
          <TouchableOpacity 
            onPress={handleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="ml-2 self-start pt-1"
          >
            <Heart 
              size={sizes.heart}
              color={favorites[location.id] ? "#EF4444" : "#94A3B8"}
              fill={favorites[location.id] ? "#EF4444" : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;