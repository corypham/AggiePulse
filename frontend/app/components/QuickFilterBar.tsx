import React from 'react';
import { ScrollView, View } from 'react-native';
import { QuickFilterButton } from './QuickFilterButton';

interface QuickFilter {
  id: 'study' | 'dining' | 'gym' | 'not_busy';
  label: string;
}

const QUICK_FILTERS: QuickFilter[] = [
  { id: 'study', label: 'Study' },
  { id: 'dining', label: 'Dining' },
  { id: 'gym', label: 'Gym' },
  { id: 'not_busy', label: 'Not Busy' },
];

interface QuickFilterBarProps {
  selectedFilters: string[];
  onFilterChange: (filterId: QuickFilter['id']) => void;
}

export function QuickFilterBar({ selectedFilters, onFilterChange }: QuickFilterBarProps) {
  return (
    <View className="w-full py-1">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-2"
        contentContainerStyle={{ paddingVertical: 6 }}
      >
        {QUICK_FILTERS.map((filter) => (
          <QuickFilterButton
            key={filter.id}
            label={filter.label}
            type={filter.id}
            isSelected={selectedFilters.includes(filter.id)}
            onPress={() => onFilterChange(filter.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
