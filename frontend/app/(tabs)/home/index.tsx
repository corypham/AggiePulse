// Path: frontend/app/(tabs)/home/index.tsx

import React, { useState } from 'react';
import { View } from 'react-native';
import { CustomMapView } from '../../components/MapView';
import { SearchBar } from '../../components/SearchBar';
import { FacilityList } from '../../components/FacilityList';
import { Location } from '../../types/location';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleMarkerPress = (location: Location) => {
    // Handle marker press - we can add bottom sheet here later
    console.log('Selected location:', location);
  };

  const handleFilterPress = () => {
    // Handle filter button press
    console.log('Filter button pressed');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <CustomMapView 
        selectedFilters={selectedFilters}
        onMarkerPress={handleMarkerPress}
      />
      <View className="absolute w-full">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          onFilterPress={handleFilterPress}
        />
        {/* FilterChips will go here */}
      </View>
      <FacilityList facilitiesCount={10} />
    </View>
  );
}