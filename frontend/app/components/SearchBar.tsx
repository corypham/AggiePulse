// Path: frontend/components/SearchBar.tsx

import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { X, Search } from 'lucide-react-native';
import FilterButton from './FilterButton';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onFilterPress: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  onFilterPress,
  placeholder = "Study Spaces"
}) => {
  return (
    <View className="flex-row items-center mx-4 mt-[66px] gap-2">
      <View className="flex-1 bg-white rounded-full flex-row items-center shadow-sm border border-gray-200">
        <View className="pl-4 py-3">
          <Search size={24} color="#71717a" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          className="flex-1 px-2 py-3 text-base"
          placeholderTextColor="#71717a"
        />
        {value.length > 0 && (
          <TouchableOpacity 
            onPress={onClear}
            className="pr-4 py-3"
          >
            <X size={24} color="#71717a" />
          </TouchableOpacity>
        )}
      </View>
      <FilterButton onPress={onFilterPress} />
    </View>
  );
};

export default SearchBar;