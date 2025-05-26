const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Worker = require('../models/Worker');

// Generate JWT Token
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register-user
// @access  Public
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, location } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    const workerExists = await Worker.findOne({ email });

    if (userExists || workerExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      location
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        userType: user.userType,
        token: generateToken(user._id, user.userType),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new worker
// @route   POST /api/auth/register-worker
// @access  Public
const registerWorker = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      name, 
      email, 
      password, 
      phone, 
      skills, 
      location, 
      hourlyRate, 
      experience, 
      description,
      availability 
    } = req.body;

    // Check if worker already exists
    const userExists = await User.findOne({ email });
    const workerExists = await Worker.findOne({ email });

    if (userExists || workerExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create worker
    const worker = await Worker.create({
      name,
      email,
      password,
      phone,
      skills,
      location,
      hourlyRate,
      experience,
      description,
      availability
    });

    if (worker) {
      res.status(201).json({
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        skills: worker.skills,
        location: worker.location,
        hourlyRate: worker.hourlyRate,
        experience: worker.experience,
        userType: worker.userType,
        token: generateToken(worker._id, worker.userType),
      });
    } else {
      res.status(400).json({ message: 'Invalid worker data' });
    }
  } catch (error) {
    console.error('Register worker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType } = req.body;

    let user;
    if (userType === 'user') {
      user = await User.findOne({ email });
    } else if (userType === 'worker') {
      user = await Worker.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        token: generateToken(user._id, user.userType),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  registerWorker,
  loginUser,
  getProfile
}; 