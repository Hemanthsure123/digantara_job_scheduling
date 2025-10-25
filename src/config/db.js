const mongoose = require('mongoose');
const config = require('./index'); // Import the new config

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI); // Use config
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;