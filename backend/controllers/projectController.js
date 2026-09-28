const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/response');

const generateProjectId = async () => {
  const count = await Project.countDocuments();
  return `PRJ-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate('owner', 'name email').populate('assignedContractor', 'name email');
    return sendSuccess(res, 'Projects retrieved successfully', { projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email').populate('assignedContractor', 'name email');
    if (!project) return sendError(res, 'Project not found', 404);
    return sendSuccess(res, 'Project retrieved successfully', { project });
  } catch (error) {
    next(error);
  }
};

// 1. Dept Officer creates a new project
const createProject = async (req, res, next) => {
  try {
    const { title, description, department, location, budget, deadline } = req.body;
    
    if (!title || !description || !department || !location || !budget || !deadline) {
      return sendError(res, 'All fields are required', 400);
    }

    const projectId = await generateProjectId();
    
    const project = await Project.create({
      projectId,
      title,
      description,
      department,
      location,
      budget,
      deadline,
      owner: req.user._id,
      status: 'Pending'
    });
    return sendSuccess(res, 'Project created successfully', { project }, 201);
  } catch (error) {
    next(error);
  }
};

// 2. Dept Officer uploads tender
const uploadTender = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 'Project not found', 404);
    
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized', 403);
    }

    const tenderFile = req.file ? req.file.filename : req.body.tenderDocument;
    if (!tenderFile) return sendError(res, 'Tender document is required', 400);

    project.tenderDocument = tenderFile;
    project.status = 'Tender Open';
    await project.save();

    return sendSuccess(res, 'Tender created and published to contractors', { project });
  } catch (error) {
    next(error);
  }
};

// 3. Admin approves tender -> Tender Open
const approveTender = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return sendError(res, 'Only Admin can approve tenders', 403);
    
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 'Project not found', 404);
    
    if (project.status !== 'Tender Pending Approval') {
      return sendError(res, 'Project is not waiting for tender approval', 400);
    }

    project.status = 'Tender Open';
    await project.save();
    return sendSuccess(res, 'Tender approved and opened for bidding', { project });
  } catch (error) {
    next(error);
  }
};

// 4. Contractor submits bid
const submitBid = async (req, res, next) => {
  try {
    if (req.user.role !== 'contractor') return sendError(res, 'Only Contractors can bid', 403);

    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 'Project not found', 404);
    
    if (project.status !== 'Tender Open') return sendError(res, 'Tender is not open for bidding', 400);

    const { companyName, bidAmount } = req.body;
    const proposalFile = req.file ? req.file.filename : req.body.proposalDocument;

    if (!companyName || !bidAmount) return sendError(res, 'Company name and bid amount are required', 400);

    project.bids.push({
      contractorId: req.user._id,
      companyName,
      bidAmount,
      proposalDocument: proposalFile
    });

    await project.save();
    return sendSuccess(res, 'Bid submitted successfully', { project });
  } catch (error) {
    next(error);
  }
};

// 5. Dept Officer selects a bid -> Contractor Pending Approval
const selectBid = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 'Project not found', 404);
    
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized', 403);
    }

    const { bidId } = req.params;
    const bid = project.bids.id(bidId);
    if (!bid) return sendError(res, 'Bid not found', 404);

    bid.status = 'Approved';
    project.assignedContractor = bid.contractorId;
    project.status = 'Assigned';
    await project.save();

    return sendSuccess(res, 'Bid approved and project assigned to contractor', { project });
  } catch (error) {
    next(error);
  }
};

// 6. Admin approves Contractor -> Assigned
const approveContractor = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return sendError(res, 'Only Admin can approve contractors', 403);

    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 'Project not found', 404);

    if (project.status !== 'Contractor Pending Approval') {
      return sendError(res, 'No contractor is pending approval', 400);
    }

    const { bidId } = req.params;
    const bid = project.bids.id(bidId);
    if (!bid) return sendError(res, 'Bid not found', 404);

    bid.status = 'Approved by Admin';
    project.assignedContractor = bid.contractorId;
    project.status = 'Assigned';
    await project.save();

    return sendSuccess(res, 'Contractor approved and project assigned', { project });
  } catch (error) {
    next(error);
  }
};

// Basic Update & Delete
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 'Project not found', 404);
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to update this project', 403);
    }
    project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return sendSuccess(res, 'Project updated successfully', { project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 'Project not found', 404);
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to delete this project', 403);
    }
    await project.deleteOne();
    return sendSuccess(res, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
