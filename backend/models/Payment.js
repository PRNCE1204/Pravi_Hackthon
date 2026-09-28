const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  project: { type: String },
  amount: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
  date: { type: Date, default: Date.now },
  payee: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Payment', schema);
