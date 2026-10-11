import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Users, Smile, Package, Trophy, 
  Diamond, UserCheck, Settings, Headphones,
  ShieldCheck, IndianRupee, HeartHandshake
} from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './About.css';

const About = () => {
  const { about, seo } = useStoreSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (seo?.aboutTitle) {
      document.title = seo.aboutTitle;
    }
    if (seo?.aboutDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = seo.aboutDescription;
    }
  }, [seo]);

  const eyebrow = about?.eyebrow || 'ABOUT US';
  const heading = about?.heading || 'Pawar Enterprises Your Trusted Partner for a Better Home.';
  const fullDescription = about?.fullDescription || 'Pawar Enterprises is a trusted name in Balaghat, offering a wide range of home appliances, kitchen appliances, electronics and electrical products from top brands. We are committed to providing genuine products, fair pricing and excellent customer service to make your home and lifestyle better.';
  const aboutImage = about?.aboutImage || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200';
  const storyTitle = about?.storyTitle || 'A Local Store With A Bigger Vision';
  const storyDescription = about?.storyDescription || 'Started in Balaghat, Pawar Enterprises has always focused on one thing - giving our customers the best products, honest advice and reliable service. Over the years, we have built strong relationships with leading brands and thousands of happy customers.';
  const happyCustomers = about?.happyCustomers || '5000+';
  const experienceYears = about?.experienceYears || '10+';
  const productsCount = about?.productsCount || '1000+';
  const topBrandsCount = about?.topBrandsCount || '20+';

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg-elements">
          <div className="ah-bg-circle"></div>
          <div className="ah-bg-curve"></div>
          <div className="ah-bg-glow"></div>
          <div className="ah-bg-dots"></div>
          <div className="ah-bg-lines">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="ah-bg-watermark">PAWAR</div>
        </div>
        <div className="container relative z-10">
          <div className="about-hero-grid">
            <div className="about-hero-content">
              <div className="stats-eyebrow-wrapper justify-start mb-4">
                <span className="stats-line"></span>
                <p className="stats-eyebrow" style={{ color: 'var(--color-text-secondary)' }}>{eyebrow}</p>
              </div>
              <h1 className="about-title" style={{ whiteSpace: 'pre-line' }}>
                {heading}
              </h1>
              <p className="about-desc">
                {fullDescription}
              </p>
              <div className="about-hero-actions">
                <Link to="/products" className="btn btn-primary btn-round">
                  Explore Products <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn btn-outline-red btn-round">
                  Contact Us <ArrowRight size={18} />
                </Link>
              </div>
              <div className="about-customers">
                <div className="avatar-group">
                  <img src="https://i.pravatar.cc/100?img=11" alt="Customer" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=32" alt="Customer" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=33" alt="Customer" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=12" alt="Customer" className="avatar" />
                </div>
                <div className="customer-stats">
                  <strong>{happyCustomers}</strong>
                  <span>Happy Customers</span>
                </div>
              </div>
            </div>
            
            <div className="about-hero-image-area">
              <img 
                src={aboutImage} 
                alt="Store Interior" 
                className="about-main-img"
              />
              
              <div className="about-floating-stats">
                <div className="about-stat-card">
                  <div className="stat-icon-red"><Users size={20} /></div>
                  <strong>{experienceYears}</strong>
                  <span>Years Experience</span>
                </div>
                <div className="about-stat-card">
                  <div className="stat-icon-red"><Smile size={20} /></div>
                  <strong>{happyCustomers}</strong>
                  <span>Happy Customers</span>
                </div>
                <div className="about-stat-card">
                  <div className="stat-icon-red"><Package size={20} /></div>
                  <strong>{productsCount}</strong>
                  <span>Products</span>
                </div>
                <div className="about-stat-card">
                  <div className="stat-icon-red"><Trophy size={20} /></div>
                  <strong>{topBrandsCount}</strong>
                  <span>Top Brands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section bg-background">
        <div className="container">
          <div className="story-grid">
            <div className="story-single-image">
              <img src={aboutImage} alt="Pawar Enterprises Store" className="about-main-img" style={{ height: '100%', objectFit: 'cover', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </div>
            
            <div className="story-content">
              <div className="stats-eyebrow-wrapper justify-start mb-4">
                <span className="stats-line"></span>
                <p className="stats-eyebrow" style={{ color: 'var(--color-text-secondary)' }}>OUR STORY</p>
              </div>
              <h2 className="story-title" style={{ whiteSpace: 'pre-line' }}>
                {storyTitle}
              </h2>
              <p className="story-desc">
                {storyDescription}
              </p>
              
              <div className="story-features">
                <div className="sf-item">
                  <Diamond className="text-primary mb-2" size={32} strokeWidth={1.5} />
                  <span>Trusted by<br/>Local Community</span>
                </div>
                <div className="sf-item">
                  <UserCheck className="text-primary mb-2" size={32} strokeWidth={1.5} />
                  <span>Expert<br/>Guidance</span>
                </div>
                <div className="sf-item">
                  <Settings className="text-primary mb-2" size={32} strokeWidth={1.5} />
                  <span>After-Sales<br/>Support</span>
                </div>
                <div className="sf-item">
                  <Headphones className="text-primary mb-2" size={32} strokeWidth={1.5} />
                  <span>Customer First<br/>Approach</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section values-section">
        <div className="values-bg-lines"></div>
        <div className="container relative z-10">
          <div className="values-header">
            <div className="values-header-left">
              <div className="stats-eyebrow-wrapper justify-start mb-4">
                <span className="stats-line"></span>
                <p className="stats-eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>OUR VALUES</p>
              </div>
              <h2 className="values-title">
                What We <span className="text-primary">Stand For</span>
              </h2>
              <p className="values-desc">
                Our values guide everything we do and help us serve you better every day.
              </p>
            </div>
            
            <div className="values-cards-container">
              <div className="value-card">
                <div className="vc-icon-wrapper"><ShieldCheck size={24} /></div>
                <h4>Genuine Products</h4>
                <p>100% original products from trusted brands.</p>
              </div>
              <div className="value-card">
                <div className="vc-icon-wrapper"><IndianRupee size={24} /></div>
                <h4>Best Prices</h4>
                <p>Competitive pricing with great value.</p>
              </div>
              <div className="value-card">
                <div className="vc-icon-wrapper"><Users size={24} /></div>
                <h4>Customer Satisfaction</h4>
                <p>Your happiness is our priority.</p>
              </div>
              <div className="value-card">
                <div className="vc-icon-wrapper"><HeartHandshake size={24} /></div>
                <h4>Long-Term Trust</h4>
                <p>Building relationships that last.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
