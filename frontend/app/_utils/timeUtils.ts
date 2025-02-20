import { Location } from '../types/location';

// Make sure getCurrentDay is exported
export const getCurrentDay = (): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

function isCurrentlyOpen(hours: { open: string; close: string }): boolean {
  if (!hours || !hours.open || !hours.close) return false;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;
  
  try {
    const openTime = parseTimeString(hours.open, false);
    const closeTime = parseTimeString(hours.close, true);
    
    return currentTime >= openTime && currentTime <= closeTime;
  } catch (error) {
    console.error('Error parsing hours:', hours, error);
    return false;
  }
}

export function parseTimeString(timeStr: string, isClosingTime: boolean = false): number {
  try {
    if (!timeStr) return 0;
    
    // Handle "12" as "12 PM"
    if (timeStr === '12') {
      return 12 * 60; // 720 minutes (noon)
    }
    
    // Extract hour, minute, and period using regex
    const match = timeStr.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
    if (!match) return 0;
    
    const [_, hourStr, minuteStr = '0', period = 'PM'] = match;
    let hour = parseInt(hourStr);
    const minutes = parseInt(minuteStr);
    
    const upperPeriod = period.toUpperCase();
    
    // Special case: if it's closing time and time is 12 AM, return end of day
    if (isClosingTime && hour === 12 && upperPeriod === 'AM') {
      return 24 * 60; // 1440 minutes
    }
    
    // Convert to 24-hour format
    if (upperPeriod === 'PM') {
      if (hour !== 12) {
        hour += 12;  // 1 PM -> 13, 2 PM -> 14, etc.
      }
    } else if (upperPeriod === 'AM' && hour === 12) {
      hour = 0;  // 12 AM -> 0 (except for closing time, handled above)
    }
    
    return (hour * 60) + minutes;
  } catch (error) {
    console.error('Error parsing time:', timeStr, error);
    return 0;
  }
}

function convertTimeStringToNumber(timeStr: string): number {
  if (!timeStr) return 0;
  
  try {
    // Handle 12-hour format (e.g., "2:30 PM")
    const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
    
    let hour = hours;
    // Fix PM conversion
    if (period?.toUpperCase() === 'PM' && hours !== 12) hour += 12;
    if (period?.toUpperCase() === 'AM' && hours === 12) hour = 0;
    
    return hour * 100 + (minutes || 0);
  } catch (error) {
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
  // Special handling for 24-hour locations
  if (location.is24Hours || location.id === '24hr') {
    return {
      nextOpenDay: '',
      openTime: 'Open 24 Hours',
      closeTime: ''
    };
  }

  const currentDay = getCurrentDay();
  const todayHours = location.hours?.[currentDay];

  if (!location.hours || !todayHours) {
    return { nextOpenDay: '', openTime: '', closeTime: '' };
  }

  // Find next opening time
  const nextOpen = getNextOpenDay(location, new Date().getDay());
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
  // If location is 24 hours, return appropriate text
  if (location.is24Hours || location.id === '24hr') {
    return '24 Hours';
  }

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
  // If location is marked as 24 hours or is the 24hr study room, always return true
  if (location.is24Hours || location.id === '24hr') {
    return true;
  }

  const currentDay = getCurrentDay();
  const todayHours = location.hours?.[currentDay];
  
  // If no hours data or no hours for today
  if (!todayHours || !todayHours.open || todayHours.open === 'Closed') {
    return false;
  }

  return isCurrentlyOpen(todayHours);
};

interface TimeSlot {
  time: string;
  busyness: number;
  description: string;
}

interface BestWorstTimes {
  bestTime: string;
  worstTime: string;
}

export const calculateBestWorstTimes = (
  dayData: TimeSlot[],
  hours?: { open: string; close: string }
): BestWorstTimes => {
  try {
    // Simplified validation that matches our actual data format
    const validHours = dayData.filter(timeSlot => {
      return (
        timeSlot &&
        typeof timeSlot.busyness === 'number' &&
        typeof timeSlot.time === 'string'
      );
    });

    if (validHours.length === 0) {
      return { 
        bestTime: 'N/A', 
        worstTime: 'N/A' 
      };
    }

    // Find first non-zero busyness slot
    const firstNonZeroSlot = validHours.find(slot => slot.busyness > 0);

    // Find best time (least busy) - skip zero values
    const bestTimeSlot = validHours.reduce((best, current) => {
      if (current.busyness === 0) return best;
      if (best.busyness === 0) return current;
      return (current.busyness < best.busyness) ? current : best;
    }, firstNonZeroSlot || validHours[0]);

    // Find worst time (busiest)
    const worstTimeSlot = validHours.reduce((worst, current) => {
      return (current.busyness > worst.busyness) ? current : worst;
    }, validHours[0]);

    // Format the time ranges
    const formatTimeRange = (timeSlot: TimeSlot): string => {
      try {
        // Handle single-digit hours (e.g., "6 AM")
        const timeRegex = /(\d+)\s*(AM|PM)/i;
        const match = timeSlot.time.match(timeRegex);
        
        if (!match) return 'N/A';
        
        const startHour = parseInt(match[1]);
        const period = match[2];
        const endHour = (startHour % 12) + 1;
        // Just take first letter of period and make it lowercase
        const periodLetter = period.charAt(0).toLowerCase();
        
        return `${startHour}${periodLetter} - ${endHour}${periodLetter}`;
      } catch (error) {
        console.error('Error formatting time range:', error);
        return 'N/A';
      }
    };

    return {
      bestTime: bestTimeSlot && bestTimeSlot.busyness > 0 ? formatTimeRange(bestTimeSlot) : 'N/A',
      worstTime: worstTimeSlot && worstTimeSlot.busyness > 0 ? formatTimeRange(worstTimeSlot) : 'N/A'
    };
  } catch (error) {
    console.error('Error calculating best/worst times:', error);
    return {
      bestTime: 'N/A',
      worstTime: 'N/A'
    };
  }
};

// Add this utility function
export const formatTimeRangeWithMeridiem = (timeRange: string): string => {
  // Convert "5a - 6a" or "2p - 3p" format to "5AM - 6AM" or "2PM - 3PM"
  return timeRange.replace(/(\d+)(a|p) - (\d+)(a|p)/i, (_, h1, m1, h2, m2) => 
    `${h1}${m1.toUpperCase()}M - ${h2}${m2.toUpperCase()}M`
  );
};

// Get current open/closed status
export const getCurrentOpenStatus = (location: Location): boolean => {
  const currentDay = getCurrentDay();
  const todayHours = location.hours?.[currentDay];
  
  if (!todayHours) return false;
  return isCurrentlyOpen(todayHours);
};