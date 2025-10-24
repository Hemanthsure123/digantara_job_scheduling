const cron = require('node-cron');
const { CronExpressionParser } = require('cron-parser'); 
const Job = require('./models/Job');

const startScheduler = async () => {
  cron.schedule('* * * * * *', async () => {  
    try {
      const jobs = await Job.find({ status: 'active' });
      for await (const job of jobs) {
        const now = new Date();
        if (now >= job.nextRun) {
          try {
            console.log(`Running job: ${job.name} at ${now.toISOString()}`);
            job.lastRun = now;
            
      
            const options = { currentDate: now, tz: 'UTC' };  
            const interval = CronExpressionParser.parse(job.cronExpression, options);
            job.nextRun = interval.next().toDate();
            
            await job.save();
          } catch (jobError) {
            console.error(`Failed to run/parse/save job ${job.name}:`, jobError.message);
            
          }
        }
      }
    } catch (error) {
      console.error('Scheduler error (DB query):', error);
    }
  });

  console.log('Scheduler started - polling every second to chase your cron ghosts');
};

module.exports = startScheduler;