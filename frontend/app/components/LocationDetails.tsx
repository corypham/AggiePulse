import React, { useMemo, useEffect, useState, useRef, useCallback, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Heart, ChevronLeft, Share2 } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useLocations } from '../context/LocationContext';
import {  getLocationHours, isLocationOpen, formatTimeRangeWithMeridiem, calculateBestWorstTimes } from '../_utils/timeUtils';
import { getStatusIcon } from '@/app/_utils/statusIcons';
import type { Location } from '../types/location';
import { getAmenityIcon } from '../_utils/amenityIcons';
import LocationService from '../services/locationService';
import CrowdForecast  from '../components/CrowdForecast';


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
  const { getLocation, lastUpdate } = useLocations();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const [scrollY] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('crowd');
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Get real-time location data from context
  const location = useMemo(() => 
    getLocation(initialLocation.id) || initialLocation,
    [getLocation, initialLocation.id, lastUpdate]
  );

  const isLocationFavorite = useMemo(() => 
    isFavorite(location.id),
    [isFavorite, location.id]
  );

  const statusInfo = useMemo(() => 
    getLocationStatus(location),
    [location.currentCapacity, location.maxCapacity, lastUpdate]
  );
  const StatusIcon = location.icons?.blue || null;

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

  const handleFavorite = () => {
    toggleFavorite(location.id);
  };

  const handleBack = () => {
    router.back();
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

  // Check if location is currently open
  const isOpen = useMemo(() => 
    isLocationOpen(location),
    [location.hours, lastUpdate]
  );

  // Get status text
  const statusText = useMemo(() => {
    if (!location.hours) return 'Hours unavailable';

    if (isOpen) {
      return `until ${closeTime}`;
    }
    
    return `until ${openTime}${nextOpenDay ? ` ${nextOpenDay}` : ''}`;
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

  // Get current status text
  const getCurrentStatus = () => {
    if (!isOpen) return 'Not Busy';
    return location.currentStatus || 'Not Busy';
  };

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
          <View className="absolute top-14 w-full px-4 flex-row justify-between items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
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
                  color={isLocationFavorite ? "#EF4444" : "#535353"}
                  fill={isLocationFavorite ? "#EF4444": "transparent"}
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
            {StatusIcon && (
              <View className="mt-1.5">
                <StatusIcon width={28} height={28} />
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
                  ${getStatusColor(getCurrentStatus())}
                  px-3 py-1.5 rounded-lg
                `}>
                  <Text className="text-sm font-aileron-semibold text-white">
                    {getCurrentStatus()}
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
                {/* Use StatusIcon from getStatusIcon utility */}
                {(() => {
                  const StatusIcon = getStatusIcon(location.currentStatus);
                  return StatusIcon ? <StatusIcon width={124} height={124} /> : null;
                })()}
              </View>
              <View className="flex-1">
                <View className="">
                  {/* Overall status with background */}
                  <View className={`${statusInfo.backgroundClass} p-3 rounded-xl items-center`}>
                    <Text className="font-aileron-bold text-lg">
                      Overall: <Text className={`${statusInfo.statusTextClass}`}>
                        {Math.round((location.currentCapacity / location.maxCapacity) * 100)}% full
                      </Text>
                    </Text>
                  </View>
                  {/* Bullet points outside the background */}
                  <View className="pl-2 pt-2 space-y-1">
                    <View className="flex-row items-start">
                      <Text className="text-[#6B7280] w-2">•</Text>
                      <Text className="font-aileron text-sm text-[#6B7280] flex-1 pl-2">
                        {location.currentCapacity}/{location.maxCapacity} of full capacity
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-[#6B7280] w-2">•</Text>
                      <Text className="font-aileron text-sm text-[#6B7280] flex-1 pl-2">
                        Generally moderate seating available
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
                {getCurrentStatus()}
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

        {/* Best Spot Section
        <View className="px-4 py-4">
          <Text className="font-aileron-bold text-xl mb-4">Best Spot: Main Library</Text>
          {location.subLocations.map((subLocation, index) => (
            <View 
              key={index}
              className="bg-[#F6F6F6] p-4 rounded-xl mb-2"
            >
              <View className="flex-row items-center space-x-2">
                <View className={`w-2 h-2 rounded-full ${
                  subLocation.status === 'Not Busy' ? 'bg-[#22C55E]' : 
                  subLocation.status === 'Fairly Busy' ? 'bg-[#F3A952]' : 'bg-[#EF4444]'
                }`} />
                <View className="ml-2">
                  <Text className="font-aileron-bold text-black">{subLocation.name}</Text>
                </View>

              </View>
            </View>
          ))}
        </View> */}

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

            {/* Plan Your Visit Section */}
            <Text className="font-aileron-bold text-2xl mb-4">Plan Your Visit!</Text>
            <View className="bg-gray-100 p-4 rounded-xl flex-row justify-between">
              <View>
                <Text className="text-[#22C55E] font-aileron">Best time: {location.bestTimes.best}</Text>
              </View>
              <View>
                <Text className="text-[#EF4444] font-aileron">Worst time: {location.bestTimes.worst}</Text>
              </View>
            </View>
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
                color={isLocationFavorite ? "#EF4444" : "#535353"}
                fill={isLocationFavorite ? "#EF4444": "transparent"}
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