import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, Dimensions, Platform, StatusBar, Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Card from './Card';
import { TAB_BAR_HEIGHT } from './TabBar';

interface FacilityListProps {
  facilitiesCount: number;
}

export const FacilityList: React.FC<FacilityListProps> = ({ facilitiesCount }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: screenHeight } = Dimensions.get('window');
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  
  // Constants
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 47;
  const SEARCH_BAR_HEIGHT = 50;
  const HEADER_HEIGHT = 70;
  const DYNAMIC_ISLAND_BUFFER = Platform.OS === 'ios' ? 120 : 0;
  const BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 0;
  
  // Calculate snap points
  const snapPoints = useMemo(() => {
    const minHeight = HEADER_HEIGHT;
    const midHeight = screenHeight * 0.4;
    const maxHeight = screenHeight - SEARCH_BAR_HEIGHT - statusBarHeight! - DYNAMIC_ISLAND_BUFFER;
    return [minHeight, midHeight, maxHeight];
  }, [screenHeight, statusBarHeight]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY <= 0) {
      Animated.spring(headerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 20
      }).start();
      setHeaderVisible(true);
    } else {
      const isScrollingDown = currentScrollY > lastScrollY.current;
      
      if (isScrollingDown && headerVisible) {
        Animated.spring(headerTranslateY, {
          toValue: -HEADER_HEIGHT,
          useNativeDriver: true,
          tension: 100,
          friction: 20
        }).start(() => setHeaderVisible(false));
      } else if (!isScrollingDown && !headerVisible) {
        setHeaderVisible(true);
        Animated.spring(headerTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 20
        }).start();
      }
    }
    
    lastScrollY.current = currentScrollY;
  }, [headerVisible]);

  const renderHandle = useCallback(() => (
    <View className="bg-white pt-2 rounded-t-3xl border-b border-gray-300">
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
    <>
      {/* Persistent border */}
      <View className="absolute top-0 left-0 right-0 border-t border-gray-300 z-0" />
      
      {/* Animated header */}
      <Animated.View 
        style={[{
          transform: [{ translateY: headerTranslateY }],
          position: 'absolute',
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: '#EEF0F7', // bg-background color
        }]}
      >
        <View className="flex-row items-center justify-between py-2 px-9">
          <View className="flex-row">
            <Text className="text-2xl font-aileron-bold">List View</Text>
          </View>
          <View className="border border-gray-600 rounded-full px-4 py-2">
            <Text className="font-aileron">sort by: ▼</Text>
          </View>
        </View>
        {lastScrollY.current > 0 && (
          <View className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-300" />
        )}
      </Animated.View>
    </>
  ), [headerTranslateY]);

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
            paddingTop: HEADER_HEIGHT,
            paddingBottom: TAB_BAR_HEIGHT + BOTTOM_INSET + 20,
          }}
          bounces={true}
          scrollEnabled={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Cards */}
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