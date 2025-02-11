import { Location } from '../types/location';

function isCurrentlyOpen(hours: { open: string; close: string }): boolean {
  if (!hours || !hours.open || !hours.close) return false;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes; // Convert to minutes for easier comparison
  
  try {
    // Handle different time formats
    const openParts = hours.open.split(' ');
    const closeParts = hours.close.split(' ');
    
    // Convert to 24-hour format
    let openTime = convertTo24Hour(openParts[0], openParts[1]);
    let closeTime = convertTo24Hour(closeParts[0], closeParts[1]);
    
    return currentTime >= openTime && currentTime < closeTime;
  } catch (error) {
    console.error('Error parsing hours:', hours, error);
    return false;
  }
}

// Helper function to convert time to minutes since midnight
function convertTo24Hour(timeStr: string, period?: string): number {
  try {
    const [hours, minutes = '0'] = timeStr.split(':');
    let hour = parseInt(hours);
    
    // Handle cases where period might not be provided
    if (period) {
      if (period.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
      }
    }
    
    // If no valid hour could be parsed, return 0
    if (isNaN(hour)) {
      console.warn('Invalid hour format:', timeStr);
      return 0;
    }
    
    return (hour * 60) + parseInt(minutes || '0');
  } catch (error) {
    console.error('Error converting time:', timeStr, period, error);
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
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[now.getDay()].toLowerCase();

  if (!location.hours || !location.hours[currentDay]) {
    return false;
  }

  const { open, close } = location.hours[currentDay];
  
  // Convert time string to minutes since midnight
  const timeToMinutes = (timeStr: string, isClosingTime: boolean = false): number => {
    if (!timeStr) return 0;
    
    
    // Special case: if it's a closing time of 12 AM, treat it as end of day
    if (isClosingTime && timeStr.trim().toUpperCase() === '12 AM') {;
      return 24 * 60;  // 1440 minutes (end of day)
    }
    
    // Split time and period
    const matches = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (!matches) {
      return 0;
    }
    
    const [_, hours, minutes = '0', period] = matches;
    let hour = parseInt(hours);
    

    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
      // Special case: 12 AM closing time should be end of day
      if (isClosingTime) {
        hour = 24;
      } else {
        hour = 0;
      }
    }

    const totalMinutes = (hour * 60) + parseInt(minutes);
;

    return totalMinutes;
  };

  const currentMinutes = (now.getHours() * 60) + now.getMinutes();
  const openMinutes = timeToMinutes(open, false);  // Opening time
  const closeMinutes = timeToMinutes(close, true);  // Closing time - important!

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
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