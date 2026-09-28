const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { demoUsers } = require('../seed/seedUsers');

// In-memory fallback user store (active if database connection is pending Atlas IP whitelist)
const memoryUsers = new Map();

// Initialize in-memory store with demo users
demoUsers.forEach((u, idx) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(u.password, salt);
  memoryUsers.set(u.email.toLowerCase(), {
    _id: `demo-${idx + 1}`,
    name: u.name,
    email: u.email.toLowerCase(),
    password: hashedPassword,
    role: u.role,
    createdAt: new Date(),
  });
});

/**
 * @desc    Citizen Registration
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Check if connected to MongoDB
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: emailNormalized });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: emailNormalized,
        password,
        role: 'citizen',
      });

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // In-memory fallback
      if (memoryUsers.has(emailNormalized)) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUserId = `usr-${Date.now()}`;
      const newUser = {
        _id: newUserId,
        name: name.trim(),
        email: emailNormalized,
        password: hashedPassword,
        role: 'citizen',
        createdAt: new Date(),
      };
      memoryUsers.set(emailNormalized, newUser);

      const token = generateToken(newUserId, 'citizen');

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUserId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

/**
 * @desc    User Login (Standard & Demo)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Check if connected to MongoDB
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: emailNormalized }).select('+password');

      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials',
        });
      }

      const token = generateToken(user._id, user.role);

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // In-memory fallback
      const user = memoryUsers.get(emailNormalized);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials',
        });
      }

      const token = generateToken(user._id, user.role);

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

/**
 * @desc    Get Current User Profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving profile',
    });
  }
};

/**
 * @desc    Logout User
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @desc    List Demo Users for Hackathon Judge Fast Access
 * @route   GET /api/auth/demo-users
 * @access  Public
 */
const getDemoUsers = async (req, res) => {
  const safeDemoUsers = demoUsers.map((u) => ({
    name: u.name,
    role: u.role,
    email: u.email,
    title: u.title,
  }));

  return res.status(200).json(safeDemoUsers);
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  getDemoUsers,
  memoryUsers,
};
