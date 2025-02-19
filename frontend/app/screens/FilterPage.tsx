import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFilters } from '../context/FilterContext';
import { SvgProps } from 'react-native-svg';
import { getFilterIcon } from '../_utils/iconMapping';
import { SafeAreaView } from 'react-native-safe-area-context';

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: React.FC<SvgProps>;
}> = ({ label, isActive, onPress, icon: Icon }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2
    }}
    className={`flex-row items-center px-5 py-2.5 rounded-full 
      ${isActive ? 'bg-primary' : 'bg-gray-50'}`}
  >
    {Icon && (
      <View className="mr-2">
        <Icon width={18} height={18} />
      </View>
    )}
    <Text className={`${isActive ? 'text-white' : 'text-black'} text-base`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const FilterPage: React.FC = () => {
  const router = useRouter();
  const { selectedFilters, toggleFilter, clearFilters } = useFilters();
  const [distance, setDistance] = useState(2);

  const sliderSections = [
    { value: 0, label: '|' },
    { value: 1, label: '|' },
    { value: 2, label: '|' },
    { value: 3, label: '|' },
    { value: 4, label: '|' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Sticky Header */}
      <View className="z-10 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearFilters}>
            <Text className="text-primary text-base">Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Level of Busyness */}
        <View className="px-5 py-8">
          <Text className="text-2xl font-semibold mb-4">Level of Busyness</Text>
          <View className="flex-row gap-3">
            <FilterButton
              label="Not Busy"
              isActive={selectedFilters.includes('not-busy')}
              onPress={() => toggleFilter('not-busy')}
              icon={getFilterIcon('not-busy', selectedFilters.includes('not-busy'))}
            />
            <FilterButton
              label="Fairly Busy"
              isActive={selectedFilters.includes('fairly-busy')}
              onPress={() => toggleFilter('fairly-busy')}
              icon={getFilterIcon('fairly-busy', selectedFilters.includes('fairly-busy'))}
            />
            <FilterButton
              label="Very Busy"
              isActive={selectedFilters.includes('very-busy')}
              onPress={() => toggleFilter('very-busy')}
              icon={getFilterIcon('very-busy', selectedFilters.includes('very-busy'))}
            />
          </View>
        </View>

        {/* Location Type */}
        <View className="px-5 pb-8">
          <Text className="text-2xl font-semibold mb-4">Location Type</Text>
          <View className="flex-row gap-3">
            <FilterButton
              label="Study"
              isActive={selectedFilters.includes('study')}
              onPress={() => toggleFilter('study')}
              icon={getFilterIcon('study', selectedFilters.includes('study'))}
            />
            <FilterButton
              label="Dining"
              isActive={selectedFilters.includes('dining')}
              onPress={() => toggleFilter('dining')}
              icon={getFilterIcon('dining', selectedFilters.includes('dining'))}
            />
            <FilterButton
              label="Gym"
              isActive={selectedFilters.includes('gym')}
              onPress={() => toggleFilter('gym')}
              icon={getFilterIcon('gym', selectedFilters.includes('gym'))}
            />
          </View>
        </View>

        {/* Distance */}
        <View className="px-5 pb-8">
          <Text className="text-2xl font-semibold mb-4">Distance</Text>
          <View className="relative h-20">
            {/* Slider Track */}
            <View className="absolute top-10 w-full h-1 bg-gray-200">
              <View className="absolute left-0 h-full bg-black" style={{ width: `${(distance/4) * 100}%` }} />
            </View>
            
            {/* Slider Markers */}
            <View className="absolute top-8 w-full flex-row justify-between">
              {sliderSections.map((section, index) => (
                <Text key={index} className="text-gray-400">{section.label}</Text>
              ))}
            </View>

            {/* Distance Label */}
            <View className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-lg px-3 py-1">
              <Text className="text-white text-sm font-medium">Moderate</Text>
              <Text className="text-white text-xs">0.25-0.66 miles</Text>
            </View>
          </View>
        </View>

        {/* Hours */}
        <View className="px-5 pb-8">
          <Text className="text-2xl font-semibold mb-4">Hours</Text>
          <View className="flex-row gap-3">
            <FilterButton
              label="Open Now"
              isActive={selectedFilters.includes('open')}
              onPress={() => toggleFilter('open')}
            />
            <FilterButton
              label="24/7"
              isActive={selectedFilters.includes('24/7')}
              onPress={() => toggleFilter('24/7')}
            />
          </View>
        </View>

        {/* Available Amenities */}
        <View className="px-5 pb-8">
          <Text className="text-2xl font-semibold mb-4">Available Amenities</Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { label: 'Food', id: 'food' },
              { label: 'Computers', id: 'computers' },
              { label: 'Charging Ports', id: 'charging-ports' },
              { label: 'Printers', id: 'printers' },
              { label: 'High-Speed Internet', id: 'high-speed-internet' },
              { label: 'Study Rooms', id: 'study-rooms' },
              { label: 'Projectors', id: 'projectors' },
              { label: 'Work Tables', id: 'work-tables' }
            ].map((amenity) => (
              <FilterButton
                key={amenity.id}
                label={amenity.label}
                isActive={selectedFilters.includes(amenity.id)}
                onPress={() => toggleFilter(amenity.id)}
                icon={getFilterIcon(amenity.id, selectedFilters.includes(amenity.id))}
              />
            ))}
          </View>
        </View>

        {/* Apply Button */}
        <View className="px-5 py-4 mt-4">
          <TouchableOpacity 
            className="bg-primary rounded-full py-3.5 items-center"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold text-lg">Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FilterPage;