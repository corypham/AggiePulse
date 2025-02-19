const { getJson } = require('serpapi');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');
const LibraryOccupancyService = require('../services/libraryOccupancyService');

// Separate caches for weekly and current data
const weeklyCache = new NodeCache({
  stdTTL: 7 * 24 * 60 * 60, // 1 week
  checkperiod: 24 * 60 * 60  // Check daily
});

// Location mapping for accurate API searches
const locations = {
  'silo': 'UC Davis Silo Market',
  'arc': 'UC Davis Activities Recreation Center',
  'mu': 'UC Davis Memorial Union Coffee House',
  'library': 'UC Davis Peter J. Shields Library',
  '24hr': 'UC Davis 24 Hour Study Room',
  'games': 'UC Davis Games Area',
  // Numeric fallbacks
  '1': 'UC Davis Peter J. Shields Library',
  '2': 'UC Davis Memorial Union Coffee House',
  '3': 'UC Davis Activities Recreation Center',
  '4': 'UC Davis Silo Market',
  '5': 'UC Davis 24 Hour Study Room',
  '6': 'UC Davis Games Area'
};

function getSearchQuery(locationId) {
  const id = locationId.toString().toLowerCase();
  return locations[id] || null;
}

// Define all functions before exporting
const getLocationData = async (req, res) => {
  const { locationId } = req.params;
  
  try {
    if (locationId === 'library') {
      console.log('Fetching library data from both SERP and SafeSpace APIs...');
      const [serpData, libraryOccupancy] = await Promise.all([
        getJson({
          api_key: process.env.SERPAPI_KEY,
          engine: "google",
          q: getSearchQuery(locationId),
          location: "Davis, California, United States",
          hl: "en",
          gl: "us",
          type: "place"
        }),
        LibraryOccupancyService.getOccupancyData()
      ]);

      console.log('Library SafeSpace Data:', {
        mainBuilding: libraryOccupancy.main,
        studyRoom: libraryOccupancy.studyRoom
      });

      if (!serpData?.knowledge_graph) {
        throw new Error('Invalid SERPAPI response');
      }

      const processedData = {
        hours: processHours(serpData.knowledge_graph.hours),
        weeklyBusyness: processWeeklyBusyness(serpData.knowledge_graph.popular_times),
        currentStatus: {
          ...getCurrentStatus(serpData.knowledge_graph),
          realTimeOccupancy: {
            mainBuilding: libraryOccupancy.main,
            studyRoom: libraryOccupancy.studyRoom
          }
        }
      };

      res.json(processedData);
      return;
    }

    // Check weekly cache first
    const cachedData = weeklyCache.get(locationId);
    if (cachedData) {
      console.log(`Using cached data for ${locationId}`);
      const currentStatus = getCurrentStatus(cachedData.knowledge_graph);
      return res.json({
        ...cachedData,
        currentStatus
      });
    }

    console.log(`Fetching fresh SERP API data for ${locationId}`);
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

    const processedData = {
      hours: processHours(results.knowledge_graph.hours),
      weeklyBusyness: processWeeklyBusyness(results.knowledge_graph.popular_times),
      currentStatus: getCurrentStatus(results.knowledge_graph)
    };

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

const getBulkLocationData = async (req, res) => {
  try {
    console.log('Bulk data request received');
    const locationIds = ['library', 'mu', 'arc', 'silo'];
    const results = {};
    
    for (const id of locationIds) {
      console.log(`Processing ${id}...`);
      const searchQuery = getSearchQuery(id);
      if (!searchQuery) continue;

      // Check cache first
      const cachedData = weeklyCache.get(id);
      if (cachedData) {
        console.log(`Using cached data for ${id}`);
        results[id] = {
          ...cachedData,
          currentStatus: getCurrentStatus(cachedData.knowledge_graph)
        };
        continue;
      }

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

      weeklyCache.set(id, {
        hours: processedData.hours,
        weeklyBusyness: processedData.weeklyBusyness,
        knowledge_graph: data.knowledge_graph
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

const testLocationData = async (req, res) => {
  res.json({ message: 'Test endpoint working' });
};

// Helper functions
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

function getBusyStatusText(busynessScore) {
  if (!busynessScore && busynessScore !== 0) return 'Unknown';
  
  if (busynessScore >= 85) return 'Very Busy';
  if (busynessScore >= 65) return 'Busy';
  if (busynessScore >= 40) return 'Fairly Busy';
  if (busynessScore >= 20) return 'Not Too Busy';
  return 'Not Busy';
}

function processWeeklyBusyness(popularTimes) {
  if (!popularTimes?.graph_results) return {};
  
  return Object.entries(popularTimes.graph_results).reduce((acc, [day, hours]) => {
    if (!hours) return acc;
    
    acc[day.toLowerCase()] = hours.map(hour => ({
      time: hour.time || '',
      busyness: hour.busyness_score || 0,
      description: getBusyStatusText(hour.busyness_score)
    }));
    return acc;
  }, {});
}

function getCurrentStatus(data) {
  const busynessScore = data?.popular_times?.live?.busyness_score;
  
  return {
    statusText: getBusyStatusText(busynessScore),
    currentCapacity: {
      current: calculateCurrentCapacity(busynessScore),
      percentage: busynessScore || 0
    },
    description: data?.popular_times?.live?.info || "No current data",
    untilText: getUntilText(data?.hours || {})
  };
}

function calculateCurrentCapacity(busynessScore) {
  if (!busynessScore && busynessScore !== 0) return 0;
  // Assuming a base capacity of 100 for simplicity
  return Math.round(busynessScore);
}

function getUntilText(hours) {
  if (!hours) return '';
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  if (!hours[day]) return '';
  
  return `Open until ${hours[day].closes}`;
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

// Export after all functions are defined
module.exports = {
  getLocationData,
  getBulkLocationData,
  testLocationData
};
