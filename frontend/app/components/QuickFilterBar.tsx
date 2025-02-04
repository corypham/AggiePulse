import React from 'react';
import { ScrollView, View } from 'react-native';
import { QuickFilterButton } from './QuickFilterButton';
import { filterCategories } from '../data/mockLocations'; // Import filter categories
import { useFilters } from '../context/FilterContext';

export function QuickFilterBar() {
  const { selectedFilters, toggleFilter } = useFilters();
  
  // Only show main categories (not status filters)
  const mainFilters = filterCategories.filter(filter => filter.type !== 'status');

  return (
    <View className="w-full py-1">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-2"
        contentContainerStyle={{ paddingVertical: 6 }}
      >
        {mainFilters.map((filter) => (
          <QuickFilterButton
            key={filter.id}
            label={filter.label}
            type={filter.id}
            isSelected={selectedFilters.includes(filter.id)}
            onPress={() => toggleFilter(filter.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
