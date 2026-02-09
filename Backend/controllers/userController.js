const jwt = require('jsonwebtoken');
const User = require('../models/User');

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

// POST /users - register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log('Register error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /users/login
const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username or email, and password',
      });
    }

    // find by username or email
    const query = username
      ? { username }
      : { email: email.toLowerCase() };

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/password',
      });
    }

    // new token - invalidates old one (single device)
    const token = generateToken(user._id);
    user.token = token;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    console.log('Login error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-token');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /users/logout
const logoutUser = async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { registerUser, loginUser, getUsers, logoutUser };
