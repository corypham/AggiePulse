import { Location } from '../types/location';

function isCurrentlyOpen(hours: { open: string; close: string }): boolean {
  if (!hours || !hours.open || !hours.close) return false;
  
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  try {
    const openTime = convertTimeStringToNumber(hours.open);
    const closeTime = convertTimeStringToNumber(hours.close);
    
    return currentTime >= openTime && currentTime < closeTime;
  } catch (error) {
    console.error('Error parsing time:', error);
    return false;
  }
}

function convertTimeStringToNumber(timeStr: string): number {
  if (!timeStr) return 0;
  
  try {
    // Handle 24-hour format (e.g., "14:30")
    if (timeStr.includes(':') && !timeStr.includes(' ')) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 100 + (minutes || 0);
    }
    
    // Handle 12-hour format (e.g., "2:30 PM")
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour = hours;
    if (period === 'PM' && hours !== 12) hour += 12;
    if (period === 'AM' && hours === 12) hour = 0;
    
    return hour * 100 + (minutes || 0);
  } catch (error) {
    console.error('Error converting time string:', timeStr, error);
    return 0;
  }
}

function getNextOpenDay(location: Location, startDay: number): { day: string; hours: { open: string; close: string } } | null {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Check next 7 days starting from today
  for (let i = 0; i < 7; i++) {
    const checkDay = (startDay + i) % 7;
    const dayHours = location.hours?.[days[checkDay]];
    
    if (dayHours?.open && dayHours?.close) {
      return {
        day: i === 0 ? '' : shortDays[checkDay], // Empty string for today
        hours: dayHours
      };
    }
  }
  
  return null;
}

// Export the hours data for use in Card component
export const getLocationHours = (location: Location): { 
  nextOpenDay: string; 
  openTime: string;
  closeTime: string;
} => {
  if (!location.hours) {
    return { nextOpenDay: '', openTime: '', closeTime: '' };
  }

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  const todayHours = location.hours[days[today]];

  // Find next opening time
  const nextOpen = getNextOpenDay(location, today);
  if (!nextOpen) {
    return { nextOpenDay: '', openTime: '', closeTime: '' };
  }

  return {
    nextOpenDay: nextOpen.day,
    openTime: nextOpen.hours.open,
    closeTime: nextOpen.hours.close
  };
};

// Keep existing functions for backward compatibility
export const getOpenStatusText = (location: Location): string => {
  if (!location.hours) {
    return 'Hours unavailable';
  }

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  const todayHours = location.hours[days[today]];

  if (todayHours?.open && todayHours?.close && isCurrentlyOpen(todayHours)) {
    return `until ${todayHours.close}`;
  }

  const nextOpen = getNextOpenDay(location, today);
  if (!nextOpen) {
    return 'Hours unavailable';
  }

  if (!nextOpen.day && todayHours?.open) {
    return `until ${todayHours.open}`;
  }

  return `until ${nextOpen.hours.open} ${nextOpen.day}`;
};

export const isLocationOpen = (location: Location): boolean => {
  if (!location.hours) return false;
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  const todayHours = location.hours[days[today]];
  
  if (!todayHours) return false;
  
  return isCurrentlyOpen(todayHours);
};