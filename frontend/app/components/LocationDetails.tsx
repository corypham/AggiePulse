import React, { useMemo, useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Heart, ChevronLeft, Share2 } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { formatOpenUntil, formatTime, updateFacilityHours, isCurrentlyOpen } from '../_utils/timeUtils';
import { getStatusIcon } from '@/app/_utils/statusIcons';
import { getLocationStatus } from '@/app/_utils/locationStatus';
import type { Location } from '../types/location';
import { getAmenityIcon } from '../_utils/amenityIcons';
import { getLocationHours } from '../_utils/hoursUtils';
import LocationService from '../services/locationService';
import { CrowdForecast } from '../components/CrowdForecast';

interface LocationDetailsProps {
  location: Location;
}

export default function LocationDetails({ location }: LocationDetailsProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [scrollY] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('crowd');
  const scrollViewRef = useRef<ScrollView>(null);
  const isLocationFavorite = useMemo(() => 
    isFavorite(location.id),
    [isFavorite, location.id]
  );

  const StatusIcon = getStatusIcon(location.currentStatus);
  const statusInfo = getLocationStatus(location);

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

  const [currentHours, setCurrentHours] = useState(updateFacilityHours(location.hours));

  // Add fade animation value
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Add to your existing useEffect
  useEffect(() => {
    // Start with opacity 0
    fadeAnim.setValue(0);
    
    // Animate in with spring effect
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
      velocity: 0.5
    }).start();

    StatusBar.setBarStyle('light-content');
    setCurrentHours(updateFacilityHours(location.hours));

    const interval = setInterval(() => {
      setCurrentHours(updateFacilityHours(location.hours));
    }, 60000);

    return () => {
      StatusBar.setBarStyle('dark-content');
      clearInterval(interval);
    };
  }, [location.hours]);

  const [crowdData, setCrowdData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrowdData = async () => {
      try {
        console.log('LocationDetails: Starting to fetch crowd data for:', location.id);
        setIsLoading(true);
        const data = await LocationService.getLocationCrowdData(location.id);
        console.log('LocationDetails: Successfully fetched crowd data:', data);
        setCrowdData(data);
      } catch (error) {
        console.error('LocationDetails: Error fetching crowd data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrowdData();
  }, [location.id]);

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

  const renderHoursSection = () => {
    const facilityHours = getLocationHours(location);

    return (
      <>
        <Text className="font-aileron-bold text-2xl mb-4">Hours</Text>
        <View className="space-y-4">
          {facilityHours.map((facility, index) => (
            <View key={index} className="flex-row items-start">
              <Text 
                className={`${
                  facility.isAlwaysOpen || isCurrentlyOpen({
                    open: facility.open,
                    close: facility.close,
                    label: facility.facilityName
                  }) 
                  ? 'text-[#22C55E]' 
                  : 'text-[#EF4444]'
                } font-aileron-bold w-[72px]`}
              >
                {facility.isAlwaysOpen || isCurrentlyOpen({
                  open: facility.open,
                  close: facility.close,
                  label: facility.facilityName
                }) ? 'Open' : 'Closed'}
              </Text>
              <View className="flex-1">
                <Text className="font-aileron text-[#6B7280] text-lg">
                  {facility.facilityName}:
                </Text>
                <Text className="font-aileron text-[#6B7280] text-lg">
                  {facility.isAlwaysOpen 
                    ? '12:00 AM - 12:00 AM'
                    : `${facility.open} - ${facility.close}`
                  }
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Thin Grey Divider */}
        <View className="flex-row justify-center py-4">
          <View className="h-[1px] bg-gray-200 flex-1 mx-1" />
        </View>
      </>
    );
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
            <View className="mt-1.5">
              <location.icons.blue width={28} height={28} />
            </View>
            <View className="flex-1 pl-6">
              <Text className="font-aileron-bold text-[22px] text-black">
                {location.name}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Text className={`${statusInfo.statusClass} text-lg`}>
                  {statusInfo.statusText}
                </Text>
                <Text className="text-black font-aileron text-lg">
                  {' '}{statusInfo.timeText} • {location.distance} mi
                </Text>
              </View>
              <View className="flex-row items-center space-x-2 mt-3">
                <View className={`
                  ${location.currentStatus === 'Not Busy' ? 'bg-[#22C55E]' : 
                    location.currentStatus === 'Fairly Busy' ? 'bg-[#ff8003]' : 
                    'bg-[#EF4444]'} 
                  px-3 py-1.5 rounded-lg
                `}>
                  <Text className="text-sm font-aileron-semibold text-white">{location.currentStatus}</Text>
                </View>
                <View className="bg-[#f5f4f4] px-3 py-1.5 ml-3 rounded-lg">
                  <Text className="text-[#585555] text-sm font-aileron-semibold">
                    Best Time: {location.bestTimes.best}
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
        <View className="h-2 bg-gray-100" />

        {/* Crowd Levels Section */}
        <View ref={sectionRefs.crowd} className="mb-6">
          <View className="px-6 py-8">
            <Text className="font-aileron-bold text-2xl mb-2">Crowd Levels</Text>
            <View className="flex-row items-start pl-2">
              <View className="flex-1">
                <StatusIcon width={124} height={124} />
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
          
          <View className="h-2 bg-gray-100" />
          
          <View className="px-4 py-6">
            <Text className="font-aileron-bold text-2xl mb-4">Crowd Forecast</Text>
            
            {isLoading ? (
              <View className="h-[200] justify-center items-center">
                <Text className="font-aileron text-gray-500">Loading...</Text>
              </View>
            ) : error ? (
              <View className="h-[200] justify-center items-center">
                <Text className="font-aileron text-red-500">{error}</Text>
              </View>
            ) : crowdData ? (
              <CrowdForecast
                currentDay="Monday"
                dayData={crowdData.weeklyBusyness?.monday || []}
                currentStatus={crowdData.currentStatus}
              />
            ) : (
              <View className="h-[200] justify-center items-center">
                <Text className="font-aileron text-gray-500">No data available</Text>
              </View>
            )}
          </View>
        </View>

        {/* Grey Divider */}
        <View className="h-2 bg-gray-100" />

        {/* Best Spot Section */}
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
        </View>

        {/* Grey Divider */}
        <View className="h-2 bg-gray-100" />

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
          <View className="h-2 bg-gray-100" />
          
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
          <Text className="font-aileron-bold text-black flex-1">{location.name}</Text>
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