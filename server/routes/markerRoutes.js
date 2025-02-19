const express = require('express');
const router = express.Router();
const markerController = require('../controllers/markerController');
const LibraryOccupancyService = require('../services/libraryOccupancyService');

router.get('/locations/:locationId/crowd-data', markerController.getLocationData);
router.get('/test-location', markerController.testLocationData);
router.get('/locations/bulk-data', markerController.getBulkLocationData);

// Update SafeSpace route to force refresh when needed
router.get('/locations/library/safespace', async (req, res) => {
  try {
    // Force a fresh fetch by clearing cache if refresh=true query param is present
    const shouldRefresh = req.query.refresh === 'true';
    
    console.log('[SafeSpace Route] Fetching data, force refresh:', shouldRefresh);
    
    // Get fresh data (LibraryOccupancyService handles caching internally)
    const occupancyData = await LibraryOccupancyService.getOccupancyData(shouldRefresh);
    
    res.json({
      mainBuilding: occupancyData.main,
      studyRoom: occupancyData.studyRoom
    });
  } catch (error) {
    console.error('Error fetching SafeSpace data:', error);
    res.status(500).json({ error: 'Failed to fetch SafeSpace data' });
  }
});

module.exports = router;
