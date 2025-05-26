const express = require('express');
const { body } = require('express-validator');
const {
  getWorkers,
  getWorkerById,
  updateWorkerProfile,
  getWorkerBookings,
  updateBookingStatus,
  getSkills
} = require('../controllers/workerController');
const { protect, workerOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/workers
// @desc    Get all workers with filtering
// @access  Public
router.get('/', getWorkers);

// @route   GET /api/workers/skills
// @desc    Get list of available skills
// @access  Public
router.get('/skills', getSkills);

// @route   GET /api/workers/bookings
// @desc    Get worker's bookings
// @access  Private (Worker only)
router.get('/bookings', protect, workerOnly, getWorkerBookings);

// @route   PUT /api/workers/profile
// @desc    Update worker profile
// @access  Private (Worker only)
router.put('/profile', [
  protect,
  workerOnly,
  body('name', 'Name is required').optional().notEmpty(),
  body('phone', 'Please provide a valid 10-digit phone number').optional().matches(/^\d{10}$/),
  body('skills', 'Skills must be an array').optional().isArray(),
  body('hourlyRate', 'Hourly rate must be between $10 and $200').optional().isFloat({ min: 10, max: 200 }),
  body('experience', 'Experience must be a non-negative number').optional().isFloat({ min: 0 })
], updateWorkerProfile);

// @route   PUT /api/workers/bookings/:id/status
// @desc    Update booking status
// @access  Private (Worker only)
router.put('/bookings/:id/status', protect, workerOnly, updateBookingStatus);

// @route   GET /api/workers/:id
// @desc    Get single worker by ID
// @access  Public
router.get('/:id', getWorkerById);

module.exports = router; 