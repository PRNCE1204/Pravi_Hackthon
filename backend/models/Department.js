const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  head: { type: String },
  budget: { type: String },
  activeProjects: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Department', schema);
