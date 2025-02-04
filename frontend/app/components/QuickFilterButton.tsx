import React from 'react';
import { TouchableOpacity, Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { 
  StudyUnselected, 
  DiningUnselected, 
  GymUnselected, 
  NotBusyUnselected,
  VeryBusyUnselected,
  ModeratelyBusyUnselected,
  StudySelected, 
  DiningSelected, 
  GymSelected, 
  NotBusySelected,
  VeryBusySelected,
  ModeratelyBusySelected
} from '../../assets';

interface QuickFilterButtonProps {
  label: string;
  type: string;
  isSelected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  customIcon?: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
  customTextStyle?: StyleProp<TextStyle>;
}

export function QuickFilterButton({ 
  label, 
  type, 
  isSelected, 
  onPress,
  onLongPress,
  customIcon,
  customStyle,
  customTextStyle
}: QuickFilterButtonProps) {
  const getIcon = () => {
    if (customIcon) return customIcon;
    
    switch (type) {
      case 'study':
        return isSelected ? <StudySelected width={16} height={16} /> : <StudyUnselected width={16} height={16} />;
      case 'dining':
        return isSelected ? <DiningSelected width={16} height={16} /> : <DiningUnselected width={16} height={16} />;
      case 'gym':
        return isSelected ? <GymSelected width={16} height={16} /> : <GymUnselected width={16} height={16} />;
      case 'not-busy':
        return isSelected ? <NotBusySelected width={16} height={16} /> : <NotBusyUnselected width={16} height={16} />;
      case 'very-busy':
        return isSelected ? <VeryBusySelected width={16} height={16} /> : <VeryBusyUnselected width={16} height={16} />;
      case 'fairly-busy':
        return isSelected ? <ModeratelyBusySelected width={16} height={16} /> : <ModeratelyBusyUnselected width={16} height={16} />;
      default:
        return null;
    }
  };

  const getButtonLabel = () => {
    if (type === 'fairly-busy') {
      return 'Fairly Busy';
    }
    return label;
  };

  return (
    <View className="px-1.5">
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={2000}
        style={[{
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
        }, customStyle]}
        className={`flex-row items-center px-3 py-[8px] rounded-full ${
          isSelected ? 'bg-[#f0f6ff]' : 'bg-white'
        }`}
      >
        {getIcon()}
        <Text
          style={customTextStyle}
          className={`ml-2 ${
            isSelected ? 'text-[#3b2dff]' : 'text-black'
          }`}
        >
          {getButtonLabel()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
