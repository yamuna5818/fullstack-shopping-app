const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCarts,
  getMyCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// Public route - list all carts
router.get('/', getCarts);

// Protected routes - require user token
router.post('/', protect, addToCart);
router.get('/my-cart', protect, getMyCart);
router.delete('/', protect, clearCart);
router.delete('/items/:itemId', protect, removeFromCart);

module.exports = router;
