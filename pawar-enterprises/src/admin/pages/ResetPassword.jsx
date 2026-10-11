import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import './Login.css'; // Reusing login styles

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAdminAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    try {
      await resetPassword(token, password);
      navigate('/admin/login');
    } catch (err) {
      setError(err.message || 'Invalid or expired token');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-split">
        <div className="admin-login-brand">
          <div className="brand-overlay"></div>
          <div className="brand-content">
            <img src="/logo.jpg" alt="Pawar Enterprises Logo" className="login-logo" />
            <h1>Reset Password</h1>
            <p>Enter your new password to regain access to the admin dashboard.</p>
          </div>
          <div className="geo-shape shape-1"></div>
          <div className="geo-shape shape-2"></div>
        </div>

        <div className="admin-login-form-wrapper">
          <div className="login-form-card">
            <h2>Create New Password</h2>
            <p className="login-subtitle">Please enter your new password below</p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleReset} className="login-form">
              <div className="form-group">
                <label>New Password</label>
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

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
