const express = require('express');
const router = express.Router();
const markerController = require('../controllers/markerController');

// Add the bulk endpoint
router.get('/locations/bulk-data', markerController.getBulkLocationData);

// Keep your existing routes
router.get('/locations/:locationId', markerController.getLocationData);

module.exports = router;