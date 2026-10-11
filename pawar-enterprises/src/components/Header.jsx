import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Clock, Search, ChevronDown,
  Heart, ShoppingCart, User, MessageCircle, ShieldCheck, Store,
  Truck, Tag, Menu, X
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import { useCategories } from '../context/CategoriesContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { storeInfo } = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute suggestions based on searchQuery
  const suggestions = searchQuery.trim()
    ? products.filter(p =>
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 6)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (slug) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/product/${slug}`);
  };

  const activeCategories = (categories || []).filter(c => (c.status || 'Active').toLowerCase() === 'active');
  const cleanPhone = (storeInfo?.whatsapp || '+919424457796').replace(/[^0-9]/g, '');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="new-header">
      {/* Main Header */}
      <div className="header-main">
        <div className="container header-main-container">
          
          <div className="header-left-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Hamburger Button */}
            <button className="mobile-menu-toggle d-lg-none" onClick={toggleMobileMenu}>
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="brand">
              <img src="/logo.jpg" alt="Pawar Enterprises Logo" className="header-logo-img" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="header-search-wrapper hide-mobile" style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
            <form className="header-search" onSubmit={handleSearch} style={{ maxWidth: '100%' }}>
              <Search size={18} className="search-icon-left" />
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <div className="search-category-container">
                <div className="search-category">
                  All Categories <ChevronDown size={14} />
                </div>
                <div className="search-dropdown">
                  {activeCategories.map(cat => (
                    <Link key={cat.id || cat.slug} to={`/products?category=${cat.slug || cat.id}`} className="dropdown-item">
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <button type="submit" className="search-submit">
                <Search size={18} />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim() !== '' && (
              <div className="search-suggestions-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion.slug)}
                    >
                      <div className="suggestion-img-wrap">
                        <img src={suggestion.images && suggestion.images[0] ? suggestion.images[0] : '/placeholder.jpg'} alt={suggestion.name} />
                      </div>
                      <div className="suggestion-info">
                        <span className="suggestion-title">{suggestion.name}</span>
                        <span className="suggestion-cat">in {(suggestion.mainCategory || suggestion.category || '').replace('-', ' ')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="suggestion-empty">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="header-actions">
            <Link to="/wishlist" className="action-item hide-mobile" style={{ textDecoration: 'none' }}>
              <div className="action-icon-wrap">
                <Heart size={22} />
                <span className="badge">{wishlist.length}</span>
              </div>
              <span className="action-label">Wishlist</span>
            </Link>
            <div className="action-item">
              <div className="action-icon-wrap">
                <ShoppingCart size={22} />
                <span className="badge">2</span>
              </div>
              <span className="action-label hide-mobile">Cart</span>
            </div>
            <div className="action-item hide-mobile">
              <div className="action-icon-wrap">
                <User size={22} />
              </div>
              <span className="action-label">Account</span>
            </div>
            <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary whatsapp-btn hide-mobile">
              <MessageCircle size={18} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Only visible on small screens) */}
      <div className="mobile-search-wrapper container d-lg-none">
        <form className="header-search" onSubmit={handleSearch} style={{ maxWidth: '100%', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-submit">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Floating Navigation Bar (Desktop) */}
      <div className="header-nav-wrapper hide-mobile">
        <div className="container">
          <div className="header-nav-bar">
            <ul className="nav-links">
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
              <li><Link to="/products" className={location.pathname.startsWith('/product') ? 'active' : ''}>Products</Link></li>
              <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
              <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
            </ul>
            <div className="nav-info">
              <div className="info-item">
                <div className="info-icon-circle">
                  <ShieldCheck size={18} className="info-icon" />
                </div>
                <div className="info-text">
                  <strong>100% Genuine</strong>
                  <span>Products</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-circle">
                  <Truck size={18} className="info-icon" />
                </div>
                <div className="info-text">
                  <strong>Fast Support</strong>
                  <span>& Guidance</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-circle">
                  <Store size={18} className="info-icon" />
                </div>
                <div className="info-text">
                  <strong>Visit Our Store</strong>
                  <span>Balaghat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'active' : ''}`} style={{ display: mobileMenuOpen ? 'block' : 'none' }} onClick={toggleMobileMenu}></div>
      
      {/* Mobile Sidebar Menu */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <img src="/logo.jpg" alt="Pawar Enterprises Logo" className="mobile-drawer-logo" />
          <button className="mobile-drawer-close" onClick={toggleMobileMenu}>
            <X size={24} />
          </button>
        </div>
        <div className="mobile-drawer-body">
          <ul className="mobile-nav-links">
            <li><Link to="/" className="mobile-nav-item" onClick={toggleMobileMenu}>Home</Link></li>
            <li><Link to="/products" className="mobile-nav-item" onClick={toggleMobileMenu}>Products</Link></li>
            <li><Link to="/about" className="mobile-nav-item" onClick={toggleMobileMenu}>About</Link></li>
            <li><Link to="/contact" className="mobile-nav-item" onClick={toggleMobileMenu}>Contact</Link></li>
            <li><Link to="/wishlist" className="mobile-nav-item" onClick={toggleMobileMenu}>Wishlist ({wishlist.length})</Link></li>
          </ul>
          <div className="mobile-drawer-actions">
            <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <MessageCircle size={18} /> WhatsApp Us
            </a>
            <Link to="/admin/login" className="mobile-admin-link" onClick={toggleMobileMenu}>Admin Login</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
