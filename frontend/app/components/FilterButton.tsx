import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FilterWhite } from '../../assets';

interface FilterButtonProps {
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-primary rounded-[18px] h-14 w-14 items-center justify-center shadow-lg"
    >
      <FilterWhite width={22} height={22} />
    </TouchableOpacity>
  );
};

export default FilterButton;
