import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useStoreSettings, DEFAULT_ABOUT } from '../../context/StoreSettingsContext';

const AboutSettings = () => {
  const { about, updateAboutSettings, loading } = useStoreSettings();

  const [formData, setFormData] = useState(DEFAULT_ABOUT);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (about) {
      setFormData({
        ...DEFAULT_ABOUT,
        ...about
      });
    }
  }, [about]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAboutSettings(formData);
      showToast('About page settings saved successfully!');
    } catch (err) {
      console.error('Error saving about settings:', err);
      showToast(err.message || 'Failed to save settings', 'error');
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
          <h1>About Page Settings</h1>
          <p>Manage the story, statistics, and showcase content on your public About Us page.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? <RefreshCw size={18} className="spin-icon" /> : <Save size={18} />} 
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="product-form-layout">
          <div className="form-main-content">
            {/* Main Content */}
            <div className="admin-card form-section">
              <h3 className="section-title">Hero & Main Introduction</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Eyebrow Tagline</label>
                  <input 
                    type="text" 
                    name="eyebrow" 
                    className="form-input" 
                    value={formData.eyebrow || ''} 
                    onChange={handleChange}
                    placeholder="ABOUT US"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Main Heading</label>
                  <input 
                    type="text" 
                    name="heading" 
                    className="form-input" 
                    value={formData.heading || ''} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Full Description</label>
                  <textarea 
                    name="fullDescription" 
                    className="form-input" 
                    rows="6" 
                    value={formData.fullDescription || ''} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="form-group full-width mt-2">
                  <label>About Showcase Image URL</label>
                  <input 
                    type="url" 
                    name="aboutImage" 
                    className="form-input" 
                    value={formData.aboutImage || ''} 
                    onChange={handleChange} 
                  />
                  {formData.aboutImage && (
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={formData.aboutImage} 
                        alt="About preview" 
                        style={{ maxHeight: '160px', borderRadius: '10px', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Our Story Section */}
            <div className="admin-card form-section">
              <h3 className="section-title">Our Story Section</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Story Title</label>
                  <input 
                    type="text" 
                    name="storyTitle" 
                    className="form-input" 
                    value={formData.storyTitle || ''} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Story Description</label>
                  <textarea 
                    name="storyDescription" 
                    className="form-input" 
                    rows="5" 
                    value={formData.storyDescription || ''} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-sidebar">
            {/* Key Statistics Cards */}
            <div className="admin-card form-section">
              <h3 className="section-title">Key Numbers & Badges</h3>
              <div className="form-group mb-3">
                <label>Happy Customers</label>
                <input 
                  type="text" 
                  name="happyCustomers" 
                  className="form-input" 
                  value={formData.happyCustomers || '5000+'} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group mb-3">
                <label>Years Experience</label>
                <input 
                  type="text" 
                  name="experienceYears" 
                  className="form-input" 
                  value={formData.experienceYears || '10+'} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group mb-3">
                <label>Products Count</label>
                <input 
                  type="text" 
                  name="productsCount" 
                  className="form-input" 
                  value={formData.productsCount || '1000+'} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group mb-3">
                <label>Top Brands Count</label>
                <input 
                  type="text" 
                  name="topBrandsCount" 
                  className="form-input" 
                  value={formData.topBrandsCount || '20+'} 
                  onChange={handleChange} 
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }} 
                  disabled={saving}
                >
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AboutSettings;
