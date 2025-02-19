import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FilterContextType {
  selectedFilters: string[];
  quickFilterPreferences: string[];
  toggleFilter: (filterId: string) => void;
  toggleQuickFilterPreference: (filterId: string) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [quickFilterPreferences, setQuickFilterPreferences] = useState<string[]>([]);

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

  const toggleFilter = useCallback((filterId: string) => {
    setSelectedFilters(prev => {
      // If filter is already selected, remove it
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      }
      // If it's a status filter (open/closed), remove the other status filter if present
      if (filterId === 'open' || filterId === 'closed') {
        const otherStatus = filterId === 'open' ? 'closed' : 'open';
        return [...prev.filter(id => id !== otherStatus), filterId];
      }
      // Otherwise, add the new filter
      return [...prev, filterId];
    });
  }, []);

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
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}; 