const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Ensure DB is connected before handling requests (required for Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(503).json({
      success: false,
      message: 'Database unavailable. Check MONGODB_URI and try again.',
    });
  }
});

// routes
app.use('/users', require('./routes/userRoutes'));
app.use('/items', require('./routes/itemRoutes'));
app.use('/carts', require('./routes/cartRoutes'));
app.use('/orders', require('./routes/orderRoutes'));

// root
app.get('/', (req, res) => {
  res.json({
    message: 'Shopping Cart API',
    endpoints: {
      users: 'POST /users, GET /users, POST /users/login',
      items: 'POST /items, GET /items',
      carts: 'POST /carts, GET /carts, GET /carts/my-cart',
      orders: 'POST /orders, GET /orders, GET /orders/my-orders',
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Only start listening when run directly (local or Railway/Render), not on Vercel serverless
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
