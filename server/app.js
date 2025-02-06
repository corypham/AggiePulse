const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const markerRoutes = require('./routes/markerRoutes');

const app = express();
const PORT = 3000;

// Log environment variables at startup
console.log('Environment check on startup:');
console.log('SERPAPI_KEY present:', !!process.env.SERPAPI_KEY);

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Mount routes
app.use('/api', markerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
