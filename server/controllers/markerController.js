const SerpApi = require('serpapi');
const search = new SerpApi.GoogleSearch(
  "e820745d12eba022a4adecdce5f9baf5a537f07a1261da26cb9116a2cfa0bc88"
);

exports.getLocationData = async (req, res) => {
  const { locationId } = req.params;
  
  try {
    const params = {
      engine: "google",
      q: getSearchQuery(locationId),
      location: "Davis, California, United States",
      hl: "en",
      gl: "us",
      type: "place"
    };

    const results = await search.json(params);
    
    // Extract relevant data
    const popularTimes = results.knowledge_graph?.popular_times || {};
    const currentLive = popularTimes.live || {};
    
    const response = {
      currentStatus: {
        busyness: currentLive.busyness_score || 0,
        description: currentLive.info || "No current data",
        typicalDuration: currentLive.typical_time_spent || "Unknown"
      },
      weeklyData: popularTimes.graph_results || {},
      operatingHours: results.knowledge_graph?.hours || {}
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function getSearchQuery(locationId) {
  const locations = {
    'mu': 'UC Davis memorial union games area',
    'library': 'UC Davis shields library',
    'arc': 'UC Davis ARC',
    'silo-market': 'UC Davis silo market'
  };
  
  return locations[locationId] || '';
}
