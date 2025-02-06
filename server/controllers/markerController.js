const { getJson } = require('serpapi');

exports.getLocationData = async (req, res) => {
  const { locationId } = req.params;
  
  try {
    console.log('markerController: Received request for locationId:', locationId);
    console.log('markerController: SERPAPI_KEY value:', process.env.SERPAPI_KEY?.slice(0, 5) + '...');
    
    if (!process.env.SERPAPI_KEY) {
      throw new Error('SERPAPI_KEY is not configured');
    }

    const searchQuery = getSearchQuery(locationId);
    console.log('markerController: Search query:', searchQuery);
    
    const params = {
      api_key: process.env.SERPAPI_KEY,
      engine: "google",
      q: searchQuery,
      location: "Davis, California, United States",
      hl: "en",
      gl: "us",
      type: "place"
    };
    
    console.log('markerController: Fetching data with params:', { ...params, api_key: '[REDACTED]' });

    const results = await getJson(params);
    console.log('markerController: Raw results received:', {
      hasKnowledgeGraph: !!results.knowledge_graph,
      hasPopularTimes: !!results.knowledge_graph?.popular_times,
      hasHours: !!results.knowledge_graph?.hours
    });
    
    if (!results.knowledge_graph) {
      console.log('markerController: No knowledge graph data found');
      return res.status(404).json({ 
        error: 'Location data not found',
        locationId 
      });
    }

    const response = {
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

    console.log('Sending formatted response:', {
      currentStatus: response.currentStatus,
      hoursAvailable: !!Object.keys(response.hours).length,
      daysWithData: Object.keys(response.weeklyBusyness)
    });

    res.json(response);
  } catch (error) {
    console.error('markerController Error:', error);
    res.status(500).json({ 
      error: error.message,
      locationId 
    });
  }
};

function getSearchQuery(locationId) {
  // Convert locationId to string and handle numeric IDs
  const id = locationId.toString();
  
  const locations = {
    '1': 'UC Davis shields library',
    '2': 'UC Davis memorial union games area',
    '3': 'UC Davis Activities Recreation Center',
    '4': 'UC Davis silo market',
    'mu': 'UC Davis memorial union games area',
    'library': 'UC Davis shields library',
    'arc': 'UC Davis Activities Recreation Center',
    'silo-market': 'UC Davis silo market'
  };
  
  console.log('markerController: Looking up location:', id, 'in:', Object.keys(locations));
  return locations[id];
}
