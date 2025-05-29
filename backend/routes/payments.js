const express = require('express');
const { body } = require('express-validator');
const {
  createCheckoutSession,
  handlePaymentSuccess,
  getPaymentStatus
} = require('../controllers/paymentController');
const { protect, userOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe checkout session
// @access  Private (User only)
router.post('/create-checkout-session', [
  protect,
  userOnly,
  body('bookingId', 'Booking ID is required').notEmpty()
], createCheckoutSession);

// @route   POST /api/payments/success
// @desc    Handle payment success
// @access  Private
router.post('/success', [
  protect,
  body('sessionId', 'Session ID is required').notEmpty(),
  body('bookingId', 'Booking ID is required').notEmpty()
], handlePaymentSuccess);

// @route   GET /api/payments/status/:bookingId
// @desc    Get payment status for a booking
// @access  Private
router.get('/status/:bookingId', protect, getPaymentStatus);

module.exports = router; 