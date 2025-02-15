import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Card } from "@/app/components";
import React, { useMemo, useEffect } from "react";
import { useFavorites } from '@/app/context/FavoritesContext';
import { useLocations } from '@/app/context/LocationContext';
import type { Location } from '@/app/types/location';

const FavoritesScreen = () => {
  const { favorites, isFavorite } = useFavorites();
  const { locations, lastUpdate } = useLocations();
  const [isLoading, setIsLoading] = React.useState(true);

  // Get favorited locations from context
  const favoritedLocations = useMemo(() => 
    locations.filter(location => isFavorite(location.id)),
    [locations, favorites, lastUpdate]
  );

  useEffect(() => {
    setIsLoading(false);
  }, [locations]);

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
