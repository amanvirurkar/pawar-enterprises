import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Award, ThumbsUp } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './Hero.css';

const Hero = () => {
  const { homepage } = useStoreSettings();

  const renderHeadline = () => {
    // If customized and has newline
    if (homepage?.headline && homepage.headline !== 'आपके घर की हर जरूरत, एक ही जगह。' && homepage.headline.includes('\n')) {
      const parts = homepage.headline.split('\n');
      return (
        <>
          <span className="text-dark">{parts[0]}</span><br />
          <span className="text-primary">{parts[1] || ''}</span><br />
          <span className="text-dark">{parts.slice(2).join(' ')}</span>
        </>
      );
    }

    // Default authentic branding with red highlight
    return (
      <>
        <span className="text-dark">आपके घर की</span><br />
        <span className="text-primary">हर जरूरत,</span><br />
        <span className="text-dark">एक ही जगह।</span>
      </>
    );
  };

  const badgeText = homepage?.heroBadge || 'YOUR HOME OUR PRIORITY';
  const subtitleText = homepage?.subheading || 'Explore a wide range of home appliances, kitchen appliances, electronics and electrical products from top brands at Pawar Enterprises.';
  const primaryBtnText = homepage?.primaryBtnText || 'Shop Now';
  const secondaryBtnText = homepage?.secondaryBtnText || 'Visit Our Store';

  return (
    <section className="hero">
      {/* Content Container */}
      <div className="hero-container">

        {/* Left Content Area */}
        <div className="hero-content">
          <div className="hero-badge">
            {badgeText}
          </div>

          <h1 className="hero-title">
            {renderHeadline()}
          </h1>

          <p className="hero-subtitle">
            {subtitleText}
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-btn-primary">
              {primaryBtnText} <ArrowRight size={18} />
            </Link>
            <a href="#store-location" className="hero-btn-secondary">
              <MapPin size={18} className="text-primary" /> {secondaryBtnText}
            </a>
          </div>

          {/* Bottom Feature Row */}
          <div className="hero-feature-row">
            <div className="hf-item">
              <div className="hf-icon-wrapper"><Users size={20} /></div>
              <div className="hf-text">
                <strong>5000+</strong>
                <span>Happy Customers</span>
              </div>
            </div>

            <div className="hf-item">
              <div className="hf-icon-wrapper"><Award size={20} /></div>
              <div className="hf-text">
                <strong>10+</strong>
                <span>Years Experience</span>
              </div>
            </div>

            <div className="hf-item">
              <div className="hf-icon-wrapper"><ThumbsUp size={20} /></div>
              <div className="hf-text">
                <strong>Top Brands</strong>
                <span>Under One Roof</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
