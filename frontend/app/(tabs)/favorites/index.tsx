import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Card } from "@/app/components";
import React from "react";
import { useFavorites } from '@/app/context/FavoritesContext';
import { mockLocations } from '@/app/data/mockLocations';
import type { Location } from '@/app/types/location';

const FavoritesScreen = () => {
  const { favorites, isFavorite } = useFavorites();

  // Filter locations to show only favorited ones
  const favoritedLocations = mockLocations.filter(location => isFavorite(location.id));

  return (
    <SafeAreaView className="flex-1 bg-background">
      {favoritedLocations.length > 0 ? (
        <ScrollView className="py-1 px-2">
          {favoritedLocations.map((location) => (
            <Card
              key={location.id}
              location={location}
            />
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-lg text-gray-500 font-aileron text-center">
            No favorites yet. Add some locations to your favorites! ♥️
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;
