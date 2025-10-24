const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Job name, e.g., "Send Email"
  description: { type: String },           // Optional details
  cronExpression: { type: String, required: true },  // Schedule like "*/5 * * * *" for every 5 mins
  lastRun: { type: Date },                 // When it last ran
  nextRun: { type: Date },                 // When it will run next
  status: { type: String, default: 'active' }  // active, paused, etc.
}, { timestamps: true });  // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Job', jobSchema);