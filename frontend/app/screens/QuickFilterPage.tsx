import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackArrow } from '../../assets';
import { filterCategories } from '../config/filterConfig';
import { useFilters } from '../context/FilterContext';
import {
  StudyWhite,
  DiningWhite,
  GymWhite,
  NotBusyWhite,
  VeryBusyWhite,
  FairlyBusyWhite,
  StudyUnselected,
  DiningUnselected,
  GymUnselected,
  NotBusyUnselected,
  VeryBusyUnselected,
  ModeratelyBusyUnselected,
} from '../../assets';

export default function QuickFilterPage() {
  const router = useRouter();
  const { quickFilterPreferences, toggleQuickFilterPreference } = useFilters();

  const getIcon = (type: string, isSelected: boolean) => {
    if (isSelected) {
      switch (type) {
        case 'study':
          return <StudyWhite width={16} height={16} />;
        case 'dining':
          return <DiningWhite width={16} height={16} />;
        case 'gym':
          return <GymWhite width={16} height={16} />;
        case 'not-busy':
          return <NotBusyWhite width={16} height={16} />;
        case 'very-busy':
          return <VeryBusyWhite width={16} height={16} />;
        case 'fairly-busy':
          return <FairlyBusyWhite width={16} height={16} />;
        default:
          return null;
      }
    } else {
      switch (type) {
        case 'study':
          return <StudyUnselected width={16} height={16} />;
        case 'dining':
          return <DiningUnselected width={16} height={16} />;
        case 'gym':
          return <GymUnselected width={16} height={16} />;
        case 'not-busy':
          return <NotBusyUnselected width={16} height={16} />;
        case 'very-busy':
          return <VeryBusyUnselected width={16} height={16} />;
        case 'fairly-busy':
          return <ModeratelyBusyUnselected width={16} height={16} />;
        default:
          return null;
      }
    }
  };

  const getButtonLabel = (filter: any) => {
    if (filter.id === 'fairly-busy') {
      return 'Fairly Busy';
    }
    return filter.label;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <BackArrow width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Customize Quick Filters</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <Text className="text-base text-gray-500 mb-4">
          Select which filters appear in the quick access bar
        </Text>
        
        <View className="flex-row flex-wrap">
          {filterCategories.map((filter) => {
            const isSelected = quickFilterPreferences.includes(filter.id);
            return (
              <View key={filter.id} className="m-1">
                <TouchableOpacity
                  onPress={() => toggleQuickFilterPreference(filter.id)}
                  className={`flex-row items-center px-3 py-2 rounded-full ${
                    isSelected ? 'bg-black' : 'bg-white'
                  }`}
                  style={{
                    borderWidth: 1,
                    borderColor: isSelected ? 'transparent' : '#E5E5E5',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 3,
                  }}
                >
                  {getIcon(filter.id, isSelected)}
                  <Text
                    className={`ml-2 ${
                      isSelected ? 'text-white' : 'text-black'
                    }`}
                  >
                    {getButtonLabel(filter)}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 