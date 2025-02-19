import { SafeSpaceData } from '../types/safespace';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';

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

      console.log('[SafeSpaceService] Fetching fresh data');
      const response = await fetch(`${API_BASE_URL}/locations/library/safespace?refresh=true`);
      
      if (!response.ok) {
        throw new Error(`SafeSpace API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[SafeSpaceService] Data received:', data);

      // Update cache
      cachedData = data;
      lastFetchTime = now;

      return data;
    } catch (error) {
      console.error('[SafeSpaceService] Error:', error);
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