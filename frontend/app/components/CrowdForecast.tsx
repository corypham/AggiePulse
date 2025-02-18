import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryContainer } from 'victory-native';
import type { Location } from '../types/location';
import LocationService from '../services/locationService';
import { calculateBestWorstTimes } from '../_utils/timeUtils';
import { useLocations } from '../hooks/useLocations';

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
  
  // Get current location data from context
  const currentLocation = useMemo(() => 
    locations.find(loc => loc.id === location.id) || location,
    [locations, location.id]
  );

  // Use the data from context instead of making separate API calls
  const crowdData = useMemo(() => ({
    currentStatus: currentLocation.currentStatus,
    weeklyBusyness: currentLocation.weeklyBusyness,
    // ... other needed data
  }), [currentLocation, lastUpdate]);

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

  // Map the data to the standard scale with correct PM hour conversion
  const chartData = useMemo(() => {
    
    const data = dayData.map(data => {
      const hour = getHourNumber(data.time);
      const point = {
        x: hour,
        y: data.busyness || 0,
        isCurrentHour: hour === currentHour,
        time: data.time,
        originalTime: data.time
      };
      return point;
    });
    
    // Sort data points by hour to ensure proper rendering
    data.sort((a, b) => a.x - b.x);
    
    return data;
  }, [dayData, currentHour]);


  const { bestTime, worstTime } = calculateBestWorstTimes(
    dayData,
    location.hours?.[currentDay.toLowerCase()]
  );

  const getStatusColor = (busyness: number) => {
    if (busyness >= 75) return 'text-red-600';
    if (busyness >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  console.log('Current Location Data:', JSON.stringify({
    currentStatus: currentLocation.currentStatus,
    crowdInfo: currentLocation.crowdInfo,
    weeklyBusyness: currentLocation.weeklyBusyness,
    dayData
  }, null, 2));

  return (
    <View className="bg-white p-1 rounded-lg">
      <Text className="font-aileron-bold text-2xl mb-4 ml-4">Crowd Forecast</Text>
      <View className="mx-2">
        <View className={`bg-primary rounded-full ml-4 px-6 py-2 self-start`}>
          <Text className="text-white text-center text-lg">
            {crowdData?.currentStatus || 'Unknown'}
          </Text>
        </View>

        <View className="flex-row items-center mb-2 ml-7 mt-4">
          <Text className="font-aileron-semibold text-lg">{currentDay}</Text>
          <Text className="text-gray-500 ml-1">▼</Text>
        </View>

        <View style={{ height: 220 }}>
          <VictoryChart
            padding={{ top: 20, bottom: 40, left: 20, right: 20 }}
            domain={{ 
              x: [4, 24],
              y: [0, 100]
            }}
            domainPadding={{ x: 15, y: 0 }}
            theme={VictoryTheme.material}
            height={185}
            width={screenWidth - 40}
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
              animate={{
                duration: 200,
                onLoad: { duration: 200 }
              }}
              standalone={false}
            />
          </VictoryChart>
        </View>

        <View className="mt-[-30] mx-4">
          <Text className="font-aileron-bold text-2xl mb-3">Plan Your Visit!</Text>
          <View className="bg-gray-100 rounded-full py-4 px-6 flex-row justify-center items-center">
            <Text className="text-[#0c8f34] text-center font-aileron text-lg">
              Best time: {bestTime}
            </Text>
            <View className="w-[1px] h-8 bg-gray-400 mx-4" style={{ marginVertical: -8 }} />
            <Text className="text-[#EF4444] text-center text-lg">
              Worst time: {worstTime}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
} 