const express = require('express');
const router = express.Router();
const markerController = require('../controllers/markerController');

// Use the controller object
router.get('/locations/:locationId/crowd-data', markerController.getLocationData);
router.get('/test-location', markerController.testLocationData);

module.exports = router; 