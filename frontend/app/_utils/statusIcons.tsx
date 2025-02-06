import { VeryBusyStatus, FairlyBusyStatus, NotBusyStatus } from "../../assets";

export const getStatusIcon = (crowdInfo: { percentage: number; level: string }) => {
  const busyness = crowdInfo?.percentage || 0;
  
  if (busyness >= 75) {
    return VeryBusyStatus;
  } else if (busyness >= 40) {
    return FairlyBusyStatus;
  } else {
    return NotBusyStatus;
  }
};