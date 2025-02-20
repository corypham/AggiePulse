import { SafeSpaceData } from '../types/safespace';

// Hard code the production URL since we're using Render now
const API_BASE_URL = 'https://aggiepulse.onrender.com/api';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

let lastFetchTime: number | null = null;
let cachedData: SafeSpaceData | null = null;

export const SafeSpaceService = {
  async getOccupancyData(forceRefresh: boolean = false): Promise<SafeSpaceData | null> {
    try {
      const now = Date.now();
      
      // Return cached data if it's fresh and not forcing refresh
      if (!forceRefresh && cachedData && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
        console.log('[SafeSpaceService] Using cached data');
        return cachedData;
      }

      // Updated endpoint to match backend
      console.log('[SafeSpaceService] Fetching from:', `${API_BASE_URL}/locations/library/crowd-data`);
      const response = await fetch(`${API_BASE_URL}/locations/library/crowd-data`);
      
      if (!response.ok) {
        throw new Error(`SafeSpace API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[SafeSpaceService] Data received:', data);

      // Extract realTimeOccupancy data from the response
      const realTimeOccupancy = data.currentStatus?.realTimeOccupancy;

      // Transform the data to match SafeSpaceData type
      const transformedData: SafeSpaceData = {
        mainBuilding: {
          count: realTimeOccupancy?.mainBuilding?.count || 0,
          capacity: realTimeOccupancy?.mainBuilding?.capacity || 3000,
          percentage: realTimeOccupancy?.mainBuilding?.percentage || 0
        },
        studyRoom: {
          count: realTimeOccupancy?.studyRoom?.count || 0,
          capacity: realTimeOccupancy?.studyRoom?.capacity || 500,
          percentage: realTimeOccupancy?.studyRoom?.percentage || 0
        }
      };

      console.log('[SafeSpaceService] Transformed data:', transformedData);

      // Update cache
      cachedData = transformedData;
      lastFetchTime = now;

      return transformedData;
    } catch (error) {
      console.error('[SafeSpaceService] Error:', error);
      // Return cached data if available, even if stale
      if (cachedData) {
        console.log('[SafeSpaceService] Returning stale cached data due to error');
        return cachedData;
      }
      return null;
    }
  },

  // Method to force a refresh
  async forceRefresh(): Promise<SafeSpaceData | null> {
    return this.getOccupancyData(true);
  },

  // Method to check if data is stale
  isStale(): boolean {
    if (!lastFetchTime) return true;
    return Date.now() - lastFetchTime >= CACHE_DURATION;
  },

  // Clear cache (useful for app refresh)
  clearCache(): void {
    lastFetchTime = null;
    cachedData = null;
  }
}; 