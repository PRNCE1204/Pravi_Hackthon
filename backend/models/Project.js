const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  bidAmount: {
    type: String,
    required: true,
  },
  proposalDocument: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Selected by Officer', 'Approved by Admin', 'Rejected'],
    default: 'Pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
    },
    department: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Usually the Dept Officer
    },
    assignedContractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: [
        'Pending', 
        'Project Created', 
        'Tender Pending Approval', 
        'Tender Open', 
        'Contractor Pending Approval', 
        'Assigned', 
        'In Progress', 
        'Completed'
      ],
      default: 'Pending',
    },
    tenderDocument: {
      type: String,
      default: '',
    },
    bids: [bidSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
