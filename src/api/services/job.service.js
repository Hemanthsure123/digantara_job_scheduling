const jobRepository = require('../repositories/job.repository');
const { jobQueue } = require('../../scheduler/queue');
// FIX 1: Correctly import the 'parseExpression' function
const { parseExpression } = require('cron-parser');

class JobService {
  async create(jobData) {
    let nextRunAt;
    
    try {
      const { schedule, timezone = 'UTC' } = jobData;

      // FIX 2: Call the function directly
      const interval = parseExpression(schedule, { tz: timezone });
      nextRunAt = interval.next().toDate();

    } catch (err) {
      console.error('Error parsing cron expression:', jobData.schedule, err);
      throw new Error('Invalid cron expression');
    }

    // 2. Save job definition to DB
    const job = await jobRepository.create({ ...jobData, nextRunAt });
    const jobId = job._id.toString();

    // 3. Add to the persistent scheduler (BullMQ)
    await jobQueue.add(job.jobType, job.payload, {
      jobId: jobId,
      repeat: {
        cron: job.schedule,
        tz: job.timezone,
      },
      removeOnComplete: true, 
      removeOnFail: 50 
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