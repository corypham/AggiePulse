import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FilterContextType = {
  selectedFilters: string[];
  quickFilterPreferences: string[];
  toggleFilter: (filterId: string) => void;
  toggleQuickFilterPreference: (filterId: string) => void;
  clearFilters: () => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [quickFilterPreferences, setQuickFilterPreferences] = useState<string[]>(['study', 'dining', 'gym', 'not-busy']); // Default quick filters

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

  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem('quickFilterPreferences');
        if (storedPreferences) {
          setQuickFilterPreferences(JSON.parse(storedPreferences));
        }
      } catch (error) {
        console.error('Error loading quick filter preferences:', error);
      }
    };
    
    loadPreferences();
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

  const toggleQuickFilterPreference = async (filterId: string) => {
    const newPreferences = quickFilterPreferences.includes(filterId)
      ? quickFilterPreferences.filter(id => id !== filterId)
      : [...quickFilterPreferences, filterId];
    
    setQuickFilterPreferences(newPreferences);
    
    try {
      await AsyncStorage.setItem('quickFilterPreferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Error saving quick filter preferences:', error);
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
    <FilterContext.Provider value={{ 
      selectedFilters, 
      quickFilterPreferences,
      toggleFilter, 
      toggleQuickFilterPreference,
      clearFilters 
    }}>
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