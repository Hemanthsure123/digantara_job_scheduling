const express = require('express');
const connectDB = require('../config/db');
const config = require('../config');
const allRoutes = require('./routes'); // Import the main router

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/', allRoutes); // Use the main router

// Basic route to test
app.get('/health', (req, res) => {
  res.send('Job Scheduler API is running!');
});

// TODO: Add a real error handler middleware

app.listen(config.port, () => {
  console.log(`API Server running on port ${config.port}`);
});