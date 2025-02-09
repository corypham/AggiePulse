// Fix the import statement
import { VeryBusyStatus, FairlyBusyStatus, NotBusyStatus } from "../../assets";

export type BusyStatus = 'Not Busy' | 'Fairly Busy' | 'Very Busy';
export type StatusIconType = typeof VeryBusyStatus | typeof FairlyBusyStatus | typeof NotBusyStatus;

export interface FacilityHours {
  open: string;
  close: string;
  label: string;
}

export interface LocationHours {
  main: FacilityHours;
  subLocations?: FacilityHours[];
}

export interface SubLocation {
  name: string;
  hours?: {
    open: string;
    close: string;
  };
  status: BusyStatus;
  features: string[];
}

interface DayHours {
  open: string;
  close: string;
}

interface Hours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

// Add this interface for the icons
export interface LocationIcons {
  blue: any;
  white: any;
  grey: any;
  black: any;
  selected: any;
  unselected: any;
}

export interface StaticLocation {
  id: string;
  title: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  imageUrl: any;
  maxCapacity: number;
  features: string[];
  amenities: {
    general: string[];
    atmosphere: string[];
    accessibility: string[];
  };
  description: string;
  type: string[];
  icons: LocationIcons;
}

export interface DynamicLocation {
  currentStatus: {
    busyness: number;
    description: string;
    typicalDuration: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    } | { open: 'Closed' };  // Handle "Closed" case
  };
  weeklyBusyness: {
    [key: string]: Array<any>; // We can type this more specifically if needed
  };
}

export type Location = StaticLocation & DynamicLocation;

export interface FilterCategory {
  id: string;
  label: string;
  type: string;
  icon?: string;
}

// Static location data (constants that don't change)
export const LOCATION_DETAILS: { [key: string]: { id: string; title: string } } = {
  'silo-market': {
    id: 'silo-market',
    title: 'Silo Market',
  },
  'arc': {
    id: 'arc',
    title: 'Activities and Recreation Center',
  },
  'mu': {
    id: 'mu',
    title: 'Memorial Union',
  },
  'library': {
    id: 'library',
    title: 'Peter J. Shields Library',
  },
};