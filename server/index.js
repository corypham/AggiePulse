const express = require('express');
const cors = require('cors');
const markerRoutes = require('./routes/markerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'AggiePulse API is running' });
});

// API routes
app.use('/api', markerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log(`- GET http://localhost:${PORT}/`);
  console.log(`- GET http://localhost:${PORT}/api/location/:locationId`);
}); 