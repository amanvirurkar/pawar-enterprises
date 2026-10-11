import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Globe } from 'lucide-react';
import { useStoreSettings, DEFAULT_SEO } from '../../context/StoreSettingsContext';

const SEOSettings = () => {
  const { seo, updateSeoSettings, loading } = useStoreSettings();

  const [formData, setFormData] = useState(DEFAULT_SEO);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (seo) {
      setFormData({
        ...DEFAULT_SEO,
        ...seo
      });
    }
  }, [seo]);

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
      await updateSeoSettings(formData);
      showToast('SEO settings saved successfully!');
    } catch (err) {
      console.error('Error saving SEO settings:', err);
      showToast(err.message || 'Failed to save SEO settings', 'error');
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
          <h1>Global SEO Settings</h1>
          <p>Optimize your website for search engines like Google, Bing, and social sharing previews.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? <RefreshCw size={18} className="spin-icon" /> : <Save size={18} />} 
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Homepage SEO */}
        <div className="admin-card form-section mb-4">
          <h3 className="section-title"><Globe size={16} className="inline mr-2" /> Homepage SEO Metadata</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Homepage Meta Title</label>
              <input 
                type="text" 
                name="homeTitle" 
                className="form-input" 
                value={formData.homeTitle || ''} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label>Homepage Meta Description</label>
              <textarea 
                name="homeDescription" 
                className="form-input" 
                rows="3" 
                value={formData.homeDescription || ''} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Products Page SEO */}
        <div className="admin-card form-section mb-4">
          <h3 className="section-title"><Globe size={16} className="inline mr-2" /> Products Catalogue SEO</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Products Page Meta Title</label>
              <input 
                type="text" 
                name="productsTitle" 
                className="form-input" 
                value={formData.productsTitle || ''} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label>Products Page Meta Description</label>
              <textarea 
                name="productsDescription" 
                className="form-input" 
                rows="3" 
                value={formData.productsDescription || ''} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* About & Contact SEO */}
        <div className="admin-card form-section mb-4">
          <h3 className="section-title"><Globe size={16} className="inline mr-2" /> About & Contact Page SEO</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>About Page Title</label>
              <input 
                type="text" 
                name="aboutTitle" 
                className="form-input" 
                value={formData.aboutTitle || ''} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Contact Page Title</label>
              <input 
                type="text" 
                name="contactTitle" 
                className="form-input" 
                value={formData.contactTitle || ''} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label>About Page Meta Description</label>
              <textarea 
                name="aboutDescription" 
                className="form-input" 
                rows="2" 
                value={formData.aboutDescription || ''} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label>Contact Page Meta Description</label>
              <textarea 
                name="contactDescription" 
                className="form-input" 
                rows="2" 
                value={formData.contactDescription || ''} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={saving}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save All SEO Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SEOSettings;
