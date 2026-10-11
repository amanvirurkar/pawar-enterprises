import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, MessageSquare, MapPin, 
  Clock, ArrowRight, ShieldCheck, 
  Tag, HeartHandshake, CheckCircle2,
  Mail, Navigation
} from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './Contact.css';

const Contact = () => {
  const { storeInfo, seo } = useStoreSettings();
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (seo?.contactTitle) {
      document.title = seo.contactTitle;
    }
    if (seo?.contactDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = seo.contactDescription;
    }
  }, [seo]);

  const cleanPhone = (storeInfo?.phone || '+91 94244 57796').replace(/[^0-9+]/g, '');
  const cleanWhatsApp = (storeInfo?.whatsapp || '+91 94244 57796').replace(/[^0-9]/g, '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      e.target.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      
      {/* 1. CONTACT HERO */}
      <section className="ch-redesign">
        <div className="container relative z-10 h-full">
          <div className="ch-split">
            
            {/* Left Content */}
            <div className="ch-left animate-fade-up">
              <span className="ch-eyebrow">GET IN TOUCH</span>
              <h1 className="ch-title">
                Let's Start a<br/>
                <span className="text-primary">Conversation.</span>
              </h1>
              <p className="ch-desc">
                Have a question about our products, pricing, installation, 
                or need help choosing the right appliance? 
                Our team is here to help.
              </p>
            </div>

            {/* Right Decorative Composition */}
            <div className="ch-right hide-mobile">
              <div className="ch-deco-container">
                <div className="ch-deco-circle-large"></div>
                <div className="ch-deco-circle-small"></div>
                <div className="ch-deco-dots"></div>
                <div className="ch-deco-curve-1"></div>
                <div className="ch-deco-curve-2"></div>
                <div className="ch-deco-glow"></div>
                
                {/* Floating Outline Icons */}
                <div className="ch-floating-icon fi-1"><PhoneCall size={24} strokeWidth={1.5} /></div>
                <div className="ch-floating-icon fi-2"><MessageSquare size={24} strokeWidth={1.5} /></div>
                <div className="ch-floating-icon fi-3"><MapPin size={24} strokeWidth={1.5} /></div>
                <div className="ch-floating-icon fi-4"><HeartHandshake size={24} strokeWidth={1.5} /></div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. QUICK CONTACT CARDS */}
      <section className="quick-contact-section">
        <div className="container relative z-20">
          <div className="qc-grid">
            
            <a href={`tel:${cleanPhone}`} className="qc-card animate-fade-up delay-1">
              <div className="qc-icon">
                <PhoneCall size={22} />
              </div>
              <div className="qc-info">
                <span>CALL US</span>
                <strong>{storeInfo?.phone || '+91 94244 57796'}</strong>
              </div>
            </a>

            <a href={`https://wa.me/${cleanWhatsApp}`} className="qc-card animate-fade-up delay-2" target="_blank" rel="noreferrer">
              <div className="qc-icon">
                <MessageSquare size={22} />
              </div>
              <div className="qc-info">
                <span>WHATSAPP</span>
                <strong>{storeInfo?.whatsapp || '+91 94244 57796'}</strong>
              </div>
            </a>

            <div className="qc-card animate-fade-up delay-3">
              <div className="qc-icon">
                <MapPin size={22} />
              </div>
              <div className="qc-info">
                <span>VISIT STORE</span>
                <strong>{storeInfo?.address || 'Main Market, Balaghat'}</strong>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MAIN CONTACT SECTION */}
      <section className="cm-redesign">
        <div className="container">
          <div className="cm-grid">
            
            {/* LEFT: STORE INFO & MAP */}
            <div className="cm-left animate-fade-up delay-1">
              <div className="cm-info-panel">
                <h2 className="cm-heading">Visit {storeInfo?.businessName || 'Pawar Enterprises'}</h2>
                <p className="cm-desc">
                  Visit our store in {storeInfo?.city || 'Balaghat'} for genuine products, 
                  best prices and personal assistance.
                </p>

                <div className="cm-rows">
                  <div className="cm-row">
                    <div className="cm-row-icon"><MapPin size={20} /></div>
                    <div className="cm-row-content">
                      <span className="cm-label">Address</span>
                      <p>{storeInfo?.address || 'Main Market, Balaghat'},<br/>{storeInfo?.city || 'Balaghat'} – {storeInfo?.pincode || '481001'}</p>
                    </div>
                  </div>
                  
                  <div className="cm-row">
                    <div className="cm-row-icon"><PhoneCall size={20} /></div>
                    <div className="cm-row-content">
                      <span className="cm-label">Phone</span>
                      <p>{storeInfo?.phone || '+91 94244 57796'}</p>
                    </div>
                  </div>
                  
                  <div className="cm-row">
                    <div className="cm-row-icon"><MessageSquare size={20} /></div>
                    <div className="cm-row-content">
                      <span className="cm-label">WhatsApp</span>
                      <p>{storeInfo?.whatsapp || '+91 94244 57796'}</p>
                    </div>
                  </div>
                  
                  <div className="cm-row">
                    <div className="cm-row-icon"><Clock size={20} /></div>
                    <div className="cm-row-content">
                      <span className="cm-label">Store Hours</span>
                      <p>Monday – Saturday: 10:00 AM – 8:00 PM<br/>Sunday: Closed / Enquiries on WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. PREMIUM MAP CONTAINER */}
              <div className="cm-map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14695.539825421523!2d80.1837497!3d21.8105747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a2ba94a55555555%3A0x1234567890abcdef!2sBalaghat%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  className="cm-iframe"
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Pawar Enterprises Balaghat Map"
                ></iframe>
                
                <div className="cm-map-overlay">
                  <div className="cm-map-pin">
                    <div className="cm-pin-dot"></div>
                  </div>
                  <a href="https://maps.google.com/?q=Balaghat" target="_blank" rel="noreferrer" className="cm-map-btn">
                    Get Directions <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT: PREMIUM CONTACT FORM */}
            <div className="cm-right animate-fade-up delay-2">
              <div className="cf-card">
                <h2 className="cf-heading">Send us a Message</h2>
                <p className="cf-subtitle">
                  Tell us what you need and our team will get back to you.
                </p>

                <form className="cf-form" onSubmit={handleSubmit}>
                  <div className="cf-row">
                    <div className="cf-group">
                      <label htmlFor="fName">First Name</label>
                      <input type="text" id="fName" required />
                    </div>
                    <div className="cf-group">
                      <label htmlFor="lName">Last Name</label>
                      <input type="text" id="lName" required />
                    </div>
                  </div>

                  <div className="cf-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" required />
                  </div>

                  <div className="cf-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" required />
                  </div>

                  <div className="cf-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" required />
                  </div>

                  <div className="cf-group">
                    <label htmlFor="msg">Message</label>
                    <textarea id="msg" placeholder="How can we help you?" required></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className={`cf-submit-btn ${formStatus !== 'idle' ? formStatus : ''}`}
                    disabled={formStatus !== 'idle'}
                  >
                    {formStatus === 'idle' && <>Send Message <ArrowRight size={18} /></>}
                    {formStatus === 'submitting' && <div className="cf-loader"></div>}
                    {formStatus === 'success' && <><CheckCircle2 size={18} /> Message Sent</>}
                  </button>
                </form>

                {/* 8. CREATIVE TRUST STRIP */}
                <div className="cf-trust-strip">
                  <div className="cf-trust-item">
                    <ShieldCheck size={16} className="cf-trust-icon" />
                    <span>Genuine Products</span>
                  </div>
                  <div className="cf-trust-item">
                    <Tag size={16} className="cf-trust-icon" />
                    <span>Best Prices</span>
                  </div>
                  <div className="cf-trust-item">
                    <MapPin size={16} className="cf-trust-icon" />
                    <span>Trusted Local Store</span>
                  </div>
                  <div className="cf-trust-item">
                    <HeartHandshake size={16} className="cf-trust-icon" />
                    <span>Fast Support</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
