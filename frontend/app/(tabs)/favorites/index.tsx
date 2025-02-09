import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Card } from "@/app/components";
import React from "react";
import { useFavorites } from '@/app/context/FavoritesContext';
import { LocationService } from '@/app/services/locationService';
import type { Location } from '@/app/types/location';

const FavoritesScreen = () => {
  const { favorites, isFavorite } = useFavorites();
  const [favoritedLocations, setFavoritedLocations] = React.useState<Location[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch all locations and filter favorites
  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const allLocations = await LocationService.getAllLocations();
        const favoriteLocations = allLocations.filter(location => isFavorite(location.id));
        setFavoritedLocations(favoriteLocations);
      } catch (error) {
        console.error('Error fetching favorite locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [favorites]); // Re-fetch when favorites change

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500 font-aileron">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
