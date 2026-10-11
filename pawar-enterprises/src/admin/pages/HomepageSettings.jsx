import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { useStoreSettings, DEFAULT_HOMEPAGE } from '../../context/StoreSettingsContext';

const AdminHomepage = () => {
  const { homepage, updateHomepageSettings, loading } = useStoreSettings();

  const [formData, setFormData] = useState(DEFAULT_HOMEPAGE);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (homepage) {
      setFormData({
        ...DEFAULT_HOMEPAGE,
        ...homepage
      });
    }
  }, [homepage]);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHomepageSettings(formData);
      showToast('Homepage settings saved successfully!');
    } catch (err) {
      console.error('Error saving homepage settings:', err);
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
          <h1>Homepage Settings</h1>
          <p>Customize the content, hero banners, and section visibility of your public homepage.</p>
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
            
            {/* Hero Section */}
            <div className="admin-card form-section">
              <h3 className="section-title">Hero Section Banner</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Top Badge Text</label>
                  <input 
                    type="text" 
                    name="heroBadge" 
                    className="form-input" 
                    value={formData.heroBadge || ''} 
                    onChange={handleChange}
                    placeholder="e.g. YOUR HOME OUR PRIORITY"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Main Headline</label>
                  <input 
                    type="text" 
                    name="headline" 
                    className="form-input" 
                    value={formData.headline || ''} 
                    onChange={handleChange}
                    placeholder="e.g. आपके घर की हर जरूरत, एक ही जगह।"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Subheading</label>
                  <textarea 
                    name="subheading" 
                    className="form-input" 
                    rows="3" 
                    value={formData.subheading || ''} 
                    onChange={handleChange}
                    placeholder="Explore quality home appliances, kitchen appliances..."
                  />
                </div>
                
                <div className="form-group full-width mt-3">
                  <label>Hero Background / Accent Image URL (Optional)</label>
                  <input 
                    type="url" 
                    name="heroImage" 
                    className="form-input" 
                    value={formData.heroImage || ''} 
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.heroImage && (
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={formData.heroImage} 
                        alt="Hero Preview" 
                        style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Primary Button Text</label>
                  <input 
                    type="text" 
                    name="primaryBtnText" 
                    className="form-input" 
                    value={formData.primaryBtnText || ''} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="form-group">
                  <label>Secondary Button Text</label>
                  <input 
                    type="text" 
                    name="secondaryBtnText" 
                    className="form-input" 
                    value={formData.secondaryBtnText || ''} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>

            {/* Quick About Section */}
            <div className="admin-card form-section">
              <h3 className="section-title">Quick About Section</h3>
              <div className="form-group full-width">
                <label>About Heading</label>
                <input 
                  type="text" 
                  name="aboutHeading" 
                  className="form-input" 
                  value={formData.aboutHeading || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group full-width mt-3">
                <label>Short Description</label>
                <textarea 
                  name="aboutShortDesc" 
                  className="form-input" 
                  rows="4" 
                  value={formData.aboutShortDesc || ''} 
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-sidebar">
            {/* Featured Products Toggle */}
            <div className="admin-card form-section">
              <h3 className="section-title">Featured Products Section</h3>
              <div className="toggle-group">
                <div className="toggle-info">
                  <strong>Show Featured Products</strong>
                  <span>Display the featured popular products on the homepage.</span>
                </div>
                <label className="switch mt-3">
                  <input 
                    type="checkbox" 
                    name="showFeatured" 
                    checked={formData.showFeatured} 
                    onChange={handleChange} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <p className="input-hint mt-3">You can mark individual products as "Featured" when adding or editing a product.</p>
            </div>

            {/* Categories Toggle */}
            <div className="admin-card form-section">
              <h3 className="section-title">Category Cards Section</h3>
              <div className="toggle-group">
                <div className="toggle-info">
                  <strong>Show Categories Grid</strong>
                  <span>Display product category cards on the homepage.</span>
                </div>
                <label className="switch mt-3">
                  <input 
                    type="checkbox" 
                    name="showCategories" 
                    checked={formData.showCategories} 
                    onChange={handleChange} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <p className="input-hint mt-3">Categories can be managed in the Categories tab.</p>
            </div>

            <div style={{ marginTop: '12px' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }} 
                disabled={saving}
              >
                <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AdminHomepage;
