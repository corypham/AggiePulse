import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, Dimensions, Platform, StatusBar, Animated, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, Image } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Card from './Card';
import { TAB_BAR_HEIGHT } from './TabBar';
import { useFavorites } from '../context/FavoritesContext';
import type { Location as LocationType } from '../types/location';
import { mockLocations } from '../data/mockLocations';
import { NavVectorSelected, NavVectorUnselected } from '../../assets';

interface FacilityListProps {
  facilitiesCount: number;
  onLocationPress?: (location: { latitude: number; longitude: number }) => void;
  isMapCentered?: boolean;
}

export const FacilityList: React.FC<FacilityListProps> = ({ 
  facilitiesCount,
  onLocationPress,
  isMapCentered = false
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: screenHeight } = Dimensions.get('window');
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNavButton, setShowNavButton] = useState(true);
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const buttonTranslateY = useRef(new Animated.Value(0)).current;
  const lastPosition = useRef(0);
  
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

  const handleLocationPress = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      onLocationPress?.({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }, [onLocationPress]);
  
  // Calculate snap points
  const snapPoints = useMemo(() => {
    const minHeight = HANDLE_HEIGHT;
    const midHeight = screenHeight * 0.4;
    const maxHeight = screenHeight - (statusBarHeight || 0) - DYNAMIC_ISLAND_BUFFER;
    return [minHeight, midHeight, maxHeight];
  }, [screenHeight, statusBarHeight]);

  const handleSheetChange = useCallback((index: number) => {
    setCurrentIndex(index);
    
    // Hide button when past midpoint (index > 1)
    if (index > 1) {
      Animated.spring(buttonOpacity, {
        toValue: 0,
        useNativeDriver: true,
        tension: 500,
        friction: 10,
        velocity: 4,
      }).start(() => setShowNavButton(false));
    } else {
      setShowNavButton(true);
      Animated.spring(buttonOpacity, {
        toValue: 1,
        useNativeDriver: true,
        tension: 500,
        friction: 10,
        velocity: 4,
      }).start();
    }
  }, [buttonOpacity]);

  const handleSheetAnimate = useCallback((fromIndex: number, toIndex: number) => {
    // Hide button immediately when moving past midpoint
    if (toIndex > 1) {
      Animated.spring(buttonOpacity, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 5,
        velocity: 2,
      }).start(() => setShowNavButton(false));
    }
    // Show button only when moving to positions below midpoint
    else if (toIndex <= 1) {
      setShowNavButton(true);
      Animated.spring(buttonOpacity, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 5,
        velocity: 2,
      }).start();
    }
  }, [buttonOpacity]);

  const handleSheetPosition = useCallback((position: number) => {
    lastPosition.current = position;
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
  }, [headerVisible, headerTranslateY]);

  const renderHandle = useCallback(() => (
    <>
      {showNavButton && currentIndex <= 1 && (
        <Animated.View 
          pointerEvents={currentIndex <= 1 ? "auto" : "none"}
          style={{
            position: 'absolute',
            right: 16,
            top: -60,
            opacity: buttonOpacity,
            zIndex: 1000,
          }}
        >
          <TouchableOpacity 
            onPress={handleLocationPress}
            style={{
              backgroundColor: 'white',
              borderRadius: 30,
              width: 44,
              height: 44,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {isMapCentered ? (
              <NavVectorSelected width={24} height={24} />
            ) : (
              <NavVectorUnselected width={24} height={24} />
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
      <View className="bg-white pt-2 rounded-t-3xl border-b border-gray-300">
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        <View className="flex-row items-center justify-center pb-4">
          <Text className="font-aileron-bold text-lg">
            {Math.min(mockLocations.length, facilitiesCount)}
          </Text>
          <Text className="font-aileron-light ml-1 text-lg">Available Facilities</Text>
        </View>
      </View>
    </>
  ), [facilitiesCount, showNavButton, buttonOpacity, currentIndex, handleLocationPress, isMapCentered]);

  const renderListHeader = useCallback(() => (
    <>
      <View className="absolute top-0 left-0 right-0 border-t border-gray-300 z-0" />
      
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
          <View className="border border-gray-600 rounded-full px-4 py-2 bg-white">
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
          height: HANDLE_HEIGHT
        }}
        style={{
          marginHorizontal: 0,
        }}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={false}
        bottomInset={0}
        onChange={handleSheetChange}
        onAnimate={handleSheetAnimate}
        animateOnMount={false}
        handlePosition={handleSheetPosition}
      >
        {renderListHeader()}
        
        <BottomSheetScrollView
          className="px-3 bg-background"
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          contentContainerStyle={{
            paddingTop: LIST_HEADER_HEIGHT + LIST_HEADER_PADDING,
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
          {mockLocations.slice(0, facilitiesCount).map((location) => (
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