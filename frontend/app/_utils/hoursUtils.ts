import { Location, FacilityHours } from '../types/location';

interface RenderableHours {
  facilityName: string;
  open: string;
  close: string;
  isAlwaysOpen?: boolean;
}

export const getLocationHours = (location: Location): RenderableHours[] => {
  const hours: RenderableHours[] = [];

  // Add main building hours
  if (location.hours.main) {
    hours.push({
      facilityName: location.hours.main.label,
      open: location.hours.main.open,
      close: location.hours.main.close,
      isAlwaysOpen: location.hours.main.open === '12:00 AM' && 
                   location.hours.main.close === '12:00 AM'
    });
  }

  // Add study room or other sub-facility hours if they exist
  const studyRoom = location.hours.studyRoom;
  if (studyRoom) {
    hours.push({
      facilityName: studyRoom.label,
      open: studyRoom.open,
      close: studyRoom.close,
      isAlwaysOpen: studyRoom.open === '12:00 AM' && 
                   studyRoom.close === '12:00 AM'
    });
  }

  return hours;
}; 