const { getJson } = require('serpapi');
const NodeCache = require('node-cache');

// Server-side cache
const cache = new NodeCache({
  stdTTL: 24 * 60 * 60, // 1 day default
  checkperiod: 60 * 60   // Check for expired keys every hour
});

exports.getLocationData = async (req, res) => {
  const { locationId } = req.params;
  
  try {
    // Check cache first
    const cachedData = cache.get(locationId);
    if (cachedData) {
      console.log('Serving cached data for:', locationId);
      return res.json(cachedData);
    }

    // Fetch new data if not cached
    const searchQuery = getSearchQuery(locationId);
    const results = await getJson({
      api_key: process.env.SERPAPI_KEY,
      engine: "google",
      q: searchQuery,
      location: "Davis, California, United States",
      hl: "en",
      gl: "us",
      type: "place"
    });

    // Process and cache the results
    const processedData = {
      currentStatus: {
        busyness: results.knowledge_graph?.popular_times?.live?.busyness_score || 0,
        description: results.knowledge_graph?.popular_times?.live?.info || "No current data",
        typicalDuration: results.knowledge_graph?.popular_times?.live?.typical_time_spent || "Unknown"
      },
      hours: Object.entries(results.knowledge_graph?.hours || {}).reduce((acc, [day, times]) => {
        acc[day.toLowerCase()] = {
          open: times.opens,
          close: times.closes
        };
        return acc;
      }, {}),
      weeklyBusyness: Object.entries(results.knowledge_graph?.popular_times?.graph_results || {}).reduce((acc, [day, hours]) => {
        acc[day.toLowerCase()] = hours.map(hour => ({
          time: hour.time,
          busyness: hour.busyness_score || 0,
          description: hour.info || ''
        }));
        return acc;
      }, {})
    };

    // Cache the processed data
    cache.set(locationId, processedData);

    res.json(processedData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

function getSearchQuery(locationId) {
  // Convert locationId to string and handle numeric IDs
  const id = locationId.toString().toLowerCase();
  
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
  
  console.log('markerController: Looking up location:', id, 'in:', Object.keys(locations));
  const query = locations[id];
  
  if (!query) {
    console.log('markerController: No matching location found for ID:', id);
    return null;
  }
  
  console.log('markerController: Found matching query:', query);
  return query;
}
