const { Queue } = require('bullmq');
const config = require('../config');

const connection = {
  host: config.redisHost,
  port: config.redisPort,
};

const jobQueue = new Queue('jobs', { connection });

module.exports = { jobQueue };