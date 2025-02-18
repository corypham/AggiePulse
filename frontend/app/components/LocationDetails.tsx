import React, { useMemo, useEffect, useState, useRef, useCallback, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Heart, ChevronLeft, Share2 } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useLocations } from '../context/LocationContext';
import {  getLocationHours, isLocationOpen, formatTimeRangeWithMeridiem, calculateBestWorstTimes, getCurrentDay } from '../_utils/timeUtils';
import { getStatusIcon } from '@/app/_utils/statusIcons';
import type { Location } from '../types/location';
import { getAmenityIcon } from '../_utils/amenityIcons';
import LocationService from '../services/locationService';
import CrowdForecast  from '../components/CrowdForecast';
import EventEmitter from '../_utils/EventEmitter';


// Helper function to get location status
const getLocationStatus = (location: Location) => {
  const percentage = (location.currentCapacity / location.maxCapacity) * 100;
  
  if (percentage >= 75) {
    return {
      statusTextClass: 'text-red-600',
      backgroundClass: 'bg-red-100',
      text: 'Very Busy'
    };
  } else if (percentage >= 40) {
    return {
      statusTextClass: 'text-yellow-600',
      backgroundClass: 'bg-yellow-100',
      text: 'Fairly Busy'
    };
  } else {
    return {
      statusTextClass: 'text-green-600',
      backgroundClass: 'bg-green-100',
      text: 'Not Busy'
    };
  }
};

interface LocationDetailsProps {
  location: Location;
}

export default function LocationDetails({ location: initialLocation }: { location: Location }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getLocation, lastUpdate } = useLocations();
  const [scrollY] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('crowd');
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Get real-time location data from context
  const location = useMemo(() => 
    getLocation(initialLocation.id) || initialLocation,
    [getLocation, initialLocation.id, lastUpdate]
  );

  const handleFavorite = useCallback((e?: any) => {
    if (e) e.stopPropagation();
    toggleFavorite(location.id);
    // Add small delay to ensure state is updated
    setTimeout(() => {
    }, 0);
  }, [location.id, toggleFavorite]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const statusInfo = useMemo(() => 
    getLocationStatus(location),
    [location.currentCapacity, location.maxCapacity, lastUpdate]
  );

  const headerHeight = 264; // Height of your header image
  const tabBarHeight = 48; // Height of the tab bar
  
  // Create opacity animation for the header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight - 120, headerHeight - 60],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  // Create transform animation for the header
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight - 60, headerHeight],
    outputRange: [-120, -120, 0],
    extrapolate: 'clamp',
  });

  // Create opacity animation for the main tab bar
  const mainTabOpacity = scrollY.interpolate({
    inputRange: [headerHeight - 120, headerHeight - 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const sectionRefs = {
    crowd: useRef<View>(null),
    details: useRef<View>(null),
    discussion: useRef<View>(null),
  };

  const scrollToSection = (sectionName: string) => {
    setActiveTab(sectionName);
    const yOffset = 120; // Height of the sticky header
    sectionRefs[sectionName as keyof typeof sectionRefs].current?.measureInWindow((x: number, y: number) => {
      const scrollView = scrollViewRef.current;
      if (scrollView) {
        scrollView.scrollTo({ y: y - yOffset, animated: true });
      }
    });
  };

  const renderHoursSection = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    
    return (
      <>
        <Text className="font-aileron-bold text-2xl mb-4">Hours</Text>
        <View className="space-y-4">
          {days.map((day, index) => {
            const dayHours = location.hours?.[day];
            const isToday = day === today;
            
            return (
              <View key={index} className="flex-row items-start pl-2">
                <Text 
                  className={`w-[72px] ${
                    isToday ? 'font-aileron-heavy' : 'font-aileron text-[#6B7280]'
                  }`}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                </Text>
                <View className="flex-1">
                  <Text className={`text-[#6B7280] text-lg ${
                    isToday ? 'font-aileron-heavy text-black' : 'font-aileron'
                  }`}>
                    {dayHours?.open === 'Closed' 
                      ? 'Closed'
                      : dayHours?.open && dayHours?.close
                        ? `${dayHours.open} - ${dayHours.close}`
                        : 'Hours unavailable'
                    }
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </>
    );
  };

  // Get hours data using the new utilities
  const { nextOpenDay, openTime, closeTime } = useMemo(() => 
    getLocationHours(location),
    [location.hours, lastUpdate]
  );

  // Check if location is currently open based on busyness data
  const isOpen = useMemo(() => {
    const currentHour = new Date().getHours();
    const currentData = location.dayData?.find(data => {
      const hour = parseInt(data.time.split(' ')[0]);
      const isPM = data.time.includes('PM');
      return (isPM ? hour + 12 : hour) === currentHour;
    });

    return currentData && typeof currentData.busyness === 'number' && currentData.busyness > 0;
  }, [location.dayData, lastUpdate]);

  // Get status text
  const statusText = useMemo(() => {
    // If location is open but hours are unavailable
    if (isOpen && (!location.hours || !location.hours[getCurrentDay()])) {
      return 'Hours unavailable';
    }
    
    // If location is closed and we have next opening time, show it regardless of hours availability
    if (!isOpen && openTime) {
      return `until ${openTime}${nextOpenDay ? ` ${nextOpenDay}` : ''}`;
    }
    
    // If location is open and we have closing time
    if (isOpen && closeTime) {
      return `until ${closeTime}`;
    }

    // Fallback case
    return 'Hours unavailable';
  }, [location.hours, isOpen, closeTime, openTime, nextOpenDay]);

  // Add fade animation value
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    fadeAnim.setValue(0);
    
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
      velocity: 0.5
    }).start();

    StatusBar.setBarStyle('dark-content');

    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, [location]);

  const renderAmenitySection = (title: string, amenities: string[]) => (
    <View className="my-2">
      <Text className="font-aileron-bold text-xl mb-4">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {amenities.map((amenity, index) => {
          const amenityIcon = getAmenityIcon(amenity);
          if (!amenityIcon) return null;
          
          const Icon = amenityIcon.icon;
          return (
            <View key={index} className="flex-row items-center bg-gray-100 px-2 py-1 rounded-lg">
              <Icon width={14} height={14} />
              <Text className="font-aileron text-gray-700 ml-1">{amenityIcon.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayHours = location.hours?.[today];

  // Safely handle hours display
  const getHoursDisplay = () => {
    if (!todayHours?.open || !todayHours?.close) {
      return 'Hours unavailable';
    }
    return `${todayHours.open} - ${todayHours.close}`;
  };

  // Remove the separate crowdData state and fetch
  // All data should now come from the location object
  const { bestTime, worstTime } = useMemo(() => 
    calculateBestWorstTimes(location.weeklyBusyness?.[today] ?? []),
    [location.weeklyBusyness, today]
  );

  // Remove the useEffect that was fetching crowd data
  
  // Get seating description based on status
  const getSeatingDescription = (status: string) => {
    switch (status) {
      case 'Very Busy':
        return 'Limited seating available';
      case 'Fairly Busy':
        return 'Generally moderate seating available';
      case 'Not Busy':
        return 'A lot of seating available';
      default:
        return 'Seating availability unknown';
    }
  };

  // Get current status using existing helper
  const currentStatus = useMemo(() => 
    getLocationStatus(location).text,
    [location.currentCapacity, location.maxCapacity, lastUpdate]
  );

  // Get status color based on current status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Busy':
        return 'bg-[#0fbc43]';
      case 'A Bit Busy':
      case 'Fairly Busy':
        return 'bg-[#ff8003]';
      case 'Very Busy':
      case 'Extremely Busy':
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#0fbc43]'; // Default to green for closed/not busy
    }
  };

  // Get current busyness percentage
  const getCurrentBusyness = () => {
    const currentHour = new Date().getHours();
    const currentData = location.dayData?.find(data => {
      const hour = parseInt(data.time.split(' ')[0]);
      const isPM = data.time.includes('PM');
      return (isPM ? hour + 12 : hour) === currentHour;
    });

    return currentData && typeof currentData.busyness === 'number' 
      ? currentData.busyness 
      : 0;
  };

  // Calculate approximate number of people
  const getApproximatePeople = () => {
    const percentage = getCurrentBusyness();
    const maxCapacity = location.maxCapacity || 0;
    return Math.round((percentage / 100) * maxCapacity);
  };

  // Get status icon for crowd levels section
  const StatusIcon = useMemo(() => 
    getStatusIcon(location),
    [location, lastUpdate]
  );

  // Get blue icon for title section
  const TitleIcon = location.icons?.blue || null;

  // Special handling for library real-time occupancy
  const isLibrary = location.id === 'library';
  const realTimeOccupancy = location.currentStatus?.realTimeOccupancy;
  
  // Add state for real-time data
  const [refreshKey, setRefreshKey] = useState(0);

  // Add refresh effect
  useEffect(() => {
    console.log('Current location data:', {
      isLibrary: location.id === 'library',
      realTimeOccupancy: location.currentStatus?.realTimeOccupancy,
      mainBuilding: location.currentStatus?.realTimeOccupancy?.mainBuilding
    });

  }, [location]);

  const getOccupancyDisplay = () => {
    // Debug log
    console.log('getOccupancyDisplay called:', {
      isLibrary: isLibrary,
      realTimeOccupancy: realTimeOccupancy,
      mainBuilding: realTimeOccupancy?.mainBuilding
    });

    if (isLibrary && realTimeOccupancy?.mainBuilding) {
      const mainBuilding = realTimeOccupancy.mainBuilding;
      
      // Debug log
      console.log('Library main building data:', mainBuilding);
      
      if (typeof mainBuilding.count === 'number' && 
          typeof mainBuilding.capacity === 'number' && 
          typeof mainBuilding.percentage === 'number') {
        return {
          count: `${mainBuilding.count}/${mainBuilding.capacity}`,
          percentage: mainBuilding.percentage,
          statusText: getBusyStatusText(mainBuilding.percentage),
          approximatePeople: `Approximately ${mainBuilding.count}/${mainBuilding.capacity} people`
        };
      }
    }
    
    // Fallback to original implementation for library or default for other locations
    const currentValue = typeof location.currentCapacity === 'number' 
      ? location.currentCapacity 
      : 0;
      
    const maxValue = typeof location.maxCapacity === 'number' 
      ? location.maxCapacity 
      : 100;
      
    const percentageValue = Math.round((currentValue / maxValue) * 100);

    return {
      count: `${currentValue}/${maxValue}`,
      percentage: percentageValue,
      statusText: location.currentStatus?.statusText || 'Unknown',
      approximatePeople: `Approximately ${currentValue}/${maxValue} people`
    };
  };

  const occupancyInfo = getOccupancyDisplay();

  return (
    <Animated.View 
      className="flex-1 bg-white"
      style={{
        opacity: fadeAnim,
        transform: [{
          scale: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1]
          })
        }]
      }}
    >
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <Animated.ScrollView
        className="flex-1 bg-white"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        {/* Header Image & Navigation */}
        <View className="relative h-64">
          <Image
            source={location.imageUrl}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute top-14 w-full px-4 flex-row justify-between items-center z-50">
            <TouchableOpacity 
              onPress={handleBack}
              className="bg-white/90 p-2 rounded-full"
            >
              <ChevronLeft size={24} color="#535353" />
            </TouchableOpacity>
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                onPress={handleFavorite}
                className="bg-white/90 p-2 rounded-full"
              >
                <Heart 
                  size={24} 
                  color={isFavorite(location.id) ? "#EF4444" : "#535353"}
                  fill={isFavorite(location.id) ? "#EF4444": "transparent"}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/90 p-2 rounded-full ml-4">
                <Share2 size={24} color="#535353" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Title Section with Icon */}
        <View className="px-5 pt-5 bg-white -mt-5 rounded-t-3xl">
          <View className="flex-row items-start p-4 space-x-3">
            {TitleIcon && (
              <View className="mt-1.5">
                <TitleIcon width={32} height={32} />
              </View>
            )}
            <View className="flex-1 pl-6">
              <Text className="font-aileron-bold text-[22px] text-black">
                {location.title}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Text 
                  className={`text-lg font-aileron-bold ${
                    isOpen ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isOpen ? 'Open' : 'Closed'}
                </Text>
                <Text className="text-lg font-aileron ml-1">
                  {statusText}
                </Text>
              </View>
              <View className="flex-row items-center space-x-2 mt-3">
                <View className={`
                  ${getStatusColor(currentStatus)}
                  px-3 py-1.5 rounded-lg
                `}>
                  <Text className="text-sm font-aileron-semibold text-white">
                    {currentStatus}
                  </Text>
                </View>
                <View className="bg-[#f5f4f4] px-3 py-1.5 ml-3 rounded-lg">
                  <Text className="text-[#585555] text-sm font-aileron-semibold">
                    {`Best Time: ${bestTime.replace(/(\d+)(a|p) - (\d+)(a|p)/, '$1$2m - $3$4m')}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Grey Divider */}
        <View className="flex-row justify-center py-2">
          <View className="h-[2px] bg-gray-200 flex-1 mx-12" />
        </View>

        {/* Main Tab Navigation - will fade out as header appears */}
        <Animated.View 
          className="bg-white border-b border-gray-100"
          style={{
            opacity: mainTabOpacity,
            transform: [{ 
              translateY: scrollY.interpolate({
                inputRange: [0, headerHeight],
                outputRange: [0, -tabBarHeight],
                extrapolate: 'clamp',
              })
            }],
          }}
        >
          <View className="flex-row justify-center px-12">
            {['crowd', 'details', 'discussion'].map((tab) => (
              <TouchableOpacity 
                key={tab}
                className="py-3 px-4 relative"
                onPress={() => scrollToSection(tab)}
              >
                <Text className={`font-aileron ${activeTab === tab ? 'font-aileron-bold' : ''} text-black text-base`}>
                  {tab === 'crowd' ? 'Crowd Info' : 
                   tab === 'details' ? 'Details' : 
                   'Discussion'}
                </Text>
                {activeTab === tab && (
                  <View className="absolute bottom-0 left-4 right-4 h-[3px] bg-primary rounded-full" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Grey Divider */}
        <View className="h-3 bg-gray-100" />

        {/* Crowd Levels Section */}
        <View ref={sectionRefs.crowd} className="mb-6">
          <View className="px-6 py-8">
            <Text className="font-aileron-bold text-2xl mb-2">Crowd Levels</Text>
            <View className="flex-row items-start pl-2">
              <View className="flex-1">
                <View style={{ width: 124, height: 124 }} className="mr-3">
                  <StatusIcon width="100%" height="100%" />
                </View>
              </View>
              <View className="flex-1">
                <View>
                  {/* Overall status with background */}
                  <View className={`${getStatusColor(occupancyInfo.statusText)} p-3 rounded-xl items-center`}>
                    <Text className="font-aileron-bold text-lg text-white">
                      Overall: {occupancyInfo.percentage}% full
                    </Text>
                  </View>
                  {/* Bullet points outside the background */}
                  <View className="pl-2 pt-2 space-y-1">
                    <View className="flex-row items-start">
                      <Text className="text-[#6B7280] w-2">•</Text>
                      <Text className="font-aileron text-sm text-[#6B7280] flex-1 pl-2">
                        {occupancyInfo.approximatePeople}
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-[#6B7280] w-2">•</Text>
                      <Text className="font-aileron text-sm text-[#6B7280] flex-1 pl-2">
                        {getSeatingDescription(occupancyInfo.statusText)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          <View className="h-3 bg-gray-100" />
          
          <View className="">
              <Text className="text-white text-center text-lg">
                {occupancyInfo.statusText}
              </Text>
            </View>
            
            <CrowdForecast
              location={location}
              currentDay={new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              dayData={location.weeklyBusyness?.[today] ?? []}
            />
          </View>

        {/* Grey Divider */}
        <View className="h-3 bg-gray-100" />


        {/* Grey Divider
        <View className="h-2 bg-gray-100" /> */}

        {/* Details Section */}
        <View ref={sectionRefs.details} className="mb-6">
          <View className="" />
          
          <View className="px-4 pt-4">
            <Text className="font-aileron-bold text-2xl mb-3">Details</Text>
            <Text className="font-aileron text-gray-600 leading-5">
              {location.description}
            </Text>

            {/* Thin Grey Divider */}
            <View className="flex-row justify-center py-4">
              <View className="h-[1px] bg-gray-200 flex-1 mx-1" />
            </View>
            
            {renderHoursSection()}

            {/* Thin Grey Divider */}
            <View className="flex-row justify-center py-4">
              <View className="h-[1px] bg-gray-200 flex-1 mx-1" />
            </View>
            
            {renderAmenitySection('Amenities', location.amenities.general)}

            {/* Thin Grey Divider */}
            <View className="flex-row justify-center py-4">
              <View className="h-[1px] bg-gray-200 flex-1 mx-1" />
            </View>
            
            {renderAmenitySection('Atmosphere', location.amenities.atmosphere)}

            {/* Thin Grey Divider */}
            <View className="flex-row justify-center py-4">
              <View className="h-[1px] bg-gray-200 flex-1 mx-1" />
            </View>
            
            {renderAmenitySection('Accessibility', location.amenities.accessibility)}
          </View>
        </View>

        {/* Discussion Section */}
        <View ref={sectionRefs.discussion} className="mb-6">
          <View className="h-3 bg-gray-100" />
          
          <View className="px-4 py-4">
            <Text className="font-aileron-bold text-xl mb-4">Discussions</Text>
            <Text className="font-aileron text-gray-500 mb-4">3,000 discussions</Text>
            
            {/* Discussion Posts */}
            <View className="space-y-4">
              <View className="bg-[#f3f3f3] rounded-xl p-4 border border-gray-200 ">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-aileron-bold">Bathroom Shutdown on First Floor</Text>
                  <Text className="font-aileron text-gray-500">Today</Text>
                </View>
                <Text className="font-aileron text-black mb-2">
                  So for some reason the bathroom on the first floor was shutdown. It could be because someone who was super sus dude walked in and the authorities showed...
                </Text>
                <View className="flex-row items-center">
                  <Text className="font-aileron text-gray-500">iamAUCDstudent</Text>
                  <Text className="font-aileron text-gray-400 mx-2">•</Text>
                  <Text className="font-aileron text-gray-500">200 likes</Text>
                </View>
              </View>

              <View className="bg-[#f3f3f3] rounded-xl p-4 border border-gray-200 mt-2">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-aileron-bold">Therapy Pets!</Text>
                  <Text className="font-aileron text-gray-500">2 days ago</Text>
                </View>
                <Text className="font-aileron text-black mb-2">
                  The therapy pets are back! they're currently at the in the courtyard so don't miss out!!!
                </Text>
                <View className="flex-row items-center">
                  <Text className="font-aileron text-gray-500">emmungee</Text>
                  <Text className="font-aileron text-gray-400 mx-2">•</Text>
                  <Text className="font-aileron text-gray-500">40 likes</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Header with Animated Tab Bar */}
      <Animated.View 
        className="absolute top-0 left-0 right-0 bg-white shadow-sm"
        style={{
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslate }],
          zIndex: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        {/* Header Content */}
        <View className="flex-row px-4 pt-14 pb-2 items-center">
          <TouchableOpacity 
            onPress={handleBack}
            className="mr-3"
          >
            <ChevronLeft size={24} color="#535353" />
          </TouchableOpacity>
          <Text className="font-aileron-bold text-black flex-1">{location.title}</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity onPress={handleFavorite}>
              <Heart 
                size={24} 
                color={isFavorite(location.id) ? "#EF4444" : "#535353"}
                fill={isFavorite(location.id) ? "#EF4444": "transparent"}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity className="ml-4">
              <Share2 size={24} color="#535353" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grey Divider */}
        <View className="flex-row justify-center py-2">
          <View className="h-[1px] bg-gray-200 flex-1 mx-8" />
        </View>
        
        {/* Header Tab Navigation */}
        <View className="">
          <View className="flex-row justify-center px-12">
            {['crowd', 'details', 'discussion'].map((tab) => (
              <TouchableOpacity 
                key={tab}
                className="py-3 px-4 relative"
                onPress={() => scrollToSection(tab)}
              >
                <Text className={`font-aileron ${activeTab === tab ? 'font-aileron-bold' : ''} text-black text-base`}>
                  {tab === 'crowd' ? 'Crowd Info' : 
                    tab === 'details' ? 'Details' : 
                    'Discussion'}
                </Text>
                {activeTab === tab && (
                  <View className="absolute bottom-0 left-4 right-4 h-[3px] bg-primary rounded-full" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
} 

// Helper function to determine busy status
function getBusyStatusText(percentage: number): string {
  if (percentage >= 85) return 'Very Busy';
  if (percentage >= 65) return 'Busy';
  if (percentage >= 40) return 'Fairly Busy';
  if (percentage >= 20) return 'Not Too Busy';
  return 'Not Busy';
}