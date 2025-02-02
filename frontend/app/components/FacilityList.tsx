import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, Dimensions, Platform, StatusBar, Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Card from './Card';
import { TAB_BAR_HEIGHT } from './TabBar';
import { useFavorites } from '../context/FavoritesContext';
import type { Location } from '../types/location';

interface FacilityListProps {
  facilitiesCount: number;
}

// Sample data - Replace this with your actual data fetching logic
const SAMPLE_LOCATIONS: Location[] = [
  {
    id: 'silo-market',
    title: 'Silo Market',
    currentStatus: 'Fairly Busy',
    isOpen: true,
    closingTime: '10:00 PM',
    distance: 0.2
  },
  {
    id: 'arc',
    title: 'Activities and Recreation Center',
    currentStatus: 'Very Busy',
    isOpen: true,
    closingTime: '11:00 PM',
    distance: 0.5
  },
  {
    id: 'mu',
    title: 'Memorial Union',
    currentStatus: 'Not Busy',
    isOpen: true,
    closingTime: '11:00 PM',
    distance: 0.5
  },
  {
    id: 'library',
    title: 'Peter J. Shields Library',
    currentStatus: 'Fairly Busy',
    isOpen: true,
    closingTime: '11:00 PM',
    distance: 0.5
  }
];

export const FacilityList: React.FC<FacilityListProps> = ({ facilitiesCount }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: screenHeight } = Dimensions.get('window');
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Track scroll direction and distance
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const scrollStartPosition = useRef(0);
  
  // Constants
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 47;
  const SEARCH_BAR_HEIGHT = 50;
  const HANDLE_HEIGHT = 105;
  const LIST_HEADER_HEIGHT = 60;
  const LIST_HEADER_PADDING = 3;
  const DYNAMIC_ISLAND_BUFFER = Platform.OS === 'ios' ? 48 : 0;
  const BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 0;
  const SCROLL_THRESHOLD = 70;
  
  const { favorites, toggleFavorite } = useFavorites();
  
  // Calculate snap points
  const snapPoints = useMemo(() => {
    const minHeight = HANDLE_HEIGHT;
    const midHeight = screenHeight * 0.4;
    const maxHeight = screenHeight - (statusBarHeight || 0) - DYNAMIC_ISLAND_BUFFER;
    return [minHeight, midHeight, maxHeight];
  }, [screenHeight, statusBarHeight]);

  const handleSheetChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Calculate bottom padding based on current snap point
  const getBottomPadding = useCallback(() => {
    // Add extra padding only at mid-height (index 1)
    const extraPadding = currentIndex === 1 ? screenHeight * 0.45 : 0;
    return TAB_BAR_HEIGHT + BOTTOM_INSET + extraPadding;
  }, [currentIndex, screenHeight]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    // Reset at the top of the list
    if (currentScrollY <= 0) {
      scrollDirection.current = null;
      scrollStartPosition.current = 0;
      Animated.spring(headerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 20
      }).start();
      setHeaderVisible(true);
      return;
    }

    const isScrollingDown = currentScrollY > lastScrollY.current;
    
    // Detect direction change
    if (isScrollingDown && scrollDirection.current !== 'down') {
      scrollDirection.current = 'down';
      scrollStartPosition.current = currentScrollY;
    } else if (!isScrollingDown && scrollDirection.current !== 'up') {
      scrollDirection.current = 'up';
      scrollStartPosition.current = currentScrollY;
    }

    // Calculate distance scrolled in current direction
    const distanceScrolled = Math.abs(currentScrollY - scrollStartPosition.current);

    if (distanceScrolled > SCROLL_THRESHOLD) {
      if (isScrollingDown && headerVisible) {
        // Hide header
        Animated.spring(headerTranslateY, {
          toValue: -LIST_HEADER_HEIGHT,
          useNativeDriver: true,
          tension: 100,
          friction: 20
        }).start(() => setHeaderVisible(false));
      } else if (!isScrollingDown && !headerVisible) {
        // Show header
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
          backgroundColor: '#EEF0F7',
          paddingBottom: LIST_HEADER_PADDING,
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
          height: HANDLE_HEIGHT // Use the taller handle height
        }}
        style={{
          marginHorizontal: 0,
        }}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={false}
        bottomInset={0}
        onChange={handleSheetChange}
      >
        {renderListHeader()}
        
        <BottomSheetScrollView
          className="px-3 bg-background"
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          contentContainerStyle={{
            paddingTop: LIST_HEADER_HEIGHT + LIST_HEADER_PADDING, // Use the shorter list header height
            paddingBottom: getBottomPadding(),
          }}
          bounces={true}
          scrollEnabled={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ 
            flex: 1,
          }}
        >
          {/* Cards */}
          {SAMPLE_LOCATIONS.slice(0, facilitiesCount).map((location) => (
            <Card
              key={location.id}
              location={location}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default FacilityList;