import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';

interface FilterButtonProps {
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-primary rounded-[18px] h-14 w-14 items-center justify-center shadow-lg"
    >
      <SlidersHorizontal size={24} color="white" />
    </TouchableOpacity>
  );
};

export default FilterButton;
