import { Location, FilterCategory, BusyStatus } from '../types/location';
import { LocationStatic } from '../types/location';

import {
  LibraryDetailedCard,
  ArcDetailedCard,
  SiloDetailedCard,
  MemorialUnionDetailedCard,
  TwentyFourHourStudyRoomDetailedCard,
  GamesDetailedCard,
  MuCohoDetailedCard,
  CuartoDcDetailedCard,
  LattitudeDetailedCard,
  SegundoDcDetailedCard,
  TerceroDcDetailedCard,

  // Blue icons
  StudySpacesBlue,
  GymBlue,
  DiningBlue,
  GamesBlue,
  // White icons
  StudyWhite,
  GymWhite,
  DiningWhite,
  GamesWhite,
  
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
      latitude: 38.53961702615496,
      longitude: -121.74971841834478
    },
    imageUrl: LibraryDetailedCard,
    maxCapacity: 3000,
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
      latitude: 38.54271825116285,
      longitude:  -121.75908425253886
    },
    imageUrl: ArcDetailedCard,
    maxCapacity: 2500,
    features: ['Gym Equipment', 'Pool', 'Basketball Courts'],
    amenities: {
      general: [
        'Gym Equipment',
        'Pool',
        'Basketball Courts',
        'Sports Equipment',
        'Study Rooms',
        'Fast Wi-Fi',
        'Food Court',
        'Coffee Shop',
        'Charging Ports'
      ],
      atmosphere: [
        'Noisy areas',
        'Collaboration zones',
        'Comfortable seating'
      ],
      accessibility: [
        'Wheelchair accessible',
        'ADA-compliant equipment',
        'Braille signage'
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
    maxCapacity: 600,
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
        'Noisy areas'
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
      latitude: 38.54206770848346,
      longitude: -121.74975695063387
    },
    imageUrl: MuCohoDetailedCard,
    maxCapacity: 800,
    features: [
      'Food Court',
      'Coffee Shop',
      'Study Areas',
      'Student Services',
      'Bookstore',
      'Meeting Rooms',
      'Information Desk',
      'ATMs',
      'Charging Ports',
      'Fast Wi-Fi'
    ],
    amenities: {
      general: [
        'Food Court',
        'Study Areas',
        'Student Services',
        'Bookstore',
        'Meeting Rooms',
        'Information Desk',
        'ATMs',
        'Charging Ports',
        'Fast Wi-Fi'
      ],
      atmosphere: [
        'Noisy areas',
        'Collaboration zones',
        'Comfortable seating'
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
  },
  '24hr': {
    id: '24hr',
    title: '24 Hour Study Room',
    coordinates: {
      latitude: 38.540133390771366,
      longitude: -121.74939432950403
    },
    imageUrl: TwentyFourHourStudyRoomDetailedCard,
    maxCapacity: 200,
    features: [
      'Open 24/7',
      'Charging Ports',
      'Fast Wi-Fi',
      'Study Tables',
      'Comfortable Seating',
      'Quiet Study Space'
    ],
    amenities: {
      general: [
        'Open 24/7',
        'Charging Ports',
        'Fast Wi-Fi',
        'Study Tables',
        'Vending Machines'
      ],
      atmosphere: [
        'Generally quiet',
        'Individual study spaces',
        'Comfortable seating'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Ground floor access',
        'ADA-compliant entrance'
      ]
    },
    description: 'A dedicated 24-hour study space providing students with a quiet environment for late-night studying and academic work.',
    type: ['study'],
    icons: {
      blue: StudySpacesBlue,
      white: StudyWhite,
      grey: StudyGrey,
      black: StudyBlack,
      selected: StudySelected,
      unselected: StudyUnselected
    },
    is24Hours: true,
    hasSafeSpace: true
  },
  'games': {
    id: 'games',
    title: 'Games Area',
    coordinates: {
      latitude: 38.54252901081, 
      longitude: -121.74939379688
    },
    imageUrl: GamesDetailedCard,
    maxCapacity: 150,
    features: [
      'Pool Tables',
      'Gaming Consoles',
      'Board Games',
      'Table Tennis',
      'Arcade Games',
      'Comfortable Seating',
      'Fast Wi-Fi'
    ],
    amenities: {
      general: [
        'Pool Tables',
        'Gaming Consoles',
        'Board Games',
        'Table Tennis',
        'Arcade Games',
        'Fast Wi-Fi',
        'Charging Ports'
      ],
      atmosphere: [
        'Social space',
        'Casual environment',
        'Comfortable seating'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Ground floor access',
        'Wide pathways'
      ]
    },
    description: 'A recreational space in the Memorial Union offering various gaming options including pool tables, video games, and table tennis for students to unwind and socialize.',
    type: ['games'],
    icons: {
      blue: GamesBlue,
      white: GamesWhite,
      black: StudyBlack,
      grey: GamesGrey,
      selected: StudySelected,
      unselected: StudyUnselected
    }
  },
  'cuarto': {
    id: 'cuarto',
    title: 'Cuarto Dining Commons',
    coordinates: {
      latitude: 38.54737219120042, 
      longitude: -121.76334267771574
    },
    imageUrl: CuartoDcDetailedCard,
    maxCapacity: 300,
    features: [
      'Charging Ports',
      'Fast Wi-Fi',
      'Work Tables',
      'Food Court',
      'Coffee Shop',
      'Comfortable seating'
    ],
    amenities: {
      general: [
        'Charging Ports',
        'Fast Wi-Fi',
        'Work Tables',
        'Food Court',
        'Coffee Shop'
      ],
      atmosphere: [
        'Collaboration zones',
        'Comfortable seating'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Braille signage',
        'ADA-compliant main entrance'
      ]
    },
    description: 'Cuarto Dining Commons serves diverse meal options in a modern dining facility, catering to various dietary preferences and restrictions.',
    type: ['dining'],
    icons: {
      blue: DiningBlue,
      white: DiningWhite,
      grey: DiningGrey,
      black: DiningBlack,
      selected: DiningSelected,
      unselected: DiningUnselected
    }
  },
  'latitude': {
    id: 'latitude',
    title: 'Latitude Dining Commons',
    coordinates: {
      latitude: 38.5379139787125, 
      longitude: -121.75622004703732
    },
    imageUrl: LattitudeDetailedCard,
    maxCapacity: 600,
    features: [
      'Charging Ports',
      'Fast Wi-Fi',
      'Work Tables',
      'Food Court',
      'Study Spaces',
      'Comfortable seating'
    ],
    amenities: {
      general: [
        'Charging Ports',
        'Fast Wi-Fi',
        'Work Tables',
        'Food Court',
        'Study Spaces'
      ],
      atmosphere: [
        'Noisy areas',
        'Collaboration zones',
        'Comfortable seating'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Braille signage',
        'ADA-compliant main entrance'
      ]
    },
    description: 'Latitude offers a global dining experience with cuisine from around the world in a modern, marketplace-style setting.',
    type: ['dining'],
    icons: {
      blue: DiningBlue,
      white: DiningWhite,
      grey: DiningGrey,
      black: DiningBlack,
      selected: DiningSelected,
      unselected: DiningUnselected
    }
  },
  'segundo': {
    id: 'segundo',
    title: 'Segundo Dining Commons',
    coordinates: {
      latitude: 38.54407344397456, 
      longitude: -121.75812815968732
    },
    imageUrl: SegundoDcDetailedCard,
    maxCapacity: 800,
    features: [
      'Charging Ports',
      'Fast Wi-Fi',
      'Work Tables',
      'Food Court',
      'Study Spaces',
      'Comfortable seating'
    ],
    amenities: {
      general: [
        'Charging Ports',
        'Fast Wi-Fi',
        'Work Tables',
        'Food Court',
        'Study Spaces'
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
    description: 'Segundo Dining Commons provides a variety of fresh, healthy options in a spacious and welcoming environment.',
    type: ['dining'],
    icons: {
      blue: DiningBlue,
      white: DiningWhite,
      grey: DiningGrey,
      black: DiningBlack,
      selected: DiningSelected,
      unselected: DiningUnselected
    }
  },
  'tercero': {
    id: 'tercero',
    title: 'Tercero Dining Commons',
    coordinates: {
      latitude: 38.53609032877397, 
      longitude: -121.75735647656117
    },
    imageUrl: TerceroDcDetailedCard,
    maxCapacity: 700,
    features: [
      'Charging Ports',
      'Fast Wi-Fi',
      'Work Tables',
      'Food Court',
      'Study Spaces',
      'Comfortable seating'
    ],
    amenities: {
      general: [
        'Charging Ports',
        'Fast Wi-Fi',
        'Work Tables',
        'Food Court',
        'Study Spaces'
      ],
      atmosphere: [
        'Noisy areas',
        'Collaboration zones',
        'Comfortable seating'
      ],
      accessibility: [
        'Wheelchair accessible',
        'Braille signage',
        'ADA-compliant main entrance'
      ]
    },
    description: 'Tercero Dining Commons offers sustainable dining options in a contemporary setting, featuring both indoor and outdoor seating areas.',
    type: ['dining'],
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