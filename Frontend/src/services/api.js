import axios from 'axios';

// Same origin when deployed together on Vercel; localhost in dev; override with VITE_API_URL if needed
const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/users', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  getUsers: () => api.get('/users'),
};

export const itemsAPI = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
};

export const cartAPI = {
  addItem: (itemId, qty = 1) => api.post('/carts', { itemId, quantity: qty }),
  getMyCart: () => api.get('/carts/my-cart'),
  getAllCarts: () => api.get('/carts'),
  removeItem: (itemId) => api.delete(`/carts/items/${itemId}`),
  clearCart: () => api.delete('/carts'),
};

export const ordersAPI = {
  create: (cartId) => api.post('/orders', { cartId }),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

export default api;
