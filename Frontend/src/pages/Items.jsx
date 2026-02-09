import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { itemsAPI, cartAPI, ordersAPI, authAPI } from '../services/api';
import { sampleItems } from '../data/sampleItems';
import './Items.css';

const CART_STORAGE_KEY = 'yamuna_local_cart';

function getStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Items() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [fromApi, setFromApi] = useState(true);
  const [localCart, setLocalCart] = useState(() => getStoredCart());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    loadItems();
    loadCart();
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(localCart));
  }, [localCart]);

  async function loadItems() {
    try {
      const res = await itemsAPI.getAll();
      if (res.data.success && res.data.data?.length) {
        setItems(res.data.data);
        setFromApi(true);
      } else {
        setItems(sampleItems);
        setFromApi(false);
      }
    } catch {
      setItems(sampleItems);
      setFromApi(false);
      toast.info('Showing sample items (backend unavailable)');
    } finally {
      setLoading(false);
    }
  }

  async function loadCart() {
    if (!fromApi) return;
    try {
      const res = await cartAPI.getMyCart();
      if (res.data.success && res.data.data)
        setCartItems(res.data.data.items || []);
    } catch {
      // no cart yet
    }
  }

  const lookup = (id) => items.find((i) => i._id === id) || sampleItems.find((i) => i._id === id);

  const cartLines = fromApi
    ? (cartItems || []).map((ci) => ({
        item: ci.item?.name ? ci.item : lookup(ci.item),
        quantity: ci.quantity || 1,
      })).filter((e) => e.item)
    : localCart
        .map((entry) => ({ item: lookup(entry.itemId), quantity: entry.quantity }))
        .filter((e) => e.item);

  const cartCount = cartLines.reduce((s, e) => s + e.quantity, 0);
  const cartTotal = cartLines.reduce((s, e) => s + (e.item?.price || 0) * e.quantity, 0);

  function addToCart(itemId, ev) {
    if (ev) ev.stopPropagation();
    if (!fromApi) {
      setLocalCart((prev) => {
        const i = prev.find((x) => x.itemId === itemId);
        if (i) return prev.map((x) => (x.itemId === itemId ? { ...x, quantity: x.quantity + 1 } : x));
        return [...prev, { itemId, quantity: 1 }];
      });
      toast.success('Item added to cart!');
      return;
    }
    cartAPI.addItem(itemId, 1).then((res) => {
      if (res?.data?.success) {
        setCartItems(res.data.data.items || []);
        toast.success('Item added to cart!');
      }
    }).catch(() => toast.error('Failed to add item to cart'));
  }

  function removeFromCart(itemId) {
    if (!fromApi) {
      setLocalCart((prev) => prev.filter((x) => x.itemId !== itemId));
      return;
    }
    cartAPI.removeItem(itemId).then(() => cartAPI.getMyCart()).then((res) => {
      if (res?.data?.success && res.data.data) setCartItems(res.data.data.items || []);
    }).catch(() => toast.error('Failed to remove item'));
  }

  function updateQty(itemId, delta) {
    if (!fromApi) {
      setLocalCart((prev) => {
        const next = prev.map((x) =>
          x.itemId === itemId ? { ...x, quantity: Math.max(0, x.quantity + delta) } : x
        );
        return next.filter((x) => x.quantity > 0);
      });
      return;
    }
    const line = cartLines.find((e) => (e.item?._id || e.item) === itemId);
    if (!line) return;
    const newQty = line.quantity + delta;
    if (newQty < 1) {
      removeFromCart(itemId);
      return;
    }
    cartAPI.removeItem(itemId).then(() => cartAPI.addItem(itemId, newQty)).then((res) => {
      if (res?.data?.success && res.data.data) setCartItems(res.data.data.items || []);
    }).catch(() => toast.error('Failed to update quantity'));
  }

  function openCart() {
    setCartOpen(true);
  }

  async function showOrders() {
    try {
      const res = await ordersAPI.getMyOrders();
      if (res.data.success && res.data.data?.length)
        window.alert('Your Orders:\n\n' + res.data.data.map((o) => `Order ID: ${o._id}`).join('\n'));
      else window.alert('No orders found');
    } catch {
      window.alert('No orders found');
    }
  }

  async function checkout() {
    if (cartCount === 0) {
      toast.warning('Your cart is empty!');
      return;
    }
    if (!fromApi) {
      setLocalCart([]);
      setCartOpen(false);
      toast.success('Order placed successfully! (Demo)');
      return;
    }
    try {
      const res = await ordersAPI.create();
      if (res.data.success) {
        toast.success('Order successful!');
        setCartItems([]);
        setCartOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    }
  }

  async function logout() {
    try {
      await authAPI.logout();
    } catch (e) {
      console.warn('Logout:', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast.info('Logged out successfully');
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading items...</p>
      </div>
    );
  }

  return (
    <div className="items-container">
      <header className="header">
        <div className="header-left">
          <h1>Yamuna Shopping</h1>
          {user && <span className="welcome">Welcome, {user.username}!</span>}
        </div>
        <div className="header-right">
          <button className="btn-cart" onClick={openCart}>
            Cart ({cartCount})
          </button>
          <button className="btn-orders" onClick={showOrders}>
            Order History
          </button>
          <button className="btn-checkout" onClick={checkout}>
            Checkout
          </button>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <h2>Available Items</h2>
        {items.length === 0 ? (
          <div className="no-items">
            <p>No items available. Add items from the backend.</p>
          </div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <div key={item._id} className="item-card">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder-image">
                      <span>{item.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description || 'No description'}</p>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <button type="button" className="btn-add" onClick={(e) => addToCart(item._id, e)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <div
        className={`cart-overlay ${cartOpen ? 'cart-overlay-open' : ''}`}
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />
      <div className={`cart-drawer ${cartOpen ? 'cart-drawer-open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Your Cart</h3>
          <button type="button" className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close cart">
            ×
          </button>
        </div>
        <div className="cart-drawer-body">
          {cartLines.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            <ul className="cart-list">
              {cartLines.map((entry) => {
                const it = entry.item;
                const id = it?._id ?? it;
                return (
                  <li key={id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{it?.name || 'Item'}</span>
                      <span className="cart-item-price">
                        ${((it?.price || 0) * entry.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="cart-item-actions">
                      <button type="button" onClick={() => updateQty(id, -1)} aria-label="Decrease">−</button>
                      <span className="cart-item-qty">{entry.quantity}</span>
                      <button type="button" onClick={() => updateQty(id, 1)} aria-label="Increase">+</button>
                      <button type="button" className="cart-item-remove" onClick={() => removeFromCart(id)} aria-label="Remove">
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {cartLines.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button type="button" className="btn-checkout-cart" onClick={checkout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
