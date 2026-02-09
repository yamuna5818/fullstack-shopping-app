# Yamuna Shopping Cart - Frontend

A React frontend for the e-commerce shopping cart application.

## Features

- User login and registration
- Browse and view items
- Add items to cart by clicking on them
- View cart items (displayed in alert)
- View order history (displayed in alert)
- Checkout to convert cart to order
- Toast notifications for actions
- Modern, responsive UI

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Styling**: CSS3

## Prerequisites

- Node.js (v14 or higher)
- Backend server running on `http://localhost:5000`

## Installation

1. Navigate to the project directory:

```bash
cd Yamuna_Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage Flow

1. **Login/Register**: Open the app and login with your credentials, or register a new account.

2. **Browse Items**: After logging in, you'll see all available items.

3. **Add to Cart**: Click on any item card to add it to your cart.

4. **View Cart**: Click the "Cart" button to see all items in your cart (shows in alert).

5. **View Orders**: Click "Order History" to see your past orders (shows in alert).

6. **Checkout**: Click "Checkout" to convert your cart to an order.

7. **Logout**: Click "Logout" to sign out.

## Project Structure

```
Yamuna_Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── pages/
│   │   ├── Login.jsx      # Login/Register page
│   │   ├── Login.css      # Login styles
│   │   ├── Items.jsx      # Items listing page
│   │   └── Items.css      # Items styles
│   ├── services/
│   │   └── api.js         # API service with Axios
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## API Configuration

The frontend connects to the backend at `http://localhost:5000`. To change this, modify the `API_BASE_URL` in `src/services/api.js`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Notes

- Make sure the backend server is running before starting the frontend
- Add items via the backend API or Postman before they appear in the UI
- The authentication token is stored in localStorage
