import React from 'react';
import { Package, ShieldCheck, IndianRupee, Headphones, ArrowRight } from 'lucide-react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      number: '01',
      icon: Package,
      title: 'Wide Product Range',
      description: 'Home appliances, kitchen appliances, electronics and electrical – all under one roof.',
      linkText: 'Explore Products',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=300' // Placeholder for appliances
    },
    {
      id: 2,
      number: '02',
      icon: ShieldCheck,
      title: 'Genuine Products',
      description: '100% original products from trusted and leading brands with warranty.',
      linkText: 'Trusted Brands',
      image: 'https://images.unsplash.com/photo-1614036417651-1d7eb098935c?auto=format&fit=crop&q=80&w=300' // Placeholder for shield/badge
    },
    {
      id: 3,
      number: '03',
      icon: IndianRupee,
      title: 'Competitive Pricing',
      description: 'Best prices with great value and exclusive offers for our customers.',
      linkText: 'View Offers',
      image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80&w=300' // Placeholder for price tag
    },
    {
      id: 4,
      number: '04',
      icon: Headphones,
      title: 'Customer Support',
      description: 'Friendly and knowledgeable support to help you choose the right product.',
      linkText: 'Get in Touch',
      image: 'https://images.unsplash.com/photo-1520697830682-8f192b67f1a3?auto=format&fit=crop&q=80&w=300' // Placeholder for chat bubble
    }
  ];

  return (
    <section className="section why-choose-us-section" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Background decorations */}
      <div className="wcu-bg-circle wcu-bg-left"></div>
      <div className="wcu-bg-circle wcu-bg-right"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="stats-eyebrow-wrapper justify-center">
            <span className="stats-line" style={{ backgroundColor: '#ED1C24' }}></span>
            <p className="stats-eyebrow" style={{ color: '#64748B' }}>WHY CHOOSE US</p>
            <span className="stats-line" style={{ backgroundColor: '#ED1C24' }}></span>
          </div>
          <h2 className="section-title text-3xl font-black mt-4" style={{ fontSize: '2.5rem', color: '#111827', letterSpacing: '-1px' }}>
            Why Choose <span className="text-primary">Pawar Enterprises?</span>
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto" style={{ color: '#64748B', marginLeft: '270px' }}>
            Your one-stop destination for genuine products, best prices and reliable service in Balaghat. We are committed to making your home and lifestyle better.
          </p>
        </div>

        <div className="wcu-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="wcu-card">
                <div className="wcu-number">{feature.number}</div>
                
                <div className="wcu-icon-wrapper">
                  <IconComponent size={24} className="text-primary" />
                </div>
                
                <h3 className="wcu-title">{feature.title}</h3>
                <p className="wcu-desc">{feature.description}</p>
                
                <div className="wcu-footer">
                  <div className="wcu-link-text">
                    {feature.linkText}
                    <div className="wcu-link-underline"></div>
                  </div>
                  <div className="wcu-arrow-btn">
                    <ArrowRight size={18} />
                  </div>
                </div>

                <div className="wcu-floating-image-wrapper">
                  <div className="wcu-floating-circle"></div>
                  <img src={feature.image} alt={feature.title} className="wcu-floating-image" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
