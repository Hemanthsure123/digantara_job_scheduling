const { Worker } = require('bullmq');
const connectDB = require('../config/db');
const config = require('../config');

// Import your processor logic
// For a real app, you'd have a dynamic way to choose the processor
// based on job.name (which is job.jobType from our service)
const emailProcessor = require('./processors/email.processor');

console.log('Starting Worker Service...');

// Connect to DB
connectDB();

const connection = {
  host: config.redisHost,
  port: config.redisPort,
};

// The Worker connects to the 'jobs' queue
const worker = new Worker('jobs', emailProcessor, { connection });

worker.on('completed', (job) => {
  console.log(`[Main] Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`[Main] Job ${job.id} has failed with ${err.message}`);
});

console.log('Worker is listening for jobs...');

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down worker...`);
  await worker.close();
  console.log('Worker closed.');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));