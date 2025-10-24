const express = require('express');
const Job = require('../models/Job');
const router = express.Router();

// GET /jobs - List all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });  // Newest first
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /jobs/:id - Get one job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /jobs - Create a new job
router.post('/', async (req, res) => {
  try {
    const { name, description, cronExpression } = req.body;
    if (!name || !cronExpression) {
      return res.status(400).json({ success: false, message: 'Name and cronExpression are required' });
    }

    // Create job with nextRun as now (we'll update in scheduler)
    const job = new Job({
      name,
      description,
      cronExpression,
      lastRun: null,
      nextRun: new Date()
    });

    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;