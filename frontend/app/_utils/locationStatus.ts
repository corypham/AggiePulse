import { Location } from '../types/location';
import { isCurrentlyOpen, formatTime } from './timeUtils';

interface StatusColors {
  background: string;
  text: string;
}

const getStatusColors = (busyness: number): StatusColors => {
  if (busyness >= 75) {
    return {
      background: 'bg-[#FEF2F2]',
      text: 'text-[#DC2626]'
    };
  } else if (busyness >= 40) {
    return {
      background: 'bg-[#FFF9E7]',
      text: 'text-[#D97706]'
    };
  } else {
    return {
      background: 'bg-[#ECFDF5]',
      text: 'text-[#059669]'
    };
  }
};

export function getLocationStatus(location: Location) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayHours = location.hours?.[today];

  const isOpen = todayHours ? isCurrentlyOpen(todayHours) : false;
  const statusColors = getStatusColors(location.crowdInfo?.percentage || 0);

  return {
    isOpen,
    statusText: location.crowdInfo?.level || 'Unknown',
    timeText: isOpen 
      ? `until ${todayHours?.close}`
      : todayHours?.open 
        ? `Opens ${todayHours.open}`
        : 'Hours unavailable',
    colorClass: isOpen ? 'text-green-600' : 'text-red-600',
    statusClass: isOpen 
      ? 'font-aileron-bold text-green-600' 
      : 'font-aileron-bold text-red-600',
    backgroundClass: statusColors.background,
    statusTextClass: statusColors.text
  };
}

export default {
  getLocationStatus
}; 