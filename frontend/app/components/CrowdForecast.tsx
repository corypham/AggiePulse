import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface CrowdForecastProps {
  currentDay: string;
  dayData: Array<{
    time: string;
    busyness: number;
    description: string;
  }>;
  currentStatus: {
    busyness: number;
    description: string;
    typicalDuration: string;
  } | null;
}

export const CrowdForecast: React.FC<CrowdForecastProps> = ({
  currentDay,
  dayData = [],
  currentStatus = null
}) => {
  const screenWidth = Dimensions.get('window').width;
  
  // Format the data to show fewer bars (every 4 hours)
  const chartData = {
    labels: ['4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '12 AM'],
    datasets: [{
      data: dayData
        .filter((_, index) => index % 1 === 0) // Show every other data point to reduce density
        .map(d => d.busyness || 0)
    }]
  };

  // Find best and worst times
  const bestTime = dayData.reduce((best, current) => {
    return (current.busyness < best.busyness) ? current : best;
  }, dayData[0]);

  const worstTime = dayData.reduce((worst, current) => {
    return (current.busyness > worst.busyness) ? current : worst;
  }, dayData[0]);

  const currentHour = new Date().getHours();

  return (
    <View className="bg-white p-4 rounded-lg">
      
      {currentStatus?.description && (
        <View className="bg-primary rounded-full px-6 py-2 mb-4 self-start">
          <Text className="text-white text-center text-lg">
            {currentStatus.description}
          </Text>
        </View>
      )}

      <View className="flex-row items-center mb-2">
        <Text className="font-semibold text-xl">{currentDay}</Text>
        <Text className="text-gray-500 ml-1">▼</Text>
      </View>

      {dayData.length > 0 ? (
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
                  ? `rgba(79, 70, 229, ${opacity})` // Primary blue for current hour
                  : `rgba(100, 100, 100, ${opacity})`; // Changed to gray-500 for darker inactive bars
              },
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.5, // Reduced to create space between bars
              propsForLabels: {
                fontSize: 12,
              },
              propsForBackgroundLines: {
                strokeWidth: 0, // Remove grid lines
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
          {/* Add black x-axis line */}
          <View 
            className="absolute bottom-8 left-0 right-0 h-[2px] bg-black"
            style={{ marginHorizontal: 40 }} // Adjust based on your chart padding
          />
        </View>
      ) : (
        <View className="h-[200] justify-center items-center">
          <Text className="text-gray-500">No data available</Text>
        </View>
      )}

      <View className="mt-6">
        <Text className="font-semibold text-xl mb-3">Plan Your Visit!</Text>
        <View className="bg-gray-100 rounded-xl p-4 flex-row justify-between">
          <Text className="text-green-600 text-lg">
            Best time: {bestTime?.time || '10a - 12p'}
          </Text>
          <Text className="text-red-600 text-lg">
            Worst time: {worstTime?.time || '1p - 3p'}
          </Text>
        </View>
      </View>
    </View>
  );
}; 