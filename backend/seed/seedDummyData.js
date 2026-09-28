const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load env
dotenv.config();

const Complaint = require('../models/Complaint');
const FundRequest = require('../models/FundRequest');
const Inspection = require('../models/Inspection');
const Department = require('../models/Department');
const ProgressUpdate = require('../models/ProgressUpdate');
const Payment = require('../models/Payment');
const Feedback = require('../models/Feedback');
const Tender = require('../models/Tender');
const Notification = require('../models/Notification');

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

const dummyDepartments = [
  { name: 'Roads Department', budget: '₹500 Cr', activeProjects: 12 },
  { name: 'Water Board', budget: '₹200 Cr', activeProjects: 8 },
  { name: 'Parks & Rec', budget: '₹50 Cr', activeProjects: 4 },
];

const dummyProgressUpdates = [
  { project: 'NH-48 Highway Repair', progressPercent: 78, notes: 'Asphalt laying completed on 2km stretch.' },
  { project: 'Sewage Line Upgrade', progressPercent: 42, notes: 'Pipe laying in Sector 5 in progress.' },
];

const dummyPayments = [
  { project: 'NH-48 Highway Repair', amount: '₹12 Cr', payee: 'Bharat Infratech Pvt Ltd', status: 'Completed' },
  { project: 'City Hospital Wing C', amount: '₹5 Cr', payee: 'L&T Construction', status: 'Pending' },
];

const dummyFeedbacks = [
  { project: 'Central Park Reno', citizen: 'Riya Shah', rating: 4, review: 'Good work.' },
  { project: 'City Hospital Wing C', citizen: 'Arjun Mehta', rating: 5, review: 'Excellent facilities.' },
];

const dummyTenders = [
  { project: 'Smart City Solar Lights', title: 'Phase 1 Solar Installation', budget: '₹8 Cr', status: 'Open' },
  { project: 'NH-48 Highway Repair', title: 'Highway Repair Phase 2', budget: '₹25 Cr', status: 'Awarded' },
];

const dummyNotifications = [
  { title: 'Project Near You Updated', message: 'Contractor uploaded new progress for NH-48 Highway Repair.' },
  { title: 'Complaint Resolved', message: 'Your complaint C-207 has been resolved.' },
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Complaint.deleteMany({});
    await FundRequest.deleteMany({});
    await Inspection.deleteMany({});
    await Department.deleteMany({});
    await ProgressUpdate.deleteMany({});
    await Payment.deleteMany({});
    await Feedback.deleteMany({});
    await Tender.deleteMany({});
    await Notification.deleteMany({});
    
    const User = require('../models/User');
    const defaultUser = await User.findOne() || { _id: new mongoose.Types.ObjectId() };
    
    const validNotifications = dummyNotifications.map(n => ({
      recipient: defaultUser._id,
      message: n.message,
      type: 'info'
    }));
    
    // Insert dummy data
    await Complaint.insertMany(dummyComplaints);
    await FundRequest.insertMany(dummyFunds);
    await Inspection.insertMany(dummyInspections);
    await Department.insertMany(dummyDepartments);
    await ProgressUpdate.insertMany(dummyProgressUpdates);
    await Payment.insertMany(dummyPayments);
    await Feedback.insertMany(dummyFeedbacks);
    await Tender.insertMany(dummyTenders);
    await Notification.insertMany(validNotifications);
    
    console.log('Dummy data seeded successfully for all 10 collections!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
