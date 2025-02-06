import { Location, FacilityHours } from '../types/location';

interface RenderableHours {
  facilityName: string;
  open: string;
  close: string;
  isAlwaysOpen?: boolean;
}

export const getLocationHours = (location: Location): RenderableHours[] => {
  const hours: RenderableHours[] = [];
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];

  // Check if we have hours data for today
  if (location.hours && location.hours[today]) {
    const todayHours = location.hours[today];
    hours.push({
      facilityName: location.title || 'Main Building',
      open: todayHours.open,
      close: todayHours.close,
      isAlwaysOpen: todayHours.open === '12:00 AM' && 
                   todayHours.close === '12:00 AM'
    });
  }

  return hours;
};

// Helper function to check if location is currently open
export const isLocationOpen = (location: Location): boolean => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayHours = location.hours?.[today];

  if (!todayHours?.open || !todayHours?.close) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [openHour, openMinute] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
  
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;

  // Handle cases where closing time is past midnight
  return closeTime > openTime 
    ? currentTime >= openTime && currentTime <= closeTime
    : currentTime >= openTime || currentTime <= closeTime;
};

// Helper function to format hours for display
export const formatHours = (timeStr: string): string => {
  if (!timeStr) return '';
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}; 