import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Mail } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './Footer.css';

const Footer = () => {
  const { categories } = useCategories();
  const { storeInfo } = useStoreSettings();

  const activeCategories = (categories || []).filter(c => (c.status || 'Active').toLowerCase() === 'active').slice(0, 5);
  const cleanPhone = (storeInfo?.whatsapp || '+919424457796').replace(/[^0-9]/g, '');

  return (
    <footer className="footer dark-section">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1 */}
          <div className="footer-col">
            <div className="footer-brand brand mb-4">
              <img src="/logo.jpg" alt="Pawar Enterprises Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
            </div>
            <p className="footer-desc">
              Your trusted destination for home appliances, kitchen appliances, electronics and electrical products in {storeInfo?.city || 'Balaghat'}.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4 className="footer-title">Product Categories</h4>
            <ul className="footer-links">
              {activeCategories.map(cat => (
                <li key={cat.id || cat.slug}>
                  <Link to={`/products?category=${cat.slug || cat.id}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-col">
            <h4 className="footer-title">Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} className="contact-icon text-primary" />
                <span>{storeInfo?.address || 'Main Market, Balaghat'}<br/>{storeInfo?.city || 'Balaghat'} - {storeInfo?.pincode || '481001'}</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon text-primary" />
                <span>{storeInfo?.phone || '+91 94244 57796'}</span>
              </li>
              <li>
                <MessageCircle size={18} className="contact-icon text-primary" />
                <span>{storeInfo?.whatsapp || '+91 94244 57796'}</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon text-primary" />
                <span>{storeInfo?.email || 'contact@pawarenterprises.com'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {storeInfo?.businessName || 'Pawar Enterprises'}. All Rights Reserved.</p>
          <p>Balaghat, Madhya Pradesh</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
