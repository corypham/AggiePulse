import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface CrowdForecastProps {
  currentDay: string;
  dayData: Array<{
    time: string;
    busyness_score: number;
    info?: string;
  }>;
  currentStatus: {
    busyness: number;
    description: string;
    typicalDuration: string;
  };
}

export const CrowdForecast: React.FC<CrowdForecastProps> = ({
  currentDay,
  dayData,
  currentStatus
}) => {
  const chartData = {
    labels: dayData.map(d => d.time),
    datasets: [{
      data: dayData.map(d => d.busyness_score)
    }]
  };

  return (
    <View className="px-4 py-6">
      <Text className="font-aileron-bold text-2xl mb-4">Crowd Forecast</Text>
      
      <View className="bg-[#3B82F6] rounded-full px-4 py-2 mb-4">
        <Text className="text-white text-center">
          {currentStatus.description}
        </Text>
      </View>

      <BarChart
        data={chartData}
        width={300}
        height={200}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      <View className="mt-4 bg-gray-100 p-4 rounded-xl">
        <Text className="font-aileron-bold mb-2">Plan Your Visit!</Text>
        <View className="flex-row justify-between">
          <Text className="text-green-600">Best time: 10a - 12p</Text>
          <Text className="text-red-600">Worst time: 1p - 3p</Text>
        </View>
      </View>
    </View>
  );
}; 