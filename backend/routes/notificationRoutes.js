const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');
const { sendSuccess, sendError } = require('../utils/response');

// Get all notifications for current user
router.get('/', protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return sendSuccess(res, 'Notifications retrieved', { notifications });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }
    return sendSuccess(res, 'Notification marked as read', { notification });
  } catch (error) {
    next(error);
  }
});

// Create notification (e.g. for testing / triggers)
router.post('/', protect, async (req, res, next) => {
  try {
    const { recipient, message, type } = req.body;
    const notification = await Notification.create({
      recipient: recipient || req.user._id,
      message,
      type,
    });
    return sendSuccess(res, 'Notification created', { notification }, 201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
