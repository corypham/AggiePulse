import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, Dimensions, Platform, StatusBar, Animated } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Card from './Card';
import { TAB_BAR_HEIGHT } from './TabBar';

interface FacilityListProps {
  facilitiesCount: number;
}

export const FacilityList: React.FC<FacilityListProps> = ({ facilitiesCount }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: screenHeight } = Dimensions.get('window');
  const scrollY = useRef(new Animated.Value(0)).current;
  const borderOpacity = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  // Use StatusBar.currentHeight for Android and fixed height for iOS
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 47;
  const SEARCH_BAR_HEIGHT = 50;
  const HEADER_HEIGHT = 70;
  const DYNAMIC_ISLAND_BUFFER = Platform.OS === 'ios' ? 120 : 0;
  const BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 0;
  
  // Calculate snap points with precise control
  const snapPoints = useMemo(() => {
    const minHeight = HEADER_HEIGHT;
    const midHeight = screenHeight * 0.4;
    const maxHeight = screenHeight - SEARCH_BAR_HEIGHT - statusBarHeight! - DYNAMIC_ISLAND_BUFFER;
    return [minHeight, midHeight, maxHeight];
  }, [screenHeight, statusBarHeight]);

  // Handle scroll events
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // The header is now part of the handle area
  const renderHandle = useCallback(() => (
    <View className="bg-white pt-2 rounded-t-3xl">
      <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
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
      <Animated.View 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#d1d5db', // gray-300
          opacity: borderOpacity
        }}
      />
      <View className="flex-row items-center justify-between py-2 px-9">
        <View className="flex-row">
          <Text className="text-2xl font-aileron-bold">List View</Text>
        </View>
        <View className="border border-gray-600 rounded-full px-4 py-2">
          <Text className="font-aileron">sort by: ▼</Text>
        </View>
      </View>
    </View>
  ), [borderOpacity]);

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
        handleComponent={renderHandle}
        backgroundStyle={{ 
          backgroundColor: 'white',
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
        }}
        handleStyle={{
          height: HEADER_HEIGHT
        }}
        style={{
          marginHorizontal: 0,
        }}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={false}
        bottomInset={BOTTOM_INSET}
      >
        {renderListHeader()}
        
        <BottomSheetScrollView
          className="px-3 bg-background"
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          contentContainerStyle={{
            paddingBottom: TAB_BAR_HEIGHT + BOTTOM_INSET + 20,
          }}
          bounces={true}
          scrollEnabled={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Your cards */}
          {Array(facilitiesCount).fill(null).map((_, index) => (
            <Card
              key={index}
              title="Silo Market"
              status="Fairly Busy"
              isOpen={true}
              closingTime="00:00 XM"
              distance={0.0}
              isFavorite={false}
              onFavoritePress={() => {}}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default FacilityList;