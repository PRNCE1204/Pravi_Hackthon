const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  project: { type: String, required: true },
  contractor: { type: String },
  progressPercent: { type: Number, required: true },
  notes: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model('ProgressUpdate', schema);
