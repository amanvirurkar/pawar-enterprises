import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import './Login.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const navigate = useNavigate();
  const { login, forgotPassword } = useAdminAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await forgotPassword(email);
      setMessage('Password reset link sent to your email!');
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error sending password reset link');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-split">
        {/* Left Side Branding */}
        <div className="admin-login-brand">
          <div className="brand-overlay"></div>
          <div className="brand-content">
            <img src="/logo.jpg" alt="Pawar Enterprises Logo" className="login-logo" />
            <h1>Admin Control Panel</h1>
            <p>Manage your products, categories, and store information from one central dashboard.</p>
          </div>
          
          {/* Subtle Geometric Shapes */}
          <div className="geo-shape shape-1"></div>
          <div className="geo-shape shape-2"></div>
        </div>

        {/* Right Side Form */}
        <div className="admin-login-form-wrapper">
          <div className="login-form-card">
            <h2>{isForgot ? 'Forgot Password' : 'Welcome Back'}</h2>
            <p className="login-subtitle">
              {isForgot ? 'Enter your email to receive a reset link' : 'Please sign in to access the dashboard'}
            </p>

            {error && <div className="login-error">{error}</div>}
            {message && <div className="login-success" style={{ color: '#10B981', backgroundColor: '#E6F8ED', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>{message}</div>}

            <form onSubmit={isForgot ? handleForgot : handleLogin} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required 
                  />
                </div>
              </div>

              {!isForgot && (
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="form-options">
                {!isForgot && (
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember Me</span>
                  </label>
                )}
                <a 
                  href="#" 
                  className="forgot-password" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsForgot(!isForgot);
                    setError('');
                    setMessage('');
                  }}
                  style={isForgot ? { marginLeft: 'auto' } : {}}
                >
                  {isForgot ? 'Back to Login' : 'Forgot Password?'}
                </a>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : (isForgot ? 'Send Reset Link' : 'Sign In')} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
