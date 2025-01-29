import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Card from './Card';

interface FacilityListProps {
  facilitiesCount: number;
}

export const FacilityList: React.FC<FacilityListProps> = ({ facilitiesCount }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: screenHeight } = Dimensions.get('window');
  
  const snapPoints = useMemo(() => {
    const minHeight = 60;
    const midHeight = screenHeight * 0.66;
    const maxHeight = screenHeight * 0.82;
    return [minHeight, midHeight, maxHeight];
  }, [screenHeight]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      enableOverDrag={false}
      handleIndicatorStyle={{ backgroundColor: '#CBD5E1' }}
      backgroundStyle={{ 
        backgroundColor: 'white',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
      }}
      containerStyle={{
        marginHorizontal: 0,
        zIndex: 1,
      }}
      handleHeight={20}
    >
      <View style={{ flex: 1, maxHeight: screenHeight * 0.82 - 20 }}>
        {/* Fixed Header */}
        <View className="bg-white">
          <View className="flex-row items-center justify-center py-1 pb-4">
            <Text className="font-aileron-bold text-lg">
              {facilitiesCount} 
            </Text>
            <Text className="font-aileron-light ml-1 text-lg">Available Facilities</Text>
          </View>
        </View>

        {/* Fixed List Header */}
        <View className="bg-background border-t border-gray-300">
          <View className="flex-row items-center justify-between py-4 px-9">
            <View className="flex-row">
              <Text className="text-2xl font-aileron-bold">List View</Text>
            </View>
            <View className="border border-gray-600 rounded-full px-4 py-2">
              <Text className="font-aileron">sort by: ▼</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Content */}
        <BottomSheetScrollView
          className="px-3 bg-background"
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          bounces={false}
        >
          <Card
            title="Silo Market"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
          <Card
            title="Memorial Union"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
          <Card
            title="Activities and Recreation Center"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
          <Card
            title="Activities and Recreation Center"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
          <Card
            title="Activities and Recreation Center"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
          <Card
            title="Activities and Recreation Center"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
};

export default FacilityList;