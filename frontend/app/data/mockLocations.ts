// Path: frontend/data/mockLocations.ts

import { Location, FilterCategory } from '../types/location';

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Peter J. Shields Library',
    buildingName: 'Shields Library',
    type: ['study'],
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
    description: 'Main library study space with quiet areas'
  },
  {
    id: '2',
    name: 'Activities & Recreation Center',
    buildingName: 'ARC',
    type: ['gym'],
    coordinates: {
      latitude: 38.54272,
      longitude: -121.75904
    },
    status: 'Busy',
    isOpen: true,
    hours: {
      open: '6:00 AM',
      close: '12:00 AM'
    },
    description: 'Gym and fitness center'
  },
  {
    id: '3',
    name: 'Silo Dining',
    buildingName: 'Silo South',
    type: ['dining'],
    coordinates: {
      latitude: 38.53879,
      longitude: -121.75305
    },
    status: 'Busy',
    isOpen: true,
    hours: {
      open: '7:00 AM',
      close: '7:00 PM'
    },
    description: 'Campus dining commons'
  },
  {
    id: '4',
    name: 'Memorial Union',
    buildingName: 'MU',
    type: ['dining', 'study'],
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
    description: 'Campus dining & studycommons'
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
  }
];

export default {
  mockLocations,
  filterCategories
};