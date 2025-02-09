const { getJson } = require('serpapi');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');

// Server-side cache with longer TTL
const cache = new NodeCache({
  stdTTL: 24 * 60 * 60, // 1 day default
  checkperiod: 60 * 60   // Check for expired keys every hour
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

exports.getLocationData = async (req, res) => {
  const { locationId } = req.params;
  
  try {
    // Check cache first
    const cachedData = cache.get(locationId);
    if (cachedData) {
      console.log('Serving cached data for:', locationId);
      return res.json(cachedData);
    }

    // Get proper search query for the location
    const searchQuery = getSearchQuery(locationId);
    if (!searchQuery) {
      throw new Error(`Invalid location ID: ${locationId}`);
    }

    // Fetch new data if not cached
    const results = await getJson({
      api_key: process.env.SERPAPI_KEY,
      engine: "google",
      q: searchQuery,
      location: "Davis, California, United States",
      hl: "en",
      gl: "us",
      type: "place"
    });

    // Process the results to match LocationDynamic interface
    const processedData = {
      hours: Object.entries(results.knowledge_graph?.hours || {}).reduce((acc, [day, times]) => {
        acc[day.toLowerCase()] = {
          open: times.opens,
          close: times.closes
        };
        return acc;
      }, {}),

      currentStatus: {
        busyness: results.knowledge_graph?.popular_times?.live?.busyness_score || 0,
        description: results.knowledge_graph?.popular_times?.live?.info || "No current data",
        typicalDuration: results.knowledge_graph?.popular_times?.live?.typical_time_spent || "Unknown",
        isOpen: isLocationCurrentlyOpen(results.knowledge_graph?.hours || {}),
        currentCapacity: {
          current: calculateCurrentCapacity(results.knowledge_graph?.popular_times?.live?.busyness_score),
          total: getMaxCapacity(locationId),
          percentage: results.knowledge_graph?.popular_times?.live?.busyness_score || 0
        },
        statusText: getBusyStatusText(results.knowledge_graph?.popular_times?.live?.busyness_score),
        untilText: getUntilText(results.knowledge_graph?.hours || {})
      },

      weeklyBusyness: Object.entries(results.knowledge_graph?.popular_times?.graph_results || {}).reduce((acc, [day, hours]) => {
        acc[day.toLowerCase()] = hours.map(hour => ({
          time: hour.time,
          busyness: hour.busyness_score || 0,
          description: hour.info || getBusyStatusText(hour.busyness_score)
        }));
        return acc;
      }, {}),

      bestTimes: calculateBestTimes(results.knowledge_graph?.popular_times?.graph_results || {})
    };

    // Cache the processed data
    cache.set(locationId, processedData);
    
    res.json(processedData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper functions
function isLocationCurrentlyOpen(hours) {
  const now = new Date();
  const day = now.toLocaleLowerCase();
  const currentHours = hours[day];
  // Add implementation
  return true; // Placeholder
}

function calculateCurrentCapacity(busynessScore) {
  // Add implementation based on your capacity logic
  return Math.floor((busynessScore || 0) * 1.44); // Placeholder
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
