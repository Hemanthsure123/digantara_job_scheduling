const express = require('express');
const jobRoutes = require('./job.routes');
const router = express.Router();

router.use('/jobs', jobRoutes);
// You can add other routes here later, e.g., router.use('/users', ...)

module.exports = router;