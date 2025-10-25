const Job = require('../../models/Job');

class JobRepository {
  async create(jobData) {
    return Job.create(jobData);
  }

  async findById(id) {
    return Job.findById(id);
  }

  async findAll() {
    return Job.find({}).sort({ createdAt: -1 });
  }

  // This will be called by the WORKER
  async updateRunTimes(id, lastRunAt, nextRunAt) {
    return Job.findByIdAndUpdate(id, {
      $set: { lastRunAt, nextRunAt }
    });
  }
}

module.exports = new JobRepository(); // Export a singleton instance