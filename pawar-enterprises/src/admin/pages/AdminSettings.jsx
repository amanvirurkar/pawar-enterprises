import React, { useState, useEffect } from 'react';
import { Save, Lock, User, Shield, CheckCircle, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AdminSettings = () => {
  const { admin, updateProfile } = useAdminAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Extra store preferences
  const [storeCurrency, setStoreCurrency] = useState('₹');
  const [supportEmail, setSupportEmail] = useState('');
  const [orderAlerts, setOrderAlerts] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (admin) {
      setName(admin.name || 'Store Administrator');
      setEmail(admin.email || '');
    }

    // Load store general settings
    const loadSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'adminPreferences'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.name) setName(d.name);
          if (d.storeCurrency) setStoreCurrency(d.storeCurrency);
          if (d.supportEmail) setSupportEmail(d.supportEmail);
          if (d.orderAlerts !== undefined) setOrderAlerts(d.orderAlerts);
        }
      } catch (err) {
        console.warn('Could not load extra admin preferences:', err);
      }
    };
    loadSettings();
  }, [admin]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('New passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      // 1. Update Auth Profile if email or password changed
      if ((email && email !== admin?.email) || password) {
        await updateProfile(email !== admin?.email ? email : undefined, password || undefined);
      }

      // 2. Save preferences to Firestore
      await setDoc(doc(db, 'settings', 'adminPreferences'), {
        name: name.trim(),
        email: email.trim(),
        storeCurrency,
        supportEmail: supportEmail || email,
        orderAlerts,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setMessage('Settings updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Settings update error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setError('For security, please log out and log back in before changing your password or email.');
      } else {
        setError(err.message || 'Error updating settings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div className="header-text">
          <h1>Admin Settings</h1>
          <p>Manage your account credentials, notifications, and administrative preferences.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <RefreshCw size={18} className="spin-icon" /> : <Save size={18} />}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: '#991B1B', marginBottom: '1rem', padding: '12px 16px', backgroundColor: '#FEE2E2', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
          <strong>Error: </strong> {error}
        </div>
      )}
      {message && (
        <div style={{ color: '#065F46', marginBottom: '1rem', padding: '12px 16px', backgroundColor: '#D1FAE5', borderRadius: '8px', border: '1px solid #6EE7B7', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Profile Settings */}
        <div className="admin-card form-section mb-4">
          <h3 className="section-title"><User size={18} className="inline mr-2" /> Administrator Profile</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Admin Display Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Store Administrator"
              />
            </div>
            <div className="form-group">
              <label>Admin Login Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
          </div>
        </div>

        {/* Password Security */}
        <div className="admin-card form-section mb-4">
          <h3 className="section-title"><Lock size={18} className="inline mr-2" /> Change Password</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Leave blank to keep current password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Confirm new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', marginTop: '8px', display: 'block' }}>
            Password must be at least 6 characters. Only fill this in if you want to change your login password.
          </span>
        </div>

        {/* Store Preferences */}
        <div className="admin-card form-section">
          <h3 className="section-title"><Shield size={18} className="inline mr-2" /> Store Preferences</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Store Currency Symbol</label>
              <input 
                type="text" 
                className="form-input" 
                value={storeCurrency} 
                onChange={(e) => setStoreCurrency(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Support Notification Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="support@pawarenterprises.com"
                value={supportEmail} 
                onChange={(e) => setSupportEmail(e.target.value)} 
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
