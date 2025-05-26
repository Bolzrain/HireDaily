const express = require('express');
const { body } = require('express-validator');
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { protect, userOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private (User only)
router.get('/profile', protect, userOnly, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private (User only)
router.put('/profile', [
  protect,
  userOnly,
  body('name', 'Name is required').optional().notEmpty(),
  body('phone', 'Please provide a valid 10-digit phone number').optional().matches(/^\d{10}$/)
], updateUserProfile);

module.exports = router; 