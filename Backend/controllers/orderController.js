const Order = require('../models/Order');
const Cart = require('../models/Cart');

// POST /orders - create order from cart
const createOrder = async (req, res) => {
  try {
    const { cartId } = req.body;
    const userId = req.user._id;

    // find cart
    let cart;
    if (cartId) {
      cart = await Cart.findById(cartId).populate('items.item');
    } else {
      cart = await Cart.findOne({ user: userId }).populate('items.item');
    }

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // verify ownership
    if (cart.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // calculate total
    let total = 0;
    const orderItems = cart.items.map(ci => {
      total += ci.item.price * ci.quantity;
      return {
        item: ci.item._id,
        quantity: ci.quantity,
        price: ci.item.price,
      };
    });

    // create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount: total,
    });

    // clear cart
    await Cart.findByIdAndDelete(cart._id);

    await order.populate('items.item');
    await order.populate('user', 'username email');

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('items.item')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.item')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('items.item');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getOrders, getMyOrders, getOrderById };
