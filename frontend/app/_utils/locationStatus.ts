import { Location } from '../types/location';

interface LocationStatusInfo {
  isOpen: boolean;
  statusText: string;
  timeText: string;
  colorClass: string;
  statusClass: string;
  backgroundClass: string;
  statusTextClass: string;
}

function convertTo24Hour(timeStr: string): number {
  
  if (!timeStr) return 0;
  timeStr = timeStr.trim();
  
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

export function getLocationStatus(location: Location): LocationStatusInfo {
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'Not Busy':
        return {
          background: 'bg-[#ECFDF5]',
          text: 'text-[#059669]'
        };
      case 'Fairly Busy':
        return {
          background: 'bg-[#FFF9E7]',
          text: 'text-[#D97706]'
        };
      case 'Very Busy':
        return {
          background: 'bg-[#FEF2F2]',
          text: 'text-[#DC2626]'
        };
      default:
        return {
          background: 'bg-gray-50',
          text: 'text-gray-600'
        };
    }
  };

  const statusColors = getStatusColors(location.currentStatus);

  // First check if location is operationally open
  if (!location.isOpen) {
    return {
      isOpen: false,
      statusText: 'Temporarily Closed',
      timeText: 'Check back later',
      colorClass: 'text-closed',
      statusClass: 'font-aileron-bold text-closed',
      backgroundClass: statusColors.background,
      statusTextClass: statusColors.text
    };
  }

  // Then check regular hours
  if (!location.hours?.main) {
    return {
      isOpen: false,
      statusText: 'Hours Unavailable',
      timeText: 'Contact location',
      colorClass: 'text-closed',
      statusClass: 'font-aileron-bold text-closed',
      backgroundClass: statusColors.background,
      statusTextClass: statusColors.text
    };
  }

  // Get current time in local timezone
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Handle 24-hour locations
  if (location.hours.main.open === '12:00 AM' && location.hours.main.close === '12:00 AM') {
    return {
      isOpen: true,
      statusText: 'Open',
      timeText: '24 Hours',
      colorClass: 'text-open',
      statusClass: 'font-aileron-bold text-open',
      backgroundClass: statusColors.background,
      statusTextClass: statusColors.text
    };
  }

  const openMinutes = convertTo24Hour(location.hours.main.open);
  const closeMinutes = convertTo24Hour(location.hours.main.close);

  // Handle locations that close after midnight
  const isOpenPastMidnight = closeMinutes < openMinutes;
  let isWithinHours;

  if (isOpenPastMidnight) {
    isWithinHours = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  } else {
    isWithinHours = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }

  return {
    isOpen: isWithinHours,
    statusText: isWithinHours ? 'Open' : 'Closed',
    timeText: isWithinHours 
      ? `until ${location.hours.main.close}`
      : `until ${location.hours.main.open}`,
    colorClass: isWithinHours ? 'text-open' : 'text-closed',
    statusClass: isWithinHours 
      ? 'font-aileron-bold text-open' 
      : 'font-aileron-bold text-closed',
    backgroundClass: statusColors.background,
    statusTextClass: statusColors.text
  };
}

export default {
  getLocationStatus
}; 