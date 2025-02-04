import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { QuickFilterButton } from './QuickFilterButton';
import { filterCategories } from '../config/filterConfig';
import { useFilters } from '../context/FilterContext';
import { WhiteCustomizeQuickFilter } from '../../assets';

export function QuickFilterBar() {
  const { selectedFilters, quickFilterPreferences, toggleFilter, clearFilters } = useFilters();
  const router = useRouter();
  
  // Only show preferred filters
  const mainFilters = filterCategories.filter(filter => 
    quickFilterPreferences.includes(filter.id)
  );

  const handleLongPress = () => {
    clearFilters();
  };

  const handleEditPress = () => {
    router.push('../screens/QuickFilterPage');
  };

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
            onLongPress={handleLongPress}
          />
        ))}
        <QuickFilterButton
          label="Edit"
          type="edit"
          isSelected={false}
          onPress={handleEditPress}
          customIcon={<WhiteCustomizeQuickFilter width={16} height={16} />}
          customStyle={{
            backgroundColor: '#000000',
          }}
          customTextStyle={{
            color: '#FFFFFF'
          }}
        />
      </ScrollView>
    </View>
  );
}
