import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
};

// Initialize with default values
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from storage when component mounts
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          // Convert object to array of keys where value is true
          const favoritesObj = JSON.parse(storedFavorites);
          const favoritesArray = Object.keys(favoritesObj).filter(key => favoritesObj[key]);
          setFavorites(favoritesArray);
        }
      } catch (error) {
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (locationId: string) => {
    try {
      const newFavorites = favorites.includes(locationId)
        ? favorites.filter(id => id !== locationId)
        : [...favorites, locationId];
      
      setFavorites(newFavorites);
      // Store as object for backward compatibility
      const favoritesObj = Object.fromEntries(
        newFavorites.map(id => [id, true])
      );
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesObj));
    } catch (error) {
    }
  };

  const isFavorite = (locationId: string): boolean => {
    return favorites.includes(locationId);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
