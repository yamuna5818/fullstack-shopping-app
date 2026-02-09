# Shopping Cart Backend API

A RESTful API for an e-commerce shopping cart application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT tokens
- Single device login enforcement (one token per user)
- Shopping cart management
- Order creation from cart
- CRUD operations for items

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository or navigate to the project directory:

```bash
cd Yamuna_Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (or modify the existing one):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopping_cart
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
```

4. Start MongoDB (if running locally):

```bash
mongod
```

5. Run the server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users` | Register a new user | No |
| GET | `/users` | List all users | No |
| POST | `/users/login` | Login user | No |
| POST | `/users/logout` | Logout user | Yes |

### Items

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/items` | Create a new item | No |
| GET | `/items` | List all items | No |
| GET | `/items/:id` | Get item by ID | No |

### Carts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/carts` | Add item to cart | Yes |
| GET | `/carts` | List all carts | No |
| GET | `/carts/my-cart` | Get user's cart | Yes |
| DELETE | `/carts` | Clear user's cart | Yes |
| DELETE | `/carts/items/:itemId` | Remove item from cart | Yes |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order from cart | Yes |
| GET | `/orders` | List all orders | No |
| GET | `/orders/my-orders` | Get user's orders | Yes |
| GET | `/orders/:id` | Get order by ID | Yes |

## Authentication

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Usage Examples

### 1. Register a User

```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

Response includes the token:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Create an Item

```bash
curl -X POST http://localhost:5000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Gaming laptop",
    "price": 999.99,
    "category": "electronics"
  }'
```

### 4. Add Item to Cart

```bash
curl -X POST http://localhost:5000/carts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "itemId": "<item_id>",
    "quantity": 2
  }'
```

### 5. Create Order from Cart

```bash
curl -X POST http://localhost:5000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{}'
```

Or with specific cart ID:
```bash
curl -X POST http://localhost:5000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "cartId": "<cart_id>"
  }'
```

## Project Structure

```
Yamuna_Backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── userController.js  # User logic
│   ├── itemController.js  # Item logic
│   ├── cartController.js  # Cart logic
│   └── orderController.js # Order logic
├── middleware/
│   └── auth.js            # JWT authentication
├── models/
│   ├── User.js            # User schema
│   ├── Item.js            # Item schema
│   ├── Cart.js            # Cart schema
│   └── Order.js           # Order schema
├── routes/
│   ├── userRoutes.js      # User routes
│   ├── itemRoutes.js      # Item routes
│   ├── cartRoutes.js      # Cart routes
│   └── orderRoutes.js     # Order routes
├── .env                   # Environment variables
├── .env.example           # Example env file
├── package.json           # Dependencies
├── server.js              # Entry point
└── README.md              # Documentation
```

## Deploy to Vercel

1. **Create a new Vercel project** and import this repo (or the Backend folder).
2. **Set Root Directory** to `Backend` in Project Settings → General.
3. **Add Environment Variables** in Project Settings → Environment Variables:
   - `MONGODB_URI` – your MongoDB connection string (e.g. MongoDB Atlas)
   - `JWT_SECRET` – a strong secret for signing tokens
   - `JWT_EXPIRES_IN` – e.g. `24h`
4. Deploy. Your API will be at `https://<your-project>.vercel.app` (e.g. `/users`, `/items`, `/carts`, `/orders`).

After deploying, point your frontend to this URL (e.g. set `VITE_API_URL` or update `api.js` base URL to your backend Vercel URL).

## Notes

- A user can only have one active cart at a time
- When an order is created, the cart is automatically cleared
- A user can only be logged in from one device at a time (single token per user)
- For simplicity, inventory management is not implemented

## License

ISC
