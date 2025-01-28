import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

interface FacilityListProps {
  facilitiesCount: number;
}

export const FacilityList: React.FC<FacilityListProps> = ({ facilitiesCount }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '66%', '92%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: '#CBD5E1' }}
      backgroundStyle={{ 
        backgroundColor: 'white',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
      }}
    >
      <BottomSheetView className="flex-1 px-4">
        <View className="flex-row items-center justify-center mb-4">
          <Text className="font-aileron-bold text-lg">
            {facilitiesCount} 
          </Text>
          <Text className="font-aileron-light ml-1 text-lg">Available Facilities</Text>
        </View>
        <Text>Facility List</Text>
        <Text>Facility List</Text>
        <Text>Facility List</Text>
        <Text>Facility List</Text>
        <Text>Facility List</Text>
        <Text>Facility List</Text>
        <Text>Facility List</Text>
        <Text>Facility List</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default FacilityList;
