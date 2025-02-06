import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
};

// Initialize with default values
export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
} as FavoritesContextType);

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
      
      // Update state immediately before AsyncStorage
      setFavorites([...newFavorites]); // Create new array reference
      
      // Store in AsyncStorage
      const favoritesObj = Object.fromEntries(
        newFavorites.map(id => [id, true])
      );
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesObj));
    } catch (error) {
      console.error('Error toggling favorite:', error);
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

// Add default export
export default {
  FavoritesContext,
  FavoritesProvider
};
