import {
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
  NoisyGrey,
  SportsEquipmentGrey,
  StudySpacesGrey,
} from '../../assets';

export interface AmenityIcon {
  icon: any; // Replace 'any' with proper SVG type if available
  label: string;
}

export const amenityIconMap: Record<string, AmenityIcon> = {
  // General Amenities
  'Charging Ports': { icon: ChargingGrey, label: 'Charging Ports' },
  'Study Rooms': { icon: StudyRoomsGrey, label: 'Study Rooms' },
  'Fast Wi-Fi': { icon: FastWifiGrey, label: 'Fast Wi-Fi' },
  'Projector': { icon: ProjectorGrey, label: 'Projector' },
  'Printers': { icon: PrinterGrey, label: 'Printers' },
  '24 Hour Study Room': { icon: StudyGrey, label: '24 Hour Study Room' },
  'Study Cages': { icon: StudyCagesGrey, label: 'Study Cages' },
  'Food Court': { icon: FoodGrey, label: 'Food Court' },
  'Coffee Shop': { icon: DiningGrey, label: 'Coffee Shop' },
  'Computers': { icon: ComputersGrey, label: 'Computers' },
  'Whiteboards': { icon: WhiteboardsGrey, label: 'Whiteboards' },
  'Work Tables': { icon: WorkTablesGrey, label: 'Work Tables' },
  'Gym Equipment': { icon: GymGrey, label: 'Gym Equipment' },
  'Games': { icon: GamesGrey, label: 'Games' },

  // Atmosphere
  'Generally quiet': { icon: QuietAreasGrey, label: 'Quiet Areas' },
  'Noisy areas': { icon: NoisyGrey, label: 'Noisy Areas' },
  'Collaboration zones': { icon: CollaborativeGrey, label: 'Collaboration Zones' },
  'Comfortable seating': { icon: ComfortableSeatingGrey, label: 'Comfortable Seating' },

  // Sports & Recreation
  'Sports Equipment': { icon: SportsEquipmentGrey, label: 'Sports Equipment' },
  
  // Study Spaces
  'Study Spaces': { icon: StudySpacesGrey, label: 'Study Spaces' },

  // Accessibility
  'Wheelchair accessible': { icon: WheelchairGrey, label: 'Wheelchair Accessible' },
  'Braille signage': { icon: BrailleGrey, label: 'Braille Signage' },
  'ADA-compliant main entrance': { icon: ADAGrey, label: 'ADA Compliant' },
};

export const getAmenityIcon = (amenityName: string): AmenityIcon | undefined => {
  return amenityIconMap[amenityName];
}; 