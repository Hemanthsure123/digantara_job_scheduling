const jobService = require('../services/job.service');

class JobController {
  async createJob(req, res, next) {
    try {
      // Destructure the fields we actually expect
      const { name, description, schedule, jobType, payload, timezone } = req.body;

      // Corrected Validation: Check for 'schedule'
      if (!name || !schedule || !jobType) {
        return res.status(400).json({ success: false, message: 'name, schedule, and jobType are required' });
      }

      // Pass the data directly to the service
      const newJob = await jobService.create({
        name,
        description,
        schedule, // Pass 'schedule' directly
        jobType,
        payload,
        timezone
      });

      res.status(201).json({ success: true, data: newJob });

    } catch (error) {
      // The service will still throw this error if the cron value is bad
      if (error.message === 'Invalid cron expression') {
        return res.status(400).json({ success: false, message: error.message });
      }
      next(error); // Pass other errors on
    }
  }

  async getJobById(req, res, next) {
    try {
      const job = await jobService.getById(req.params.id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      res.json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  async getAllJobs(req, res, next) {
    try {
      const jobs = await jobService.getAll();
      res.json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JobController();