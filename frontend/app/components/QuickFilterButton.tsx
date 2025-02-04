import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { StudyBlack, DiningBlack, GymBlack, StudySelected, DiningSelected, GymSelected } from '../../assets';

interface QuickFilterButtonProps {
  label: string;
  type: string;
  isSelected: boolean;
  onPress: () => void;
}

export function QuickFilterButton({ label, type, isSelected, onPress }: QuickFilterButtonProps) {
  const getIcon = () => {
    switch (type) {
      case 'study':
        return isSelected ? <StudySelected width={16} height={16} /> : <StudyBlack width={16} height={16} />;
      case 'dining':
        return isSelected ? <DiningSelected width={16} height={16} /> : <DiningBlack width={16} height={16} />;
      case 'gym':
        return isSelected ? <GymSelected width={16} height={16} /> : <GymBlack width={16} height={16} />;
      default:
        return null;
    }
  };

  return (
    <View className="px-1.5">
      <TouchableOpacity
        onPress={onPress}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
          borderWidth: 1.5,
          borderColor: isSelected ? '#3b2dff' : 'transparent',
        }}
        className={`flex-row items-center px-3 py-[8px] rounded-full ${
          isSelected ? 'bg-[#f0f6ff]' : 'bg-white'
        }`}
      >
        {getIcon()}
        <Text
          className={`ml-2 ${
            isSelected ? 'text-[#3b2dff]' : 'text-black'
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
