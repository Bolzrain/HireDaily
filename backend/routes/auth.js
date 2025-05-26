const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  registerWorker,
  loginUser,
  getProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register-user
// @desc    Register a new user
// @access  Public
router.post('/register-user', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('phone', 'Please provide a valid 10-digit phone number').matches(/^\d{10}$/),
  body('location.city', 'City is required').notEmpty(),
  body('location.state', 'State is required').notEmpty(),
  body('location.zipCode', 'Zip code is required').notEmpty()
], registerUser);

// @route   POST /api/auth/register-worker
// @desc    Register a new worker
// @access  Public
router.post('/register-worker', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('phone', 'Please provide a valid 10-digit phone number').matches(/^\d{10}$/),
  body('skills', 'At least one skill is required').isArray({ min: 1 }),
  body('location.city', 'City is required').notEmpty(),
  body('location.state', 'State is required').notEmpty(),
  body('location.zipCode', 'Zip code is required').notEmpty(),
  body('hourlyRate', 'Hourly rate must be between $10 and $200').isFloat({ min: 10, max: 200 }),
  body('experience', 'Experience must be a non-negative number').isFloat({ min: 0 })
], registerWorker);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
  body('userType', 'User type is required').isIn(['user', 'worker'])
], loginUser);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getProfile);

module.exports = router; 