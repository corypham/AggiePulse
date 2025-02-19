import {
  // Location Type Icons
  StudySelected,
  StudyUnselected,
  DiningSelected,
  DiningUnselected,
  GymSelected,
  GymUnselected,
  StudyWhite,
  DiningWhite,
  GymWhite,

  // Busyness Icons
  NotBusySelected,
  NotBusyUnselected,
  ModeratelyBusySelected,
  ModeratelyBusyUnselected,
  VeryBusySelected,
  VeryBusyUnselected,
  NotBusyWhite,
  FairlyBusyWhite,
  VeryBusyWhite,

  // Amenity Icons
  FoodSelected,
  FoodUnselected,
  ComputersSelected,
  ComputersUnselected,
  ChargingPortsSelected,
  ChargingPortsUnselected,
  PrinterSelected,
  PrinterUnselected,
  FastWIFISelected,
  FastWIFIUnselected,
  StudyRoomsSelected,
  StudyRoomsUnselected,
  ProjectorSelected,
  ProjectorUnselected,
  WorkTablesSelected,
  WorkTablesUnselected,
  FoodWhite,
  ComputersWhite,
  ChargingPortsWhite,
  PrinterWhite,
  StudyRoomsWhite,
  ProjectorWhite,
  WorkTablesWhite,

  // Accessibility Icons
  WheelchairAccessibleUnselected,
  ADACompliantSelected,
  ADACompliantUnselected,
  BrailleSignageSelected,
  BrailleSignageUnselected,
  WheelchairAccessibleWhite,
  ADACompliantWhite,
  BrailleSignageWhite,
} from '../../assets';

export const getFilterIcon = (id: string, isSelected: boolean) => {
  const iconMapping: { [key: string]: any } = {
    // Location Types
    'study': isSelected ? StudyWhite : StudyUnselected,
    'dining': isSelected ? DiningWhite : DiningUnselected,
    'gym': isSelected ? GymWhite : GymUnselected,

    // Busyness
    'not-busy': isSelected ? NotBusyWhite : NotBusyUnselected,
    'fairly-busy': isSelected ? FairlyBusyWhite : ModeratelyBusyUnselected,
    'very-busy': isSelected ? VeryBusyWhite : VeryBusyUnselected,

    // Amenities
    'food': isSelected ? FoodWhite : FoodUnselected,
    'computers': isSelected ? ComputersWhite : ComputersUnselected,
    'charging-ports': isSelected ? ChargingPortsWhite : ChargingPortsUnselected,
    'printers': isSelected ? PrinterWhite : PrinterUnselected,
    'study-rooms': isSelected ? StudyRoomsWhite : StudyRoomsUnselected,
    'projectors': isSelected ? ProjectorWhite : ProjectorUnselected,
    'work-tables': isSelected ? WorkTablesWhite : WorkTablesUnselected,

    // Accessibility
    'wheelchair-accessible': isSelected ? WheelchairAccessibleWhite : WheelchairAccessibleUnselected,
    'ada-compliant-entrances': isSelected ? ADACompliantWhite : ADACompliantUnselected,
    'braille-signage': isSelected ? BrailleSignageWhite : BrailleSignageUnselected,
  };

  return iconMapping[id.toLowerCase()];
}; 