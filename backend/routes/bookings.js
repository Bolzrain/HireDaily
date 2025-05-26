const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  rateBooking
} = require('../controllers/bookingController');
const { protect, userOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (User only)
router.post('/', [
  protect,
  userOnly,
  body('workerId', 'Worker ID is required').notEmpty(),
  body('serviceType', 'Service type is required').isIn(['construction', 'electrician', 'plumber', 'carpenter', 'gardener', 'painter', 'cleaner', 'handyman']),
  body('description', 'Description is required').notEmpty(),
  body('scheduledDate', 'Scheduled date is required').isISO8601(),
  body('scheduledTime', 'Scheduled time is required').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('estimatedHours', 'Estimated hours must be between 1 and 12').isFloat({ min: 1, max: 12 }),
  body('address.street', 'Street address is required').notEmpty(),
  body('address.city', 'City is required').notEmpty(),
  body('address.state', 'State is required').notEmpty(),
  body('address.zipCode', 'Zip code is required').notEmpty()
], createBooking);

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private (User only)
router.get('/', protect, userOnly, getUserBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, getBookingById);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private (User only)
router.put('/:id/cancel', protect, userOnly, cancelBooking);

// @route   PUT /api/bookings/:id/rate
// @desc    Rate a completed booking
// @access  Private (User only)
router.put('/:id/rate', [
  protect,
  userOnly,
  body('score', 'Rating score must be between 1 and 5').isFloat({ min: 1, max: 5 }),
  body('review', 'Review cannot be more than 300 characters').optional().isLength({ max: 300 })
], rateBooking);

module.exports = router; 