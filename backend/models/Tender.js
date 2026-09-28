const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  project: { type: String, required: true },
  title: { type: String },
  budget: { type: String },
  status: { type: String, enum: ['Open', 'Closed', 'Awarded'], default: 'Open' },
  deadline: { type: Date },
}, { timestamps: true });
module.exports = mongoose.model('Tender', schema);
