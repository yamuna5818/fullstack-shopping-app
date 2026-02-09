const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  logoutUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', registerUser);
router.get('/', getUsers);
router.post('/login', loginUser);

// Protected routes
router.post('/logout', protect, logoutUser);

module.exports = router;
