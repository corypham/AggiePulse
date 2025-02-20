import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryContainer } from 'victory-native';
import type { Location } from '../types/location';
import LocationService from '../services/locationService';
import { calculateBestWorstTimes, parseTimeString } from '../_utils/timeUtils';
import { useLocations } from '../hooks/useLocations';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CrowdForecastProps {
  location: Location;
  currentDay: string;
  dayData: Array<{
    time: string;
    busyness: number;
    description: string;
  }>;
}

export default function CrowdForecast({ location, currentDay, dayData }: CrowdForecastProps) {
  const { locations, lastUpdate } = useLocations();
  const [selectedBar, setSelectedBar] = useState<{
    hour: number;
    busyness: number;
    description: string;
    x: number;
    y: number;
  } | null>(null);

  const currentLocation = useMemo(() => {
    return locations.find(loc => loc.id === location.id) || location;
  }, [locations, location.id]);

  // Get current hour's data using parseTimeString
  const currentHourData = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinutes;

    
    const found = dayData?.find(data => {
      const timeMinutes = parseTimeString(data.time);
      const nextHourMinutes = timeMinutes + 60;
      
      
      return currentTimeMinutes >= timeMinutes && currentTimeMinutes < nextHourMinutes;
    });

    return found;
  }, [dayData]);

  // Create forecast data with current hour's description
  const forecast = useMemo(() => {
    return {
      statusText: currentHourData?.description || 'Not Available',
      currentCapacity: currentLocation.currentStatus?.currentCapacity || 0,
      description: currentLocation.currentStatus?.description || '',
      untilText: currentLocation.currentStatus?.untilText || ''
    };
  }, [currentLocation, currentHourData]);

  // Log the data being used for best/worst calculations
  const { bestTime, worstTime } = useMemo(() => {
    return calculateBestWorstTimes(dayData);
  }, [dayData]);


  const screenWidth = Dimensions.get('window').width;
  
  // Generate 24-hour data if none exists
  const fullDayData = dayData.length > 0 ? dayData : Array.from({ length: 24 }, (_, i) => ({
    time: `${i} ${i < 12 ? 'AM' : 'PM'}`,
    busyness: 0,
    description: ''
  }));
  
  // Get current hour for highlighting
  const currentHour = new Date().getHours();


  
  // Create a standardized time scale
  const standardTicks = [4, 8, 12, 16, 20, 24]; // 4AM to 12AM (24)
  
  // Convert time string to hour number (e.g., "9 AM" -> 9, "2 PM" -> 14)
  const getHourNumber = (timeStr: string) => {
    // Split the time string and handle potential spaces
    const [hourStr, period] = timeStr.trim().split(/\s+/);
    let hour = parseInt(hourStr);
    
    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM') {
      if (hour !== 12) {
        hour += 12;
      }
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return hour;
  };

  // Handle bar selection
  const handleBarPress = (event: any, datum: any) => {
    if (!datum) return;
    
    setSelectedBar({
      hour: datum.x,
      busyness: datum.y,
      description: datum.description,
      x: event.nativeEvent.locationX,
      y: event.nativeEvent.locationY - 40 // Offset to show above the bar
    });

    // Hide tooltip after 2 seconds
    setTimeout(() => {
      setSelectedBar(null);
    }, 2000);
  };

  // Create chart data with descriptions
  const chartData = useMemo(() => {
    const data = dayData.map(data => {
      const hour = getHourNumber(data.time);
      const point = {
        x: hour,
        y: data.busyness || 0,
        isCurrentHour: hour === currentHour,
        time: data.time,
        description: data.description,
        originalTime: data.time
      };
      return point;
    });
    
    data.sort((a, b) => a.x - b.x);
    return data;
  }, [dayData, currentHour]);

  const getStatusColor = (busyness: number) => {
    if (busyness >= 75) return 'text-red-600';
    if (busyness >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Check if we have valid data
  const hasValidData = dayData && dayData.length > 0 && dayData.some(data => data.busyness > 0);

  // Format the time range to be more readable
  const formatTimeRange = (timeRange: string) => {
    return timeRange
      .replace('a', 'a')
      .replace('p', 'p')
      .replace(' -', ' - ');
  };

  return (
    <View className="bg-white p-1 rounded-lg">
      <Text className="font-aileron-bold text-2xl mb-4 ml-4">Crowd Forecast</Text>
      <View className="mx-2">
        <View className={`bg-primary rounded-full ml-4 px-6 py-2 self-start`}>
          <Text className="text-white text-center text-lg">
            {forecast.statusText}
          </Text>
        </View>

        <View className="flex-row items-center mb-2 ml-7 mt-4">
          <Text className="font-aileron-semibold text-lg">{currentDay}</Text>
          <Text className="text-gray-500 ml-1">▼</Text>
        </View>

        <View style={{ height: 220 }}>
          {hasValidData ? (
            <VictoryChart
              padding={{ top: 20, bottom: 40, left: 20, right: 20 }}
              domain={{ x: [4, 24], y: [0, 100] }}
              domainPadding={{ x: 15, y: 0 }}
              theme={VictoryTheme.material}
              height={185}
              width={screenWidth - 40}
              events={[{
                target: "data",
                eventHandlers: {
                  onPress: handleBarPress
                }
              }]}
            >
              <VictoryAxis
                tickValues={[4, 8, 12, 16, 20, 24]}
                tickFormat={(t: number) => {
                  if (t === 24) return '12 AM';
                  if (t === 12) return '12 PM';
                  if (t > 12) return `${t-12} PM`;
                  return `${t} AM`;
                }}
                style={{
                  axis: { stroke: "#000000", strokeWidth: 1.5 },
                  grid: { stroke: "#000000", strokeWidth: 0.25 },
                  ticks: { stroke: "#000000", size: 5 },
                  tickLabels: { 
                    fontSize: 12,
                    fill: "#000000",
                    padding: 8,
                    fontFamily: 'Aileron'
                  }
                }}
                offsetY={39}
                standalone={false}
              />
              <VictoryAxis 
                dependentAxis
                style={{
                  axis: { stroke: "transparent" },
                  grid: { stroke: "transparent" },
                  ticks: { stroke: "transparent" },
                  tickLabels: { fill: "transparent" }
                }}
              />
              <VictoryBar
                data={chartData}
                alignment="start"
                barWidth={12}
                barRatio={0.8}
                cornerRadius={{ top: 4 }}
                style={{
                  data: {
                    fill: ({ datum }) => datum.isCurrentHour ? '#2563EB' : '#d9d9d9',
                  }
                }}
              />
            </VictoryChart>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="font-aileron-bold text-xl text-gray-500">
                Data Unavailable
              </Text>
              <Text className="font-aileron text-sm text-gray-400 mt-2">
                Check back later for crowd forecasts
              </Text>
            </View>
          )}

          {/* Tooltip/Popup */}
          {selectedBar && (
            <Animated.View 
              entering={FadeIn.duration(200)}
              className="absolute bg-gray-800 px-3 py-1 rounded-lg"
              style={{
                left: selectedBar.x - 50, // Center the tooltip
                top: selectedBar.y
              }}
            >
              <Text className="text-white text-center">
                {`${selectedBar.description}\n${selectedBar.busyness}% busy`}
              </Text>
            </Animated.View>
          )}
        </View>

        {hasValidData ? (
          <View className="mt-[-30] mx-4">
            <Text className="font-aileron-bold text-2xl mb-3">Plan Your Visit!</Text>
            <View className="bg-gray-100 rounded-full py-4 px-6 flex-row justify-center items-center">
              <Text className="text-[#0c8f34] text-center font-aileron text-lg">
                Best time: {formatTimeRange(bestTime)}
              </Text>
              <View className="w-[1px] h-8 bg-gray-400 mx-4" style={{ marginVertical: -8 }} />
              <Text className="text-[#EF4444] text-center text-lg">
                Worst time: {formatTimeRange(worstTime)}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
} 