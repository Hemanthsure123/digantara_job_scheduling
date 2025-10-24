const cron = require('node-cron');
const Job = require('./models/Job');

const startScheduler = async () => {
  // Run every minute to check for due jobs (simple polling)
  cron.schedule('* * * * *', async () => {
    try {
      const jobs = await Job.find({ status: 'active' });
      jobs.forEach(async (job) => {
        const now = new Date();
        if (now >= job.nextRun) {
          // Run the dummy job
          console.log(`Running job: ${job.name}`);
          
          // Update timestamps
          job.lastRun = now;
          job.nextRun = new Date(now.getTime() + 1 * 60 * 1000);  // Next in 1 min
          await job.save();
        }
      });
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  });

  console.log('Scheduler started - checking jobs every minute');
};

module.exports = startScheduler;