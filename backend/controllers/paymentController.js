const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// @desc    Create Stripe checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private (User only)
const createCheckoutSession = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors in payment:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    console.log('Creating payment session for user:', req.user._id);
    console.log('Request body:', req.body);
    
    const { bookingId } = req.body;

    // Get booking details
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id
    }).populate('worker', 'name');

    console.log('Booking found:', booking ? 'Yes' : 'No');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    console.log('Creating Stripe session with:', {
      amount: booking.totalCost * 100,
      currency: 'inr',
      serviceName: `${booking.serviceType} Service by ${booking.worker.name}`
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${booking.serviceType} Service by ${booking.worker.name}`,
              description: `${booking.estimatedHours} hours of ${booking.serviceType} service`,
            },
            unit_amount: Math.round(booking.totalCost * 100), // Convert to paise (smallest currency unit)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard`,
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
      },
    });

    console.log('Stripe session created successfully:', session.id);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      stripeError: error.type || 'Unknown'
    });
    res.status(500).json({ message: 'Failed to create payment session', error: error.message });
  }
};

// @desc    Handle successful payment
// @route   POST /api/payments/success
// @access  Private
const handlePaymentSuccess = async (req, res) => {
  try {
    const { sessionId, bookingId } = req.body;

    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update booking payment status
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { 
          paymentStatus: 'paid',
          status: 'confirmed' // Automatically confirm booking after payment
        },
        { new: true }
      ).populate('worker', 'name email phone skills hourlyRate');

      res.json({
        success: true,
        booking: booking,
        message: 'Payment successful! Your booking is now confirmed.'
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Handle payment success error:', error);
    res.status(500).json({ message: 'Failed to process payment confirmation' });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:bookingId
// @access  Private
const getPaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      paymentStatus: booking.paymentStatus,
      totalCost: booking.totalCost,
      bookingStatus: booking.status
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
};

module.exports = {
  createCheckoutSession,
  handlePaymentSuccess,
  getPaymentStatus
}; 