const { getJson } = require('serpapi');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');

// Separate caches for weekly and current data
const weeklyCache = new NodeCache({
  stdTTL: 7 * 24 * 60 * 60, // 1 week
  checkperiod: 24 * 60 * 60  // Check daily
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Location mapping for accurate API searches
const locations = {
  'silo': 'UC Davis Silo Market',
  'arc': 'UC Davis Activities Recreation Center',
  'mu': 'UC Davis Memorial Union Coffee House',
  'library': 'UC Davis Peter J. Shields Library',
  // Numeric fallbacks
  '1': 'UC Davis Peter J. Shields Library',
  '2': 'UC Davis Memorial Union Coffee House',
  '3': 'UC Davis Activities Recreation Center',
  '4': 'UC Davis Silo Market'
};

const cache = new Map();
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

function getSearchQuery(locationId) {
  // Convert locationId to string and handle numeric IDs
  const id = locationId.toString().toLowerCase();
  
  console.log('markerController: Looking up location:', id, 'in:', Object.keys(locations));
  const query = locations[id];
  
  if (!query) {
    console.log('markerController: No matching location found for ID:', id);
    return null;
  }
  
  console.log('markerController: Found matching query:', query);
  return query;
}

const getLocationData = async (locationName) => {
  // Check if we have valid cached data
  const cachedData = cache.get(locationName);
  if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
    console.log(`markerController: Using cached data for ${locationName}`);
    return cachedData.data;
  }

  // If not in cache or expired, fetch new data
  console.log(`markerController: Fetching fresh data for ${locationName}`);
  try {
    const data = await fetchLocationData(locationName); // Your existing fetch function
    
    // Store in cache with timestamp
    cache.set(locationName, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${locationName}:`, error);
    // If fetch fails but we have cached data (even if expired), use it as fallback
    if (cachedData) {
      console.log(`markerController: Using expired cache as fallback for ${locationName}`);
      return cachedData.data;
    }
    throw error;
  }
};

exports.getLocationData = async (req, res) => {
  const { locationId } = req.params;
  
  try {
    // Check weekly cache first
    const cachedData = weeklyCache.get(locationId);
    if (cachedData) {
      // Update only the current status for cached data
      const currentStatus = await getCurrentStatus(cachedData.knowledge_graph);
      
      return res.json({
        ...cachedData,
        currentStatus
      });
    }

    // Fetch new data if not cached
    const results = await getJson({
      api_key: process.env.SERPAPI_KEY,
      engine: "google",
      q: getSearchQuery(locationId),
      location: "Davis, California, United States",
      hl: "en",
      gl: "us",
      type: "place"
    });

    if (!results?.knowledge_graph) {
      throw new Error('Invalid SERPAPI response');
    }

    // Process and split the data
    const processedData = {
      // Weekly data
      hours: processHours(results.knowledge_graph.hours),
      weeklyBusyness: processWeeklyBusyness(results.knowledge_graph.popular_times),
      
      // Current status
      currentStatus: getCurrentStatus(results.knowledge_graph)
    };

    // Cache weekly data
    weeklyCache.set(locationId, {
      hours: processedData.hours,
      weeklyBusyness: processedData.weeklyBusyness
    });

    res.json(processedData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json(getErrorResponse());
  }
};

exports.testLocationData = async (req, res) => {
  // Add your test endpoint logic here
  res.json({ message: 'Test endpoint working' });
};

// Helper functions
function getUntilText(hours) {
  if (!hours) return '';
  
  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase().slice(0, 3);
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  const todayHours = hours[currentDay];
  if (!todayHours) return '';
  
  // Convert time strings to 24-hour format
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return null;
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const openTime = convertTo24Hour(todayHours.opens);
  const closeTime = convertTo24Hour(todayHours.closes);
  
  if (!openTime || !closeTime) return '';
  
  // Location is currently open
  if (currentHour > openTime.hours || 
      (currentHour === openTime.hours && currentMinutes >= openTime.minutes)) {
    return `Until ${todayHours.closes}`;
  }
  
  // Location will open later today
  return `Opens ${todayHours.opens}`;
}

function isLocationCurrentlyOpen(hours) {
  if (!hours) return false;
  const now = new Date();
  const day = now.toLocaleLowerCase().slice(0, 3);
  const currentHours = hours[day];
  if (!currentHours) return false;
  
  // Convert current time to minutes since midnight
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Convert opening hours to minutes since midnight
  const convertTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };
  
  const openMinutes = convertTimeToMinutes(currentHours.opens);
  const closeMinutes = convertTimeToMinutes(currentHours.closes);
  
  if (!openMinutes || !closeMinutes) return false;
  
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

function calculateCurrentCapacity(busynessScore) {
  if (!busynessScore) return 0;
  return Math.floor(busynessScore * 1.44); // Converts percentage to estimated number of people
}

function getMaxCapacity(locationId) {
  const capacities = {
    'library': 144,
    'arc': 300,
    'silo': 200,
    'mu': 300
  };
  return capacities[locationId] || 200;
}

function getBusyStatusText(busynessScore) {
  if (!busynessScore) return 'Not Busy';
  if (busynessScore <= 30) return 'Not Busy';
  if (busynessScore <= 65) return 'Fairly Busy';
  return 'Very Busy';
}

function calculateBestTimes(weeklyData) {
  // Add implementation to find best and worst times
  return {
    best: '2pm - 4pm',
    worst: '11:30am - 1:30pm'
  };
}

exports.getBulkLocationData = async (req, res) => {
  try {
    console.log('Bulk data request received');
    const locationIds = ['library', 'mu', 'arc', 'silo'];
    const results = {};
    
    for (const id of locationIds) {
      // Use the existing getSearchQuery function
      const searchQuery = getSearchQuery(id);
      if (!searchQuery) continue;

      // Check cache first
      const cachedData = cache.get(id);
      if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
        console.log(`Using cached data for ${id}`);
        results[id] = cachedData.data;
        continue;
      }

      // Fetch if not cached
      console.log(`Fetching fresh data for ${id}`);
      const data = await getJson({
        api_key: process.env.SERPAPI_KEY,
        engine: "google",
        q: searchQuery,
        location: "Davis, California, United States",
        hl: "en",
        gl: "us",
        type: "place"
      });

      if (!data?.knowledge_graph) {
        console.log(`No data found for ${id}`);
        continue;
      }

      const processedData = {
        hours: processHours(data.knowledge_graph.hours),
        weeklyBusyness: processWeeklyBusyness(data.knowledge_graph.popular_times),
        currentStatus: getCurrentStatus(data.knowledge_graph)
      };

      // Cache the processed data
      cache.set(id, {
        data: processedData,
        timestamp: Date.now()
      });

      results[id] = processedData;
    }
    
    console.log('Sending bulk data response');
    res.json(results);
  } catch (error) {
    console.error('Bulk fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch bulk location data' });
  }
};

function getCurrentStatus(data) {
  return {
    statusText: getBusyStatusText(data?.popular_times?.live?.busyness_score),
    currentCapacity: {
      current: calculateCurrentCapacity(data?.popular_times?.live?.busyness_score),
      percentage: data?.popular_times?.live?.busyness_score || 0
    },
    description: data?.popular_times?.live?.info || "No current data",
    untilText: getUntilText(data?.hours || {})
  };
}

function processHours(hours) {
  if (!hours) return {};
  return Object.entries(hours).reduce((acc, [day, times]) => {
    acc[day.toLowerCase()] = {
      open: times.opens,
      close: times.closes
    };
    return acc;
  }, {});
}

function processWeeklyBusyness(popularTimes) {
  if (!popularTimes?.graph_results) return {};
  return Object.entries(popularTimes.graph_results).reduce((acc, [day, hours]) => {
    acc[day.toLowerCase()] = hours.map(hour => ({
      time: hour.time,
      busyness: hour.busyness_score || 0,
      description: getBusyStatusText(hour.busyness_score)
    }));
    return acc;
  }, {});
}

function getErrorResponse() {
  return {
    error: 'Failed to fetch location data',
    hours: {},
    currentStatus: {
      statusText: 'Unknown',
      currentCapacity: { current: 0, percentage: 0 },
      description: 'Service temporarily unavailable',
      untilText: ''
    },
    weeklyBusyness: {}
  };
}
