import React, { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Mail, Clock, MessageCircle, RefreshCw } from 'lucide-react';
import { useStoreSettings, DEFAULT_STORE_INFO } from '../../context/StoreSettingsContext';
import './StoreInfo.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminStoreInfo = () => {
  const { storeInfo, updateStoreInfoSettings, loading } = useStoreSettings();

  const [formData, setFormData] = useState(DEFAULT_STORE_INFO);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (storeInfo) {
      setFormData({
        ...DEFAULT_STORE_INFO,
        ...storeInfo,
        hours: {
          ...DEFAULT_STORE_INFO.hours,
          ...(storeInfo.hours || {})
        }
      });
    }
  }, [storeInfo]);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHourToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          open: !prev.hours[day]?.open
        }
      }
    }));
  };

  const handleHourChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStoreInfoSettings(formData);
      showToast('Store information saved successfully!');
    } catch (err) {
      console.error('Error saving store info:', err);
      showToast(err.message || 'Failed to save store info', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`admin-toast ${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}

      <div className="admin-page-header">
        <div className="header-text">
          <h1>Store Information</h1>
          <p>Update your business details, contact information, map location, and operating hours.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? <RefreshCw size={18} className="spin-icon" /> : <Save size={18} />} 
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="store-info-layout">
          <div className="store-info-main">
            {/* General Information */}
            <div className="admin-card form-section">
              <h3 className="section-title">General Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Business Name</label>
                  <input 
                    type="text" 
                    name="businessName" 
                    className="form-input" 
                    value={formData.businessName || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Store Address</label>
                  <textarea 
                    name="address" 
                    className="form-input" 
                    rows="3" 
                    value={formData.address || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    name="city" 
                    className="form-input" 
                    value={formData.city || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input 
                    type="text" 
                    name="pincode" 
                    className="form-input" 
                    value={formData.pincode || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="admin-card form-section">
              <h3 className="section-title">Contact Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label><Phone size={14} className="mr-1 inline" /> Primary Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    className="form-input" 
                    value={formData.phone || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label><MessageCircle size={14} className="mr-1 inline" /> WhatsApp Number</label>
                  <input 
                    type="text" 
                    name="whatsapp" 
                    className="form-input" 
                    value={formData.whatsapp || ''} 
                    onChange={handleChange}
                  />
                  <span className="input-hint">Used for direct WhatsApp buttons on the store website.</span>
                </div>
                <div className="form-group full-width">
                  <label><Mail size={14} className="mr-1 inline" /> Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-input" 
                    value={formData.email || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Location & Maps */}
            <div className="admin-card form-section">
              <h3 className="section-title"><MapPin size={16} className="inline mr-2" /> Google Maps Integration</h3>
              <div className="form-group full-width">
                <label>Google Maps Embed / Share URL</label>
                <input 
                  type="url" 
                  name="mapsUrl" 
                  className="form-input" 
                  placeholder="https://maps.google.com/..." 
                  value={formData.mapsUrl || ''} 
                  onChange={handleChange}
                />
                <span className="input-hint">This link will open when visitors click "Get Directions" on the website.</span>
              </div>
            </div>
          </div>

          {/* Sidebar - Business Hours */}
          <div className="store-info-sidebar">
            <div className="admin-card form-section">
              <h3 className="section-title"><Clock size={16} className="inline mr-2" /> Business Hours</h3>
              
              <div className="business-hours-list">
                {DAYS.map((day) => {
                  const dayInfo = formData.hours?.[day] || { open: day !== 'Sunday', from: '10:00', to: '20:00' };
                  return (
                    <div key={day} className="day-row">
                      <div className="day-name">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={!!dayInfo.open} 
                            onChange={() => handleHourToggle(day)}
                          />
                          <span>{day}</span>
                        </label>
                      </div>
                      {dayInfo.open ? (
                        <div className="time-inputs">
                          <input 
                            type="time" 
                            className="form-input time-sm" 
                            value={dayInfo.from || '10:00'} 
                            onChange={(e) => handleHourChange(day, 'from', e.target.value)}
                          />
                          <span>to</span>
                          <input 
                            type="time" 
                            className="form-input time-sm" 
                            value={dayInfo.to || '20:00'} 
                            onChange={(e) => handleHourChange(day, 'to', e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="closed-label">Closed</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '24px' }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }} 
                  disabled={saving}
                >
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Store Info'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminStoreInfo;
