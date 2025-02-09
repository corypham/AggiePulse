import { formatInTimeZone, toZonedTime, format } from 'date-fns-tz';
import { Location } from '../types/location';

const TIMEZONE = 'America/Los_Angeles';  // PST/PDT timezone

// Convert 12-hour format to 24-hour format
const convertTo24Hour = (timeStr: string): string => {
  if (!timeStr || timeStr === 'Closed') return '';
  
  // Split time and period
  const [time, period] = timeStr.split(' ');
  let [hours, minutes = '00'] = time.split(':');
  let hour = parseInt(hours);

  // Special handling for 12 AM/PM
  if (hour === 12) {
    hour = period === 'AM' ? 0 : 12;
  } else if (period === 'PM') {
    hour += 12;
  }

  return `${hour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

export const parseTime = (timeStr: string): number => {
  if (!timeStr || timeStr === 'Closed') return -1;
  
  const time24 = convertTo24Hour(timeStr);
  if (!time24) return -1;
  
  const [hours, minutes] = time24.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTime = (timeStr: string): string => {
  if (!timeStr || timeStr === 'Closed') return 'Closed';
  return timeStr; // API already returns formatted time
};

export const isCurrentlyOpen = (hours: { open: string; close: string } | null): boolean => {
  if (!hours?.open || !hours?.close || hours.open === 'Closed') return false;
  
  // Get current time in PST/PDT
  const now = toZonedTime(new Date(), TIMEZONE);
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const openTime = parseTime(hours.open);
  const closeTime = parseTime(hours.close);

  if (openTime === -1 || closeTime === -1) return false;

  // Handle midnight closing (12 AM)
  if (hours.close.includes('12 AM')) {
    return currentTime >= openTime || currentTime < 0; // Open until midnight
  }

  // Normal case
  return closeTime > openTime
    ? currentTime >= openTime && currentTime < closeTime  // Same day
    : currentTime >= openTime || currentTime < closeTime; // Overnight
};

export const updateFacilityHours = (location: Location) => {
  if (!location?.hours) return null;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = toZonedTime(new Date(), TIMEZONE);
  const today = days[now.getDay()];
  const todayHours = location.hours[today];

  return todayHours || null;
};

export const formatOpenUntil = (hours: { open: string; close: string } | null): string => {
  if (!hours) return 'Hours unavailable';
  if (hours.open === 'Closed') return 'Closed today';
  
  const isOpen = isCurrentlyOpen(hours);
  if (isOpen) {
    // Special handling for midnight
    if (hours.close === '12 AM') {
      return 'until midnight';
    }
    return `until ${hours.close}`;
  } else {
    const now = toZonedTime(new Date(), TIMEZONE);
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseTime(hours.open);
    
    if (openTime > currentTime) {
      return `Opens ${hours.open}`;
    } else {
      return 'Closed for today';
    }
  }
}; 