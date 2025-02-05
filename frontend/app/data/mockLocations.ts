// Path: frontend/data/mockLocations.ts

// This file contains mock data for development and testing purposes.
// In production, this data will come from the backend API.

import { Location, FilterCategory, BusyStatus } from '../types/location';
import {
  LibraryDetailedCard,
  ArcDetailedCard,
  SiloDetailedCard,
  MemorialUnionDetailedCard,

  // Busyness Meter Icons
  NotBusyStatus,
  FairlyBusyStatus,
  VeryBusyStatus,
  
  // Blue icons
  StudySpacesBlue,
  GymBlue,
  DiningBlue,
  
  // White icons
  StudyWhite,
  GymWhite,
  DiningWhite,
  
  // Grey icons
  DiningGrey,
  GamesGrey,
  GymGrey,
  StudyGrey,
  ADAGrey,
  BrailleGrey,
  ChargingGrey,
  CollaborativeGrey,
  ComfortableSeatingGrey,
  ComputersGrey,
  FastWifiGrey,
  FoodGrey,
  PrinterGrey,
  ProjectorGrey,
  QuietAreasGrey,
  SortEquipmentGrey,
  StudyCagesGrey,
  StudyRoomsGrey,
  WheelchairGrey,
  WhiteboardsGrey,
  WorkTablesGrey,
  VectorGrey,
  Variant1Grey,
  Variant4Grey,
  
  // Black icons
  StudyBlack,
  GymBlack,
  DiningBlack,
  
  // Selected/Unselected icons
  StudySelected,
  StudyUnselected,
  GymSelected,
  GymUnselected,
  DiningSelected,
  DiningUnselected,
} from '../../assets';

export const getInitialMockLocations = (): Location[] => [
  {
    id: '1',
    name: 'Peter J. Shields Library',
    coordinates: {
      latitude: 38.5395,
      longitude: -121.7489
    },
    imageUrl: LibraryDetailedCard,
    isOpen: true,
    hours: {
      main: {
        open: '1:00 AM',
        close: '8:30 PM',
        label: 'Main Building'
      },
      study: {
        open: '1:00 AM',
        close: '12:00 AM',
        label: '24-Hour Study Room'
      }
    },
    currentCapacity: 90,
    maxCapacity: 144,
    features: [
      'Charging Ports',
      'Study Rooms',
      'Fast Wi-Fi',
      'Projector',
      'Printers',
      '24 Hour Study Room',
      'Study Cages'
    ],
    amenities: {
      atmosphere: [
        'Generally quiet',
        'Collaboration zones',
        'Comfortable seating'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Braille signage',
        'ADA-compliant main entrance'
      ]
    },
    description: 'The Peter J. Shields Library, or Shields Library, is a four-story library named after Peter J. Shields. It is located in the eastern part of main campus of UC Davis in unincorporated Yolo County, adjacent to Davis.',
    currentStatus: 'Fairly Busy',
    bestTimes: {
      best: '10am - 12pm',
      worst: '1p - 3p'
    },
    subLocations: [
      {
        name: 'Main Library',
        status: 'Fairly Busy',
        features: ['Charging Ports', 'Study']
      },
      {
        name: '24-Hour Study Room',
        status: 'Not Busy',
        features: ['Study', 'Charging Ports']
      }
    ],
    closingTime: '10:45 PM',
    distance: 0.3,
    type: ['study'],
    title: 'Peter J. Shields Library',
    crowdInfo: {
      level: 'Fairly Busy',
      percentage: 50,
      description: 'Generally moderate seating available'
    },
    icons: {
      blue: StudySpacesBlue,
      white: StudyWhite,
      grey: StudyGrey,
      black: StudyBlack,
      selected: StudySelected,
      unselected: StudyUnselected
    },
  },
  {
    id: '2',
    name: 'Activities and Recreation Center',
    coordinates: {
      latitude: 38.54272,
      longitude: -121.75904
    },
    imageUrl: ArcDetailedCard,
    isOpen: true,
    hours: {
      main: {
        open: '3:00 AM',
        close: '11:00 AM',
        label: 'Main Building'
      }
    },
    currentCapacity: 280,
    maxCapacity: 300,
    features: ['Gym Equipment', 'Pool', 'Basketball Courts'],
    amenities: {
      atmosphere: [
        'Energetic environment',
        'Multiple workout zones'
      ],
      accessibility: [
        'Wheelchair accessible',
        'ADA-compliant entrance'
      ]
    },
    description: 'Gym and fitness center',
    currentStatus: 'Very Busy',
    bestTimes: {
      best: '8am - 10am',
      worst: '5p - 7p'
    },
    subLocations: [
      {
        name: 'Weight Room',
        status: 'Very Busy',
        features: ['Weights', 'Equipment']
      },
      {
        name: 'Pool',
        status: 'Fairly Busy',
        features: ['Swimming', 'Showers']
      }
    ],
    closingTime: '11:00 AM',
    distance: 0.5,
    type: ['gym'],
    title: 'Activities and Recreation Center',
    crowdInfo: {
      level: 'Very Busy',
      percentage: 90,
      description: 'Limited equipment available'
    },
    icons: {
      blue: GymBlue,
      white: GymWhite,
      grey: GymGrey,
      black: GymBlack,
      selected: GymSelected,
      unselected: GymUnselected
    },
  },
  {
    id: '3',
    name: 'Silo Market',
    coordinates: {
      latitude: 38.53879,
      longitude: -121.75305
    },
    imageUrl: SiloDetailedCard,
    isOpen: true,
    hours: {
      main: {
        open: '7:00 AM',
        close: '7:00 PM',
        label: 'Main Building'
      }
    },
    currentCapacity: 120,
    maxCapacity: 200,
    features: [
      'Food Court',
      'Study Tables',
      'Coffee Shop',
      'Fast Wi-Fi',
      'Charging Ports',
      'Outdoor Seating',
      'Microwave Station'
    ],
    amenities: {
      atmosphere: [
        'Casual dining environment',
        'Natural lighting',
        'Mixed indoor/outdoor seating'
      ],
      accessibility: [
        'Wheelchair accessible',
        'ADA-compliant entrance',
        'Ground floor access'
      ]
    },
    description: 'The Silo Market is a central dining and study hub, offering a variety of food options and comfortable spaces for students to eat, study, and socialize.',
    currentStatus: 'Fairly Busy',
    bestTimes: {
      best: '2pm - 4pm',
      worst: '11:30a - 1:30p'
    },
    subLocations: [
      {
        name: 'Food Court',
        status: 'Fairly Busy',
        features: ['Multiple Vendors', 'Seating']
      },
      {
        name: 'Study Area',
        status: 'Not Busy',
        features: ['Tables', 'Charging Ports']
      },
      {
        name: 'Coffee Shop',
        status: 'Very Busy',
        features: ['Beverages', 'Snacks']
      }
    ],
    closingTime: '7:00 PM',
    distance: 0.2,
    type: ['dining', 'study'],
    title: 'Silo Market',
    crowdInfo: {
      level: 'Fairly Busy',
      percentage: 60,
      description: 'Moderate wait times for food'
    },
    icons: {
      blue: DiningBlue,
      white: DiningWhite,
      grey: DiningGrey,
      black: DiningBlack,
      selected: DiningSelected,
      unselected: DiningUnselected
    },
  },
  {
    id: '4',
    name: 'Memorial Union',
    coordinates: {
      latitude: 38.54229,
      longitude: -121.74963
    },
    imageUrl: MemorialUnionDetailedCard,
    isOpen: true,
    hours: {
      main: {
        open: '7:00 AM',
        close: '8:00 PM',
        label: 'Main Building'
      }
    },
    currentCapacity: 90,
    maxCapacity: 300,
    features: [
      'Food Court',
      'Study Areas',
      'Student Services',
      'Bookstore',
      'Meeting Rooms',
      'Information Desk',
      'ATMs'
    ],
    amenities: {
      atmosphere: [
        'Vibrant student center',
        'Multiple seating areas',
        'Social gathering spaces'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Elevator access',
        'ADA-compliant restrooms',
        'Service animal friendly'
      ]
    },
    description: 'The Memorial Union is the heart of campus life, offering dining options, study spaces, and essential student services all under one roof.',
    currentStatus: 'Not Busy',
    bestTimes: {
      best: '9am - 11am',
      worst: '12p - 2p'
    },
    subLocations: [
      {
        name: 'Food Court',
        status: 'Fairly Busy',
        features: ['Multiple Restaurants', 'Seating Area']
      },
      {
        name: 'Study Lounge',
        status: 'Not Busy',
        features: ['Quiet Space', 'Comfortable Seating']
      },
      {
        name: 'Student Services',
        status: 'Not Busy',
        features: ['Information Desk', 'Support Services']
      }
    ],
    closingTime: '8:00 PM',
    distance: 0.5,
    type: ['dining', 'study'],
    title: 'Memorial Union',
    crowdInfo: {
      level: 'Not Busy',
      percentage: 30,
      description: 'Plenty of seating available'
    },
    icons: {
      blue: DiningBlue,
      white: DiningWhite,
      grey: DiningGrey,
      black: DiningBlack,
      selected: DiningSelected,
      unselected: DiningUnselected
    },
  } 
  
  // Add more locations as needed
];

export const mockLocations = getInitialMockLocations();

export default {
  mockLocations,
  getInitialMockLocations,
};