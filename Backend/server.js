const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
