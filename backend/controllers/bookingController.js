const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { validationResult } = require('express-validator');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User only)
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      workerId,
      serviceType,
      description,
      scheduledDate,
      scheduledTime,
      estimatedHours,
      address,
      notes
    } = req.body;

    // Check if worker exists and is available
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (!worker.availability.isAvailable) {
      return res.status(400).json({ message: 'Worker is not available' });
    }

    // Check if worker has the required skill
    if (!worker.skills.includes(serviceType)) {
      return res.status(400).json({ message: 'Worker does not have the required skill' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      worker: workerId,
      serviceType,
      description,
      scheduledDate,
      scheduledTime,
      estimatedHours,
      hourlyRate: worker.hourlyRate,
      address,
      notes
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('worker', 'name email phone skills hourlyRate')
      .populate('user', 'name email phone');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private (User only)
const getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('worker', 'name email phone skills hourlyRate rating')
      .sort({ scheduledDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('worker', 'name email phone skills hourlyRate rating')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is the assigned worker
    if (booking.user._id.toString() !== req.user._id.toString() && 
        booking.worker._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User only)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('worker', 'name email phone skills hourlyRate rating');

    res.json(updatedBooking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Rate a completed booking
// @route   PUT /api/bookings/:id/rate
// @access  Private (User only)
const rateBooking = async (req, res) => {
  try {
    const { score, review } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: 'Rating score must be between 1 and 5' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'completed'
    });

    if (!booking) {
      return res.status(404).json({ message: 'Completed booking not found' });
    }

    if (booking.rating.score) {
      return res.status(400).json({ message: 'Booking already rated' });
    }

    // Update booking rating
    booking.rating = {
      score,
      review: review || '',
      reviewDate: new Date()
    };
    await booking.save();

    // Update worker's overall rating
    const worker = await Worker.findById(booking.worker);
    const allRatings = await Booking.find({
      worker: booking.worker,
      'rating.score': { $exists: true }
    });

    const totalRatings = allRatings.length;
    const averageRating = allRatings.reduce((sum, booking) => sum + booking.rating.score, 0) / totalRatings;

    worker.rating.average = Math.round(averageRating * 10) / 10;
    worker.rating.count = totalRatings;
    await worker.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('worker', 'name email phone skills hourlyRate rating');

    res.json(updatedBooking);
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  rateBooking
}; 