const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  project: { type: String },
  citizen: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Feedback', schema);
