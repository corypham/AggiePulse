import { Location } from '../types/location';

export const formatDistance = (location: Location): string => {
  if (!location.distance || location.distance <= 0) {
    return '';
  }
  
  return `${location.distance.toFixed(1)} mi`;
};

// Add new helper functions for distance filtering
export const getDistanceValue = (filter: string): number => {
  const value = parseInt(filter.split('-')[1]);
  switch(value) {
    case 0: return 0.25;  // Very Close: 0-0.25 miles
    case 1: return 0.5;   // Close: 0-0.5 miles
    case 2: return 0.66;  // Moderate: 0-0.66 miles
    case 3: return 1.0;   // Far: 0-1 miles
    case 4: return 4.0;   // Very Far: 0-4 miles
    default: return 0.66; // Default to Moderate
  }
};

export const isWithinDistance = (location: Location, maxDistance: number): boolean => {
  // Handle cases where distance might be undefined
  if (location.distance === undefined || location.distance === null) {
    return false;
  }
  return location.distance <= maxDistance;
}; 