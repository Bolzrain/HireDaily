const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      if (decoded.userType === 'user') {
        req.user = await User.findById(decoded.id).select('-password');
      } else if (decoded.userType === 'worker') {
        req.user = await Worker.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is a worker
const workerOnly = (req, res, next) => {
  if (req.user && req.user.userType === 'worker') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Workers only.' });
  }
};

// Middleware to check if user is a regular user
const userOnly = (req, res, next) => {
  if (req.user && req.user.userType === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Users only.' });
  }
};

module.exports = { protect, workerOnly, userOnly }; 