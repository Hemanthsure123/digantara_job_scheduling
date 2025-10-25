const express = require('express');
const jobController = require('../controllers/job.controller');
const router = express.Router();

// POST /jobs - Create a new job
router.post('/', jobController.createJob);

// GET /jobs - List all jobs
router.get('/', jobController.getAllJobs);

// GET /jobs/:id - Get one job by ID
router.get('/:id', jobController.getJobById);

module.exports = router;