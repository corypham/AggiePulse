import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, Dimensions, Platform, StatusBar } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Card from './Card';
import { TAB_BAR_HEIGHT } from './TabBar';

interface FacilityListProps {
  facilitiesCount: number;
}

export const FacilityList: React.FC<FacilityListProps> = ({ facilitiesCount }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: screenHeight } = Dimensions.get('window');
  
  // Use StatusBar.currentHeight for Android and fixed height for iOS
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 47;
  const SEARCH_BAR_HEIGHT = 50; // Height of search bar from top
  const HANDLE_HEIGHT = 20;
  const HEADER_HEIGHT = 85;
  
  // Calculate snap points with precise control
  const snapPoints = useMemo(() => {
    const minHeight = HEADER_HEIGHT + HANDLE_HEIGHT;
    const midHeight = screenHeight * 0.5;
    // Calculate maxHeight to stop at the search bar area
    const maxHeight = screenHeight - SEARCH_BAR_HEIGHT - statusBarHeight!;
    return [minHeight, midHeight, maxHeight];
  }, [screenHeight, statusBarHeight]);

  const renderHeader = useCallback(() => (
    <View className="bg-white pt-2">
      <View className="flex-row items-center justify-center pb-4">
        <Text className="font-aileron-bold text-lg">
          {facilitiesCount}
        </Text>
        <Text className="font-aileron-light ml-1 text-lg">Available Facilities</Text>
      </View>
    </View>
  ), [facilitiesCount]);

  const renderListHeader = useCallback(() => (
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
  ), []);

  return (
    <View style={{ 
      flex: 1, 
      marginTop: statusBarHeight,
      position: 'absolute',
      width: '100%',
      height: '100%'
    }}>
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
        handleStyle={{ height: HANDLE_HEIGHT }}
        style={{
          marginHorizontal: 0,
        }}
      >
        {renderHeader()}
        {renderListHeader()}
        
        <BottomSheetScrollView
          className="px-3 bg-background"
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          contentContainerStyle={{
            paddingBottom: TAB_BAR_HEIGHT,
          }}
          bounces={false}
        >
          {/* Your cards */}
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
            title="Silo Market"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
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
            title="Silo Market"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
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
            title="Silo Market"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
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
            title="Silo Market"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
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
            title="Silo Market"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
                    <Card
            title="Silo Market"
            status="Fairly Busy"
            isOpen={true}
            closingTime="00:00 XM"
            distance={0.0}
            isFavorite={false}
            onFavoritePress={() => {}}
          />
          {/* Add more cards as needed */}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default FacilityList;