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

// Static data interface
export interface LocationStatic {
  id: string;
  title: string;  // We'll use this for display names
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
  icons: {
    blue: any;
    white: any;
    grey: any;
    black: any;
    selected: any;
    unselected: any;
  };
}

// Dynamic data from API
export interface LocationDynamic {
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  currentStatus: {
    statusText: string;
    currentCapacity: {
      current: number;
      percentage: number;
    };
    description: string;
    untilText: string;
  };
  bestTimes: {
    best: string;
    worst: string;
  };
  weeklyBusyness?: {
    [key: string]: Array<{
      time: string;
      busyness: number;
      description: string;
    }>;
  };
}

// Combined interface for complete location data
export interface Location extends LocationStatic {
  id: string;
  title: string;
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  currentStatus: string;
  currentCapacity: number;
  bestTimes: {
    best: string;
    worst: string;
  };
  crowdInfo: {
    level: string;
    percentage: number;
    description: string;
  };
  closingTime: string;
  distance?: number;
  crowdData?: Array<{
    hour: number;
    percentage: number;
    status: string;
  }>;
  weeklyBusyness?: {
    [key: string]: Array<{
      time: string;
      busyness: number;
      description: string;
    }>;
  };
}

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

// Add new types for bulk operations
interface BulkLocationResponse {
  [locationId: string]: LocationDynamic;
}

interface CachedBulkData {
  timestamp: number;
  data: BulkLocationResponse;
}