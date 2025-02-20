import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useFilters } from '../context/FilterContext';
import { SvgProps } from 'react-native-svg';
import { getFilterIcon } from '../_utils/iconMapping';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: React.FC<SvgProps>;
}> = ({ label, isActive, onPress, icon: Icon }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`
      flex-row items-center px-5 py-2.5 rounded-full
      ${isActive ? 'bg-primary' : 'bg-gray-100'}
      border border-gray-200
    `}
  >
    {Icon && (
      <View className="mr-2">
        <Icon width={18} height={18} color={isActive ? "#FFFFFF" : "#000000"} />
      </View>
    )}
    <Text className={`${isActive ? 'text-white' : 'text-black'} text-base font-aileron`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const FilterPage: React.FC = () => {
  const router = useRouter();
  const { selectedFilters, toggleFilter, clearFilters } = useFilters();
  const [distance, setDistance] = useState(2);

  const getDistanceLabel = (value: number) => {
    switch(value) {
      case 0: return { label: 'Very Close', range: '0-0.25 miles' };
      case 1: return { label: 'Close', range: '0-0.5 miles' };
      case 2: return { label: 'Moderate', range: '0-0.66 miles' };
      case 3: return { label: 'Far', range: '0-1 miles' };
      case 4: return { label: 'Very Far', range: '0-4 miles' };
      default: return { label: 'Moderate', range: '0-0.66 miles' };
    }
  };

  const handleDistanceChange = (value: number) => {
    setDistance(value);
    const distanceFilter = `distance-${value}`;
    const filteredFilters = selectedFilters.filter(f => !f.startsWith('distance-'));
    toggleFilter(distanceFilter);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearFilters}>
          <Text className="text-primary text-base font-aileron">Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Level of Busyness */}
        <View className="px-5 py-8">
          <Text className="text-2xl font-aileron-bold mb-4">Level of Busyness</Text>
          <View className="flex-row flex-wrap gap-3">
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
          <Text className="text-2xl font-aileron-bold mb-4">Location Type</Text>
          <View className="flex-row flex-wrap gap-3">
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
          <Text className="text-2xl font-aileron-bold mb-4">Distance</Text>
          <View className="relative h-32">
            {/* Distance Label */}
            <View className="absolute -top-1 left-1/2 -translate-x-1/2 bg-black rounded-lg px-3 py-1 z-10">
              <Text className="text-white text-sm font-aileron-bold">
                {getDistanceLabel(distance).label}
              </Text>
              <Text className="text-white text-xs font-aileron text-center">
                {getDistanceLabel(distance).range}
              </Text>
            </View>

            {/* Slider Track with Markers */}
            <View className="mt-14">
              {/* Marker Lines */}
              <View className="absolute top-0 w-full flex-row justify-between px-1">
                {[0, 1, 2, 3, 4].map((_, index) => (
                  <Text key={index} className="text-gray-400 text-center">|</Text>
                ))}
              </View>

              {/* Custom Track */}
              <View className="absolute top-7 w-full h-1 bg-gray-200">
                <View 
                  className="absolute h-full bg-black" 
                  style={{ width: `${(distance/4) * 100}%` }} 
                />
              </View>

              {/* Slider */}
              <Slider
                style={[
                  { width: '100%', height: 40 },
                  Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
                ]}
                minimumValue={0}
                maximumValue={4}
                step={1}
                value={distance}
                onValueChange={handleDistanceChange}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="white"
              />
            </View>
          </View>
        </View>

        {/* Hours */}
        <View className="px-5 pb-8">
          <Text className="text-2xl font-aileron-bold mb-4">Hours</Text>
          <View className="flex-row flex-wrap gap-3">
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
          <Text className="text-2xl font-aileron-bold mb-4">Available Amenities</Text>
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
        <View className="px-5 py-4">
          <TouchableOpacity 
            className="bg-primary rounded-full py-3.5 items-center"
            onPress={() => router.back()}
          >
            <Text className="text-white font-aileron-bold text-lg">Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FilterPage;