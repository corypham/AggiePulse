// Fix the import statement
import { VeryBusyStatus, FairlyBusyStatus, NotBusyStatus } from "../../assets";

export type BusyStatus = 'Very Busy' | 'Fairly Busy' | 'Not Busy';
export type StatusIconType = typeof VeryBusyStatus | typeof FairlyBusyStatus | typeof NotBusyStatus;

export interface Location {
  id: string;
  title: string;
  currentStatus: BusyStatus;
  isOpen: boolean;
  closingTime: string;
  distance: number;
}

// Static location data (constants that don't change)
export const LOCATION_DETAILS: { [key: string]: Pick<Location, 'id' | 'title'> } = {
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
  'shields': {
    id: 'shields',
    title: 'Peter J. Shields Library',
  },
};