import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import IconStudySpaces from './IconStudySpaces';

interface FilterToggleButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isActive ? styles.active : styles.inactive]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <IconStudySpaces width={24} height={24} fill={isActive ? '#FFFFFF' : '#A9A9A9'} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#0038FF',
  },
  inactive: {
    backgroundColor: '#848484',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Aileron-Bold',
    marginLeft: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FilterToggleButton;