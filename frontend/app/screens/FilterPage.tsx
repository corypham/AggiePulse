import React, { useState } from 'react';
import { View, Text } from 'react-native';
import FilterToggleButton from '../components/FilterToggleButton';

const FilterPage: React.FC = () => {
  const [isNotBusyActive, setIsNotBusyActive] = useState(false);

  const handleNotBusyPress = () => {
    setIsNotBusyActive(!isNotBusyActive);
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Text style={{ fontFamily: 'Aileron-Bold', marginLeft: 4, fontSize: 18, marginTop: 20 }}>
        Location Type
      </Text>
      <FilterToggleButton
        label="Study Spaces"
        isActive={isNotBusyActive}
        onPress={handleNotBusyPress}
      />
      {/* Add more FilterToggleButton components as needed */}
    </View>
  );
};

export default FilterPage;