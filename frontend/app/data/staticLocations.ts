import { Location, FilterCategory, BusyStatus } from '../types/location';
import { LocationStatic } from '../types/location';

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

export const staticLocations: Record<string, LocationStatic> = {
  'library': {
    id: 'library',
    title: 'Peter J. Shields Library',
    coordinates: {
      latitude: 38.5395,
      longitude: -121.7489
    },
    imageUrl: LibraryDetailedCard,
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
    type: ['study'],
    icons: {
      blue: StudySpacesBlue,
      white: StudyWhite,
      grey: StudyGrey,
      black: StudyBlack,
      selected: StudySelected,
      unselected: StudyUnselected
    }
  },
  'arc': {
    id: 'arc',
    title: 'Activities and Recreation Center',
    coordinates: {
      latitude: 38.54272,
      longitude: -121.75904
    },
    imageUrl: ArcDetailedCard,
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
    type: ['gym'],
    icons: {
      blue: GymBlue,
      white: GymWhite,
      grey: GymGrey,
      black: GymBlack,
      selected: GymSelected,
      unselected: GymUnselected
    }
  },
  'silo': {
    id: 'silo',
    title: 'Silo Market',
    coordinates: {
      latitude: 38.53879,
      longitude: -121.75305
    },
    imageUrl: SiloDetailedCard,
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
    type: ['dining', 'study'],
    icons: {
      blue: DiningBlue,
      white: DiningWhite,
      grey: DiningGrey,
      black: DiningBlack,
      selected: DiningSelected,
      unselected: DiningUnselected
    }
  },
  'mu': {
    id: 'mu',
    title: 'Memorial Union CoHo',
    coordinates: {
      latitude: 38.54229,
      longitude: -121.74963
    },
    imageUrl: MemorialUnionDetailedCard,
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
    type: ['dining', 'study'],
    icons: {
      blue: DiningBlue,
      white: DiningWhite,
      grey: DiningGrey,
      black: DiningBlack,
      selected: DiningSelected,
      unselected: DiningUnselected
    }
  }
}; 