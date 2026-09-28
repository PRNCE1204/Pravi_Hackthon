const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  uploadTender,
  approveTender,
  submitBid,
  selectBid,
  approveContractor,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Base project routes
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
deleteProject && router.delete('/:id', protect, deleteProject);

// Workflow routes
router.put('/:id/tender-submit', protect, upload.single('tenderDocument'), uploadTender);
router.put('/:id/tender-approve', protect, approveTender);
router.post('/:id/bids', protect, upload.single('proposalDocument'), submitBid);
router.put('/:id/bids/:bidId/select', protect, selectBid);
router.put('/:id/bids/:bidId/approve', protect, approveContractor);

module.exports = router;
