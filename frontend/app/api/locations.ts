import Constants from 'expo-constants';

const API_URL = 'http://localhost:3000/api';  // Update with your actual API URL

export interface CrowdData {
  currentStatus: {
    busyness: number;
    description: string;
    typicalDuration: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  weeklyBusyness: {
    [key: string]: Array<any>; // Update this type based on your weekly busyness data structure
  };
}

export const fetchLocationData = async (locationId: string): Promise<CrowdData> => {
  try {
    const response = await fetch(`${API_URL}/locations/${locationId}/crowd-data`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
};

export const fetchAllLocations = async () => {
  try {
    const response = await fetch(`${API_URL}/locations`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all locations:', error);
    throw error;
  }
};

interface APIResponse {
  // ... other fields
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

export const fetchLocationDetails = async (locationId: string) => {
  try {
    const response = await fetch(`${API_URL}/locations/${locationId}`);
    const data: APIResponse = await response.json();

    // Ensure hours data is properly structured
    const processedHours = {
      monday: data.hours?.monday || null,
      tuesday: data.hours?.tuesday || null,
      wednesday: data.hours?.wednesday || null,
      thursday: data.hours?.thursday || null,
      friday: data.hours?.friday || null,
      saturday: data.hours?.saturday || null,
      sunday: data.hours?.sunday || null,
    };

    return {
      ...data,
      hours: processedHours
    };
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}; 