const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  jobType: { type: String, required: true, trim: true }, // e.g., "sendEmail", "calculateReport"
  status: { type: String, default: 'active', enum: ['active', 'paused'] },

  schedule: { type: String, required: true }, // The cron expression
  timezone: { type: String, default: 'UTC' },
  nextRunAt: { type: Date }, 
  lastRunAt: { type: Date }, 

  payload: { type: Object, default: {} }, // Data needed for the job

  description: { type: String },

}, { timestamps: true });

jobSchema.index({ status: 1, nextRunAt: 1 });

module.exports = mongoose.model('Job', jobSchema);