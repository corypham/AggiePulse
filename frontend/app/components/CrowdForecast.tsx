import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
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

  // Format data for Victory chart
  const chartData = fullDayData.map((d, index) => {
    const [hour, period] = d.time.split(' ');
    const hour24 = convertTo24Hour(parseInt(hour), period);
    
    return {
      x: index,
      y: d.busyness || 0,
      time: d.time,
      isCurrentHour: hour24 === currentHour
    };
  });

  const { bestTime, worstTime } = calculateBestWorstTimes(
    dayData,
    location.hours?.[currentDay.toLowerCase()]
  );

  const getStatusColor = (busyness: number) => {
    if (busyness >= 75) return 'text-red-600';
    if (busyness >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <View className="bg-white p-1 rounded-lg">
      <Text className="font-aileron-bold text-2xl mb-4 ml-4">Crowd Forecast</Text>
      <View className="mx-2">
        <View className={`bg-primary rounded-xl ml-4 px-3 py-1 self-start`}>
          <Text className="text-white text-center text-lg">
            {crowdData?.currentStatus || 'Unknown'}
          </Text>
        </View>

        <View className="flex-row items-center mb-2 ml-7 mt-4">
          <Text className="font-aileron-semibold text-md">{currentDay}</Text>
          <Text className="text-gray-500 ml-1">▼</Text>
        </View>

        <View style={{ height: 200, marginHorizontal: -16 }}>
          <VictoryChart
            padding={{ top: 20, bottom: 40, left: 40, right: 40 }}
            domainPadding={{ x: 10 }}
            theme={VictoryTheme.material}
          >
            <VictoryAxis
              tickFormat={(t) => {
                if (t % 4 === 0) {
                  const timeData = fullDayData[t];
                  const [hour, period] = timeData.time.split(' ');
                  return `${hour}${period}`;
                }
                return '';
              }}
              style={{
                axis: { stroke: '#E5E7EB' },
                tickLabels: { fontSize: 12, padding: 5 }
              }}
            />
            <VictoryBar
              data={chartData}
              cornerRadius={{ top: 4 }}
              style={{
                data: {
                  fill: ({ datum }) => datum.isCurrentHour ? '#4F46E5' : '#E5E7EB',
                  width: 12
                }
              }}
              animate={{
                duration: 200,
                onLoad: { duration: 200 }
              }}
            />
          </VictoryChart>
        </View>

        <View className="mt-6 mx-6">
          <Text className="font-aileron-semibold text-xl mb-3 pl-2">Plan Your Visit!</Text>
          <View className="bg-gray-100 rounded-full py-4 flex-row justify-center items-center">
            <Text className="text-[#0c8f34] text-center font-aileron">
              Best time: {bestTime}
            </Text>
            <View className="w-[1px] h-8 bg-gray-400 mx-3" style={{ marginVertical: -8 }} />
            <Text className="text-[#EF4444] text-center">
              Worst time: {worstTime}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Helper function to convert 12-hour to 24-hour format
function convertTo24Hour(hour: number, period: string): number {
  if (period === 'PM' && hour !== 12) return hour + 12;
  if (period === 'AM' && hour === 12) return 0;
  return hour;
} 