const express = require('express');
const router = express.Router();
const markerController = require('../controllers/markerController');

router.get('/location/:locationId', markerController.getLocationData);

module.exports = router;
