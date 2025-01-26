// Path: frontend/components/SearchBar.tsx

import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = "Study Spaces"
}) => {
  return (
    <View className="mx-4 mt-12 bg-white rounded-full flex-row items-center shadow-md">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="flex-1 px-4 py-2"
      />
      {value.length > 0 && (
        <TouchableOpacity 
          onPress={onClear}
          className="p-2 mr-2"
        >
          <X size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;