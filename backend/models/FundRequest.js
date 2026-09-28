const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  project: { type: String, required: true },
  requested: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Finance Review', 'Approved', 'Rejected'], default: 'Finance Review' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FundRequest', fundSchema);
