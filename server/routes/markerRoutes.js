const express = require('express');
const router = express.Router();
const markerController = require('../controllers/markerController');

router.get('/locations/:locationId/crowd-data', markerController.getLocationData);
router.get('/test-location', markerController.testLocationData);
router.get('/locations/bulk-data', markerController.getBulkLocationData);

module.exports = router;
