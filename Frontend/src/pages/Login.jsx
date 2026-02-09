import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    login: '',
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const loginValue = form.login.trim();
        const payload = loginValue.includes('@')
          ? { email: loginValue, password: form.password }
          : { username: loginValue, password: form.password };
        const res = await authAPI.login(payload);
        if (res.data.success) {
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.data));
          toast.success('Login successful!');
          navigate('/items');
        }
      } else {
        const res = await authAPI.register({
          username: form.username,
          email: form.email,
          password: form.password,
        });
        if (res.data.success) {
          toast.success('Registration successful! Please login.');
          setIsLogin(true);
          setForm({ ...form, password: '', login: form.email });
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK'
          ? "Can't reach server. Is the backend running?"
          : 'Invalid email/username or password');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Yamuna Shopping</h1>
          <p>{isLogin ? 'Welcome back!' : 'Create an account'}</p>
        </div>

        <form onSubmit={onSubmit} className="login-form">
          {isLogin ? (
            <div className="form-group">
              <label htmlFor="login">Email or Username</label>
              <input
                type="text"
                id="login"
                name="login"
                value={form.login}
                onChange={update}
                placeholder="Enter your email or username"
                required
                autoComplete="username"
              />
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={update}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={update}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              className="btn-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
