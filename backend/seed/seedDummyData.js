const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load env
dotenv.config();

const Complaint = require('./Complaint');
const FundRequest = require('./FundRequest');
const Inspection = require('./Inspection');

const dummyComplaints = [
  { complaintId: 'C-205', citizen: 'Riya Shah', category: 'Road Damage', priority: 'High', status: 'Pending' },
  { complaintId: 'C-206', citizen: 'Arjun Mehta', category: 'Water Supply', priority: 'Critical', status: 'Under Review' },
  { complaintId: 'C-207', citizen: 'Neha Verma', category: 'Street Lights', priority: 'Medium', status: 'Resolved' },
  { complaintId: 'C-208', citizen: 'Prakash Rao', category: 'Garbage Collection', priority: 'High', status: 'Assigned' },
];

const dummyFunds = [
  { requestId: 'REQ-101', project: 'NH-48 Highway Repair', requested: '₹25 Lakh', status: 'Finance Review' },
  { requestId: 'REQ-102', project: 'Sewage Line Upgrade', requested: '₹12 Lakh', status: 'Draft' },
  { requestId: 'REQ-095', project: 'Solar Street Lights', requested: '₹8 Lakh', status: 'Approved' },
];

const dummyInspections = [
  { inspectionId: 'INS-401', project: 'NH-48 Highway Repair', engineer: 'Neha Verma', status: 'Pending Review', flags: 1 },
  { inspectionId: 'INS-402', project: 'Sewage Line Upgrade', engineer: 'Rajesh Kumar', status: 'Approved', flags: 0 },
  { inspectionId: 'INS-403', project: 'City Hospital Wing C', engineer: 'Dr. Ramesh Iyer', status: 'Pending Review', flags: 2 },
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Complaint.deleteMany({});
    await FundRequest.deleteMany({});
    await Inspection.deleteMany({});
    
    // Insert dummy data
    await Complaint.insertMany(dummyComplaints);
    await FundRequest.insertMany(dummyFunds);
    await Inspection.insertMany(dummyInspections);
    
    console.log('Dummy data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
