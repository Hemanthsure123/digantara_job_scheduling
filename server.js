const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

const startScheduler = require('./scheduler');
startScheduler();

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

const jobRoutes = require('./routes/jobs');
app.use('/jobs', jobRoutes);

// Basic route to test
app.get('/', (req, res) => {
  res.send('Job Scheduler is running!');
});

// We'll add job routes here later

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});