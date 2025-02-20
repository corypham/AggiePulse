const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const markerRoutes = require('./routes/markerRoutes');
const locationRoutes = require('./routes/locationRoutes');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
const requiredEnvVars = [
  'SERPAPI_KEY',
  'SHIELDS_MAIN_URL',
  'STUDY_ROOM_URL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Log environment variables at startup
console.log('Environment check on startup:');
console.log('SERPAPI_KEY present:', !!process.env.SERPAPI_KEY);

// Enable CORS for all routes with specific origin
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://your-ios-app-bundle-id.com'
  ],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Mount routes with /api prefix
app.use('/api', markerRoutes);
app.use('/api', locationRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/locations/:locationId/crowd-data');
  console.log('- GET /api/locations/bulk-data');
});

module.exports = app;
