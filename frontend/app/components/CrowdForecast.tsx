import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import type { Location } from '../types/location';
import LocationService from '../services/locationService';

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
  const [crowdData, setCrowdData] = useState<any>(null);
  
  useEffect(() => {
    const fetchCrowdData = async () => {
      try {
        const data = await LocationService.getLocationCrowdData(location.id);
        console.log('Crowd Data Fetched:', data);
        setCrowdData(data);
      } catch (error) {
        console.error('Error fetching crowd data:', error);
      }
    };

    fetchCrowdData();
  }, [location.id]);

  // Get current status directly from API response
  const getCurrentStatus = () => {
    if (!crowdData?.currentStatus) return 'Not Busy';
    return crowdData.currentStatus.statusText || 'Not Busy';
  };

  const screenWidth = Dimensions.get('window').width;
  
  // Generate 24-hour data if none exists
  const fullDayData = dayData.length > 0 ? dayData : Array.from({ length: 24 }, (_, i) => ({
    time: `${i} ${i < 12 ? 'AM' : 'PM'}`,
    busyness: 0,
    description: ''
  }));
  
  // Format the data for the chart
  const chartData = {
    labels: ['4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '12 AM'],
    datasets: [{
      data: fullDayData.map(d => d.busyness)
    }]
  };

  const currentHour = new Date().getHours();
  
  // Find the current hour's data
  const currentBusyness = dayData.find(data => {
    const [hour, period] = data.time.split(' ');
    const dataHour = convertTo24Hour(parseInt(hour), period);
    return dataHour === currentHour;
  });

  // Convert 12-hour format to 24-hour
  function convertTo24Hour(hour: number, period: string): number {
    if (period === 'PM' && hour !== 12) return hour + 12;
    if (period === 'AM' && hour === 12) return 0;
    return hour;
  }


  // Find best and worst times
  const bestTime = fullDayData.reduce((best, current) => {
    return (current.busyness < best.busyness) ? current : best;
  }, fullDayData[0]);

  const worstTime = fullDayData.reduce((worst, current) => {
    return (current.busyness > worst.busyness) ? current : worst;
  }, fullDayData[0]);

  const getStatusColor = (busyness: number) => {
    if (busyness >= 75) return 'text-red-600';
    if (busyness >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <View className="bg-white p-1 rounded-lg">
      <Text className="font-aileron-bold text-2xl mb-4 ml-4">Crowd Forecast</Text>
      <View>
        <View className={`bg-primary rounded-xl ml-4 px-3 py-1 self-start`}>
          <Text className="text-white text-center text-lg">
            {getCurrentStatus()}
          </Text>
        </View>

        <View className="flex-row items-center mb-2 ml-4">
          <Text className="font-aileron-semibold text-md">{currentDay}</Text>
          <Text className="text-gray-500 ml-1">▼</Text>
        </View>

      </View>


      <View>
        <BarChart
          data={chartData}
          width={screenWidth - 48}
          height={200}
          yAxisLabel=""
          yAxisSuffix=""
          withVerticalLabels={true}
          withHorizontalLabels={false}
          segments={4}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => {
              return currentHour === 16 
                ? `rgba(79, 70, 229, ${opacity})`
                : `rgba(100, 100, 100, ${opacity})`;
            },
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.5,
            propsForLabels: {
              fontSize: 12,
            },
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
            paddingRight: 0,
          }}
          showBarTops={false}
          fromZero={true}
          withInnerLines={false}
          showValuesOnTopOfBars={false}
        />
        <View 
          className="absolute bottom-8 left-0 right-0 h-[2px] bg-black"
          style={{ marginHorizontal: 40 }}
        />
      </View>

      <View className="mt-6">
        <Text className="font-aileron-semibold text-xl mb-3">Plan Your Visit!</Text>
        <View className="bg-gray-100 rounded-full p-2 flex-row items-center justify-center space-x-4 font-aileron">
          <Text className="text-[#0c8f34] mr-4">
            Best time: {bestTime ? bestTime.time : 'N/A'}
          </Text>
          <View className="w-[1px] h-8 bg-gray-400" />
          <Text className="text-[#EF4444] ml-4">
            Worst time: {worstTime ? worstTime.time : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
} 