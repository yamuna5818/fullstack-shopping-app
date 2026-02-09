const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Public route - list all orders
router.get('/', getOrders);

// Protected routes - require user token
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
