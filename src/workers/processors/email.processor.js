const jobRepository = require('../../api/repositories/job.repository');

// This is the "dummy job logic"
const processor = async (job) => {
  try {
    console.log(`[Worker] Running job: ${job.name} (ID: ${job.id})`);
    console.log(`[Worker] Payload:`, job.data);

    // Simulate work (e.g., sending an email)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // CRITICAL: Update the DB with the new run times
    // job.id is the Mongo _id
    // job.nextRunAt is provided by BullMQ
    await jobRepository.updateRunTimes(job.id, new Date(), new Date(job.nextRunAt));

    console.log(`[Worker] Completed job: ${job.name} (ID: ${job.id})`);
    return { success: true };

  } catch (error) {
    console.error(`[Worker] Job ${job.id} FAILED:`, error);
    throw error; // Re-throw error to make BullMQ register it as failed
  }
};

module.exports = processor;