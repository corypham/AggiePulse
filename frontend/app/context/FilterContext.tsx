import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FilterContextType = {
  selectedFilters: string[];
  toggleFilter: (filterId: string) => void;
  clearFilters: () => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Load saved filters on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const storedFilters = await AsyncStorage.getItem('selectedFilters');
        if (storedFilters) {
          setSelectedFilters(JSON.parse(storedFilters));
        }
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };
    
    loadFilters();
  }, []);

  const toggleFilter = async (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newFilters);
    
    try {
      await AsyncStorage.setItem('selectedFilters', JSON.stringify(newFilters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  };

  const clearFilters = async () => {
    setSelectedFilters([]);
    try {
      await AsyncStorage.removeItem('selectedFilters');
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };

  return (
    <FilterContext.Provider value={{ selectedFilters, toggleFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}; 