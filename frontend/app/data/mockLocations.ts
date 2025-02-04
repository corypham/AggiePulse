// Path: frontend/data/mockLocations.ts

import { Location, FilterCategory, BusyStatus } from '../types/location';

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Peter J. Shields Library',
    coordinates: {
      latitude: 38.5395,
      longitude: -121.7489
    },
    status: 'Not Busy',
    isOpen: true,
    hours: {
      open: '8:00 AM',
      close: '11:00 PM'
    },
    description: 'Main library study space with quiet areas',
    currentStatus: 'Not Busy',
    closingTime: '11:00 PM',
    distance: 0.3,
    type: ['study'],
    title: 'Peter J. Shields Library'
  },
  {
    id: '2',
    name: 'Activities and Recreation Center',
    coordinates: {
      latitude: 38.54272,
      longitude: -121.75904
    },
    status: 'Very Busy',
    isOpen: true,
    hours: {
      open: '6:00 AM',
      close: '12:00 AM'
    },
    description: 'Gym and fitness center',
    currentStatus: 'Very Busy',
    closingTime: '12:00 AM',
    distance: 0.5,
    type: ['gym'],
    title: 'Activities and Recreation Center'
  },
  {
    id: '3',
    name: 'Silo Market',
    coordinates: {
      latitude: 38.53879,
      longitude: -121.75305
    },
    status: 'Fairly Busy',
    isOpen: true,
    hours: {
      open: '7:00 AM',
      close: '7:00 PM'
    },
    description: 'Campus dining commons',
    currentStatus: 'Fairly Busy',
    closingTime: '7:00 PM',
    distance: 0.2,
    type: ['dining'],
    title: 'Silo Market'
  },
  {
    id: '4',
    name: 'Memorial Union',
    coordinates: {
      latitude: 38.54229,
      longitude: -121.74963
    },
    status: 'Not Busy',
    isOpen: true,
    hours: {
      open: '7:00 AM',
      close: '8:00 PM'
    },
    description: 'Campus dining & study commons',
    currentStatus: 'Not Busy',
    closingTime: '8:00 PM',
    distance: 0.5,
    type: ['dining', 'study'],
    title: 'Memorial Union'
  } 
  
  // Add more locations as needed
];

export const filterCategories: FilterCategory[] = [
  {
    id: 'study',
    label: 'Study',
    type: 'study',
    icon: '📚'  // We can replace these with actual icon components later
  },
  {
    id: 'gym',
    label: 'Gym',
    type: 'gym',
    icon: '💪'
  },
  {
    id: 'dining',
    label: 'Dining',
    type: 'dining',
    icon: '🍽️'
  },
  {
    id: 'not-busy',
    label: 'Not Busy',
    type: 'status'
  },
  {
    id: 'very-busy',
    label: 'Very Busy',
    type: 'status'
  },
  {
    id: 'new-category',
    label: 'New Category',
    type: 'new-category',
    icon: '🏢'
  }
];

export default {
  mockLocations,
  filterCategories
};