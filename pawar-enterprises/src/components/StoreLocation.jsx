import React from 'react';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './StoreLocation.css';

const StoreLocation = () => {
  const { storeInfo } = useStoreSettings();

  const address = storeInfo?.address || 'Main Market, Balaghat';
  const cityState = `${storeInfo?.city || 'Balaghat'}, Madhya Pradesh - ${storeInfo?.pincode || '481001'}`;
  const phone = storeInfo?.phone || '+91 94244 57796';
  const mapsUrl = storeInfo?.mapsUrl || 'https://maps.google.com';

  return (
    <section id="store-location" className="store-location section bg-background">
      <div className="container">
        <div className="location-grid">
          <div className="location-content">
            <p className="section-eyebrow">OUR LOCATION</p>
            <h2 className="section-title text-3xl font-bold mb-4">
              Visit Our <span className="text-primary">Store</span>
            </h2>
            <p className="text-secondary mb-8">
              Come and explore our range of products at our store in {storeInfo?.city || 'Balaghat'}. Our team is always ready to help you find the right product for your needs.
            </p>

            <div className="contact-details mb-8">
              <div className="contact-item">
                <div className="contact-icon-wrapper-simple">
                  <MapPin size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{address},</h3>
                  <p className="font-bold text-lg">{cityState}</p>
                </div>
              </div>
            </div>

            <div className="location-actions">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary location-btn">
                Get Directions <ArrowRight size={16} />
              </a>
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="btn btn-secondary location-btn">
                <Phone size={18} /> Call Now
              </a>
            </div>
          </div>

          <div className="location-map">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=600" alt="Map" className="map-image" />
            <div className="map-pin-overlay">
              <MapPin size={32} className="text-primary" fill="white" />
              <div className="pin-tooltip">
                <strong>{storeInfo?.businessName || 'Pawar Enterprises'}</strong>
                <span>{storeInfo?.city || 'Balaghat'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocation;
