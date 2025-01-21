// Path: frontend/types/location.ts

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  id: string;
  name: string;
  buildingName: string;
  type: ('study' | 'gym' | 'dining')[];
  coordinates: Coordinates;
  status: 'Not Busy' | 'Busy' | 'Very Busy';
  isOpen: boolean;
  hours?: {
    open: string;
    close: string;
  };
  description?: string;
}

export interface FilterCategory {
  id: string;
  label: string;
  type: 'study' | 'gym' | 'dining' | 'status';
  icon?: string;
}
