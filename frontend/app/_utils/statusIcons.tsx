import { VeryBusyStatus, FairlyBusyStatus, NotBusyStatus } from "../../assets";
import type { BusyStatus } from "../types/location";

export const getStatusIcon = (status: BusyStatus) => {
  switch (status) {
    case 'Very Busy':
      return VeryBusyStatus;
    case 'Fairly Busy':
      return FairlyBusyStatus;
    case 'Not Busy':
      return NotBusyStatus;
    default:
      return NotBusyStatus; // fallback
  }
};