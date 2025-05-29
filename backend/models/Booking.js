const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['construction', 'electrician', 'plumber', 'carpenter', 'gardener', 'painter', 'cleaner', 'geriatric care'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the work needed'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please provide a scheduled date'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Scheduled date must be in the future'
    }
  },
  scheduledTime: {
    type: String,
    required: [true, 'Please provide a scheduled time'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:MM)']
  },
  estimatedHours: {
    type: Number,
    required: [true, 'Please provide estimated hours'],
    min: [1, 'Estimated hours must be at least 1'],
    max: [12, 'Estimated hours cannot exceed 12 per day']
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot be more than 300 characters']
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [300, 'Review cannot be more than 300 characters']
    },
    reviewDate: {
      type: Date
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Calculate total cost before saving
bookingSchema.pre('save', function(next) {
  if (this.estimatedHours && this.hourlyRate) {
    this.totalCost = this.estimatedHours * this.hourlyRate;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema); 