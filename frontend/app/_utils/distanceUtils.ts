import { Location } from '../types/location';

export const formatDistance = (location: Location): string => {
  if (!location.distance || location.distance <= 0) {
    return '';
  }
  
  return `${location.distance.toFixed(1)} mi`;
}; 