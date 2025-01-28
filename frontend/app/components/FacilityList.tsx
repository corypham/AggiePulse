import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Card from './Card';

interface FacilityListProps {
  facilitiesCount: number;
}

export const FacilityList: React.FC<FacilityListProps> = ({ facilitiesCount }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['8%', '66%', '93%'], []);

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
    >
      {/* Header Section */}
      <View className="bg-white">
        <View className="flex-row items-center justify-center py-1 pb-4">
          <Text className="font-aileron-bold text-lg">
            {facilitiesCount} 
          </Text>
          <Text className="font-aileron-light ml-1 text-lg">Available Facilities</Text>
        </View>
      </View>

      {/* Scrollable Content Section */}
      <BottomSheetScrollView 
        className="flex-1 px-3 bg-background border-t border-gray-300"
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-row items-center justify-between mb-4 pt-6 px-6">
          <View className="flex-row pl-3">
            <Text className="text-2xl font-aileron-bold">List View</Text>
          </View>
          <View className="border border-gray-600 rounded-full px-4 py-2">
            <Text className="font-aileron">sort by: ▼</Text>
          </View>
        </View>

        {/* Facility Cards */}
        <Card
          title="Silo Market"
          status="Fairly Busy"
          isOpen={true}
          closingTime="00:00 XM"
          distance={0.0}
          isFavorite={false}
          onFavoritePress={() => {
            // Handle favorite toggle
          }}
        />
        <Card
          title="Activities and Recreation Center"
          status="Fairly Busy"
          isOpen={true}
          closingTime="00:00 XM"
          distance={0.0}
          isFavorite={false}
          onFavoritePress={() => {
            // Handle favorite toggle
          }}
        />
        <Card
          title="Memorial Union"
          status="Fairly Busy"
          isOpen={true}
          closingTime="00:00 XM"
          distance={0.0}
          isFavorite={false}
          onFavoritePress={() => {
            // Handle favorite toggle
          }}
        />
        <Card
          title="Peter J. Shields Library"
          status="Fairly Busy"
          isOpen={true}
          closingTime="00:00 XM"
          distance={0.0}
          isFavorite={false}
          onFavoritePress={() => {
            // Handle favorite toggle
          }}
        />
                <Card
          title="Silo Market"
          status="Fairly Busy"
          isOpen={true}
          closingTime="00:00 XM"
          distance={0.0}
          isFavorite={false}
          onFavoritePress={() => {
            // Handle favorite toggle
          }}
        />
        <Card
          title="Activities and Recreation Center"
          status="Fairly Busy"
          isOpen={true}
          closingTime="00:00 XM"
          distance={0.0}
          isFavorite={false}
          onFavoritePress={() => {
            // Handle favorite toggle
          }}
        />
        <Card
          title="Memorial Union"
          status="Fairly Busy"
          isOpen={true}
          closingTime="00:00 XM"
          distance={0.0}
          isFavorite={false}
          onFavoritePress={() => {
            // Handle favorite toggle
          }}
        />
        <Card
          title="Peter J. Shields Library"
          status="Fairly Busy"
          isOpen={true}
          closingTime="00:00 XM"
          distance={0.0}
          isFavorite={false}
          onFavoritePress={() => {
            // Handle favorite toggle
          }}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default FacilityList;