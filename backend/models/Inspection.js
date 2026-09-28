const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  inspectionId: { type: String, required: true, unique: true },
  project: { type: String, required: true },
  engineer: { type: String, required: true },
  status: { type: String, enum: ['Pending Review', 'Approved', 'Rejected - Rework Required'], default: 'Pending Review' },
  flags: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inspection', inspectionSchema);
