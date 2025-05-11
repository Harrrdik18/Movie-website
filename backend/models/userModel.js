const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Your name cannot exceed 30 characters'],
    minLength: [3, 'Your name must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Your password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  favorites: [
    {
      movieId: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      poster: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['movie', 'tv'],
        default: 'movie'
      }
    }
  ],
  watchlist: [
    {
      movieId: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      poster: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['movie', 'tv'],
        default: 'movie'
      }
    }
  ],
  role: {
    type: String,
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT token
userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', userSchema);
