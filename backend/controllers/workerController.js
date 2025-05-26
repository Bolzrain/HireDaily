const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// @desc    Get all workers with filtering and search
// @route   GET /api/workers
// @access  Public
const getWorkers = async (req, res) => {
  try {
    const { skill, location, minRate, maxRate, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = { 'availability.isAvailable': true };
    
    if (skill) {
      filter.skills = { $in: [skill] };
    }
    
    if (location) {
      filter.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } }
      ];
    }
    
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-password'
    };

    const workers = await Worker.find(filter)
      .select('-password')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Worker.countDocuments(filter);

    res.json({
      workers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single worker by ID
// @route   GET /api/workers/:id
// @access  Public
const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-password');
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json(worker);
  } catch (error) {
    console.error('Get worker by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update worker profile
// @route   PUT /api/workers/profile
// @access  Private (Worker only)
const updateWorkerProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      phone,
      skills,
      location,
      hourlyRate,
      experience,
      description,
      availability
    } = req.body;

    const worker = await Worker.findById(req.user._id);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Update fields
    worker.name = name || worker.name;
    worker.phone = phone || worker.phone;
    worker.skills = skills || worker.skills;
    worker.location = location || worker.location;
    worker.hourlyRate = hourlyRate || worker.hourlyRate;
    worker.experience = experience || worker.experience;
    worker.description = description || worker.description;
    worker.availability = availability || worker.availability;

    const updatedWorker = await worker.save();

    res.json({
      _id: updatedWorker._id,
      name: updatedWorker.name,
      email: updatedWorker.email,
      phone: updatedWorker.phone,
      skills: updatedWorker.skills,
      location: updatedWorker.location,
      hourlyRate: updatedWorker.hourlyRate,
      experience: updatedWorker.experience,
      description: updatedWorker.description,
      availability: updatedWorker.availability,
      rating: updatedWorker.rating,
      userType: updatedWorker.userType
    });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get worker's bookings
// @route   GET /api/workers/bookings
// @access  Private (Worker only)
const getWorkerBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { worker: req.user._id };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .sort({ scheduledDate: 1 })
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
    console.error('Get worker bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/workers/bookings/:id/status
// @access  Private (Worker only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      worker: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone');

    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get worker skills list
// @route   GET /api/workers/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const skills = [
      'construction',
      'electrician',
      'plumber',
      'carpenter',
      'gardener',
      'painter',
      'cleaner',
      'handyman'
    ];
    
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWorkers,
  getWorkerById,
  updateWorkerProfile,
  getWorkerBookings,
  updateBookingStatus,
  getSkills
}; 