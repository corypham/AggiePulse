const express = require('express');
const router = express.Router();
const markerController = require('../controllers/markerController');

// This should match the frontend request URL pattern
router.get('/locations/:locationId/crowd-data', markerController.getLocationData);

router.get('/test-location', markerController.testLocationData);

module.exports = router; 