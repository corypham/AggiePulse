// Path: frontend/app/(tabs)/home/index.tsx

import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { CustomMapView } from '../../components/MapView';
import { SearchBar } from '../../components/SearchBar';
// We'll create FilterChips next
import { Location } from '../../types/location';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleMarkerPress = (location: Location) => {
    // Handle marker press - we can add bottom sheet here later
    console.log('Selected location:', location);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <CustomMapView 
          selectedFilters={selectedFilters}
          onMarkerPress={handleMarkerPress}
        />
        <View className="absolute w-full">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
          {/* FilterChips will go here */}
        </View>
      </View>
    </SafeAreaView>
  );
}