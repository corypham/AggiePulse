const axios = require('axios');
const cache = require('../utils/cache');

// Add debug logging for environment variables
console.log('Environment Variables Check:');
console.log('SHIELDS_MAIN_URL:', process.env.SHIELDS_MAIN_URL);
console.log('STUDY_ROOM_URL:', process.env.STUDY_ROOM_URL);

// Use environment variables instead of hardcoded URLs
const SHIELDS_MAIN_URL = process.env.SHIELDS_MAIN_URL;
const STUDY_ROOM_URL = process.env.STUDY_ROOM_URL;
const CACHE_KEY = 'library_occupancy';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const LibraryOccupancyService = {
  async getOccupancyData() {
    // Verify that environment variables are set
    if (!SHIELDS_MAIN_URL || !STUDY_ROOM_URL) {
      console.error('Missing environment variables:');
      console.error('SHIELDS_MAIN_URL:', SHIELDS_MAIN_URL);
      console.error('STUDY_ROOM_URL:', STUDY_ROOM_URL);
      throw new Error('Library API endpoints not configured');
    }

    // Check cache first
    const cachedData = await cache.get(CACHE_KEY);
    if (cachedData) {
      console.log('Using cached library occupancy data');
      return cachedData;
    }

    try {
      console.log('Fetching fresh library occupancy data...');
      const [mainResponse, studyRoomResponse] = await Promise.all([
        axios.get(SHIELDS_MAIN_URL),
        axios.get(STUDY_ROOM_URL)
      ]);

      // Log raw responses for debugging
      console.log('Raw responses:', {
        main: mainResponse.data,
        studyRoom: studyRoomResponse.data
      });

      // Handle the actual number values from the API
      const mainCount = typeof mainResponse.data === 'number' ? mainResponse.data : 0;
      const studyRoomCount = typeof studyRoomResponse.data === 'number' ? studyRoomResponse.data : 0;

      const data = {
        main: {
          count: mainCount,
          capacity: 3000,
          percentage: Math.round((mainCount / 3000) * 100)
        },
        studyRoom: {
          count: studyRoomCount,
          capacity: 500,
          percentage: Math.round((studyRoomCount / 500) * 100)
        }
      };

      console.log('Processed library data:', data);
      await cache.set(CACHE_KEY, data, CACHE_DURATION);
      return data;
    } catch (error) {
      console.error('Error fetching library occupancy:', error);
      // Return default data instead of throwing
      return {
        main: {
          count: 0,
          capacity: 3000,
          percentage: 0
        },
        studyRoom: {
          count: 0,
          capacity: 500,
          percentage: 0
        }
      };
    }
  }
};

module.exports = LibraryOccupancyService; 