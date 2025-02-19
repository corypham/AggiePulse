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
    id: 'library',
    name: 'Peter J. Shields Library',
    coordinates: {
      latitude: 38.5395,
      longitude: -121.7489
    },
    imageUrl: LibraryDetailedCard,
    hours: {
      monday: { open: '7:30 AM', close: '10:00 PM' },
      tuesday: { open: '7:30 AM', close: '10:00 PM' },
      wednesday: { open: '7:30 AM', close: '10:00 PM' },
      thursday: { open: '7:30 AM', close: '10:00 PM' },
      friday: { open: '7:30 AM', close: '6:00 PM' },
      saturday: { open: '12:00 PM', close: '5:00 PM' },
      sunday: { open: '12:00 PM', close: '10:00 PM' }
    },
    currentCapacity: 20,
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
      general: [
        'Charging Ports',
        'Study Rooms',
        'Fast Wi-Fi',
        'Projector',
        'Printers',
        '24 Hour Study Room',
        'Study Cages'
      ],
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
    currentStatus: 'Not Busy',
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
      level: 'Not Busy',
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
    id: 'arc',
    name: 'Activities and Recreation Center',
    coordinates: {
      latitude: 38.54272,
      longitude: -121.75904
    },
    imageUrl: ArcDetailedCard,
    hours: {
      monday: { open: '6:00 AM', close: '11:30 PM' },
      tuesday: { open: '6:00 AM', close: '11:30 PM' },
      wednesday: { open: '6:00 AM', close: '11:30 PM' },
      thursday: { open: '6:00 AM', close: '11:30 PM' },
      friday: { open: '6:00 AM', close: '10:00 PM' },
      saturday: { open: '8:00 AM', close: '8:00 PM' },
      sunday: { open: '8:00 AM', close: '10:00 PM' }
    },
    currentCapacity: 280,
    maxCapacity: 300,
    features: ['Gym Equipment', 'Pool', 'Basketball Courts'],
    amenities: {
      general: [
        'Gym Equipment',
        'Pool',
        'Basketball Courts'
      ],
      atmosphere: [
        'High energy',
        'Active environment',
        'Multiple workout zones'
      ],
      accessibility: [
        'Wheelchair accessible',
        'ADA-compliant equipment',
        'Elevator access'
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
    id: 'silo',
    name: 'Silo Market',
    coordinates: {
      latitude: 38.53879,
      longitude: -121.75305
    },
    imageUrl: SiloDetailedCard,
    hours: {
      monday: { open: '7:00 AM', close: '5:00 PM' },
      tuesday: { open: '7:00 AM', close: '5:00 PM' },
      wednesday: { open: '7:00 AM', close: '5:00 PM' },
      thursday: { open: '7:00 AM', close: '5:00 PM' },
      friday: { open: '7:00 AM', close: '3:00 PM' },
      saturday: { open: 'Closed', close: 'Closed' },
      sunday: { open: 'Closed', close: 'Closed' }
    },
    currentCapacity: 120,
    maxCapacity: 200,
    features: [
      'Food Court',
      'Study Tables',
      'Coffee Shop',
      'Fast Wi-Fi',
      'Charging Ports',
      'Work Tables',
      'Microwave Station'
    ],
    amenities: {
      general: [
        'Food Court',
        'Study Tables',
        'Coffee Shop',
        'Fast Wi-Fi',
        'Charging Ports',
        'Work Tables',
        'Microwave Station'
      ],
      atmosphere: [
        'Comfortable seating',
        'Collaboration Zones',
        'Mixed-use space'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Ground floor access',
        'Wide pathways'
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
    id: 'mu',
    name: 'Memorial Union',
    coordinates: {
      latitude: 38.54229,
      longitude: -121.74963
    },
    imageUrl: MemorialUnionDetailedCard,
    hours: {
      monday: { open: '7:00 AM', close: '11:00 PM' },
      tuesday: { open: '7:00 AM', close: '11:00 PM' },
      wednesday: { open: '7:00 AM', close: '11:00 PM' },
      thursday: { open: '7:00 AM', close: '11:00 PM' },
      friday: { open: '7:00 AM', close: '11:00 PM' },
      saturday: { open: '9:00 AM', close: '11:00 PM' },
      sunday: { open: '9:00 AM', close: '11:00 PM' }
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
      general: [
        'Food Court',
        'Study Areas',
        'Student Services',
        'Bookstore',
        'Meeting Rooms',
        'Information Desk',
        'ATMs'
      ],
      atmosphere: [
        'Mixed environment',
        'Social spaces',
        'Quiet study areas'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Elevator access',
        'ADA-compliant restrooms'
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