const jobRepository = require('../repositories/job.repository');
const { jobQueue } = require('../../scheduler/queue');
const cronParser = require('cron-parser');

class JobService {
  async create(jobData) {
    let nextRunAt;

    try {
      const { schedule, timezone = 'UTC' } = jobData;

      // Handle both CommonJS and ESM import styles safely
      const parse = cronParser.parseExpression || cronParser.default?.parseExpression;
      const interval = parse(schedule, { tz: timezone });
      nextRunAt = interval.next().toDate();
    } catch (err) {
      console.error('Error parsing cron expression:', jobData.schedule, err);
      throw new Error('Invalid cron expression');
    }

    // Save job to MongoDB
    const job = await jobRepository.create({ ...jobData, nextRunAt });
    const jobId = job._id.toString();

    // Add job to BullMQ queue
    await jobQueue.add(job.jobType, job.payload, {
      jobId: jobId,
      repeat: {
        cron: job.schedule,
        tz: job.timezone,
      },
      removeOnComplete: true,
      removeOnFail: 50,
    });

    return job;
  }

  async getById(id) {
    return jobRepository.findById(id);
  }

  async getAll() {
    return jobRepository.findAll();
  }
}

module.exports = new JobService();
