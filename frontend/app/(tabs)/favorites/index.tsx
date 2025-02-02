import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Card } from "../../components";
import React from "react";
import { useFavorites } from '../../context/FavoritesContext';
import type { Location } from '../../types/location';

// Sample data - Replace with your actual data or context
const ALL_LOCATIONS: Location[] = [
  {
    id: 'silo-market',
    title: 'Silo Market',
    currentStatus: 'Fairly Busy',
    isOpen: true,
    closingTime: '10:00 PM',
    distance: 0.2
  },
  {
    id: 'arc',
    title: 'Activities and Recreation Center',
    currentStatus: 'Very Busy',
    isOpen: true,
    closingTime: '11:00 PM',
    distance: 0.5
  },
  {
    id: 'mu',
    title: 'Memorial Union',
    currentStatus: 'Not Busy',
    isOpen: true,
    closingTime: '12:00 AM',
    distance: 0.3
  },
  {
    id: 'library',
    title: 'Peter J. Shields Library',
    currentStatus: 'Fairly Busy',
    isOpen: true,
    closingTime: '1:00 AM',
    distance: 0.8
  }
];

const FavoritesScreen = () => {
  const { favorites } = useFavorites();

  // Filter locations to show only favorited ones
  const favoritedLocations = ALL_LOCATIONS.filter(location => favorites[location.id]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {favoritedLocations.length > 0 ? (
        <ScrollView className="py-1">
          {favoritedLocations.map((location) => (
            <Card
              key={location.id}
              location={location}
            />
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-lg text-gray-500 font-aileron text-center">
            No favorites yet. Add some locations to your favorites!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;
