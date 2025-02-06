import { FacilityHours, LocationHours } from '../types/location';

export const parseTime = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let totalMinutes = hours * 60 + minutes;
  if (period === 'PM' && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === 'AM' && hours === 12) {
    totalMinutes = minutes;
  }
  
  return totalMinutes;
};

export const formatTime = (timeStr: string): string => {
  return timeStr; // Already in correct format from mock data
};

export const isCurrentlyOpen = (facility: FacilityHours): boolean => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const openTime = parseTime(facility.open);
  const closeTime = parseTime(facility.close);

  if (facility.open === '12:00 AM' && facility.close === '12:00 AM') {
    return true;
  }

  return closeTime > openTime
    ? currentTime >= openTime && currentTime < closeTime
    : currentTime >= openTime || currentTime < closeTime;
};

export const updateFacilityHours = (hours: LocationHours): LocationHours => {
  return {
    main: {
      open: hours.main.open,
      close: hours.main.close,
      label: hours.main.label
    }
  };
};

export const formatOpenUntil = (facility: FacilityHours): string => {
  const isOpen = isCurrentlyOpen(facility);
  return isOpen 
    ? `Until ${facility.close}`
    : `Opens ${facility.open}`;
}; 