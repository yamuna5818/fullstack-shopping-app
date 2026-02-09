const Cart = require('../models/Cart');
const Item = require('../models/Item');

// POST /carts - add item to cart
const addToCart = async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // check item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // create new cart
      cart = await Cart.create({
        user: userId,
        items: [{ item: itemId, quantity }],
      });
    } else {
      // check if item already in cart
      const idx = cart.items.findIndex(i => i.item.toString() === itemId);

      if (idx > -1) {
        cart.items[idx].quantity += quantity;
      } else {
        cart.items.push({ item: itemId, quantity });
      }
      await cart.save();
    }

    cart = await Cart.findById(cart._id).populate('items.item');
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /carts - list all carts
const getCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate('user', 'username email')
      .populate('items.item');
    res.json({ success: true, count: carts.length, data: carts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /carts/my-cart
const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.item');
    if (!cart) {
      return res.json({ success: true, data: null, message: 'Cart is empty' });
    }
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /carts/items/:itemId - remove item
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(i => i.item.toString() !== itemId);
    await cart.save();
    await cart.populate('items.item');

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /carts - clear cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addToCart, getCarts, getMyCart, removeFromCart, clearCart };
