// Path: frontend/components/MapMarker.tsx

import React from 'react';
import { View } from 'react-native';
import { Book, Dumbbell, Utensils } from 'lucide-react-native';

interface MapMarkerProps {
  type: string;
  status: string;
}

const getMarkerColor = (status: string) => {
  switch (status) {
    case 'Not Busy':
      return '#4CAF50'; // Green
    case 'Busy':
      return '#FFA000'; // Orange
    case 'Very Busy':
      return '#F44336'; // Red
    default:
      return '#2196F3'; // Blue
  }
};

const getMarkerIcon = (type: string) => {
  switch (type) {
    case 'study':
      return <Book size={20}  />;
    case 'gym':
      return <Dumbbell size={20}  />;
    case 'dining':
      return <Utensils size={20}  />;
    default:
      return <Book size={20}  />;
  }
};

export const MapMarker: React.FC<MapMarkerProps> = ({ type, status }) => {
  return (
    <View 
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor: getMarkerColor(status) }}
    >
      {getMarkerIcon(type)}
    </View>
  );
};

export default MapMarker;