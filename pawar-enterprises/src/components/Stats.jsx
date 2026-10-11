import React from 'react';
import { ShieldCheck, Users, Package, Award } from 'lucide-react';
import './Stats.css';

const Stats = () => {
  return (
    <section className="stats-section section bg-background">
      {/* Background decorative elements */}
      <div className="stats-bg-shape shape-1"></div>
      <div className="stats-bg-shape shape-2"></div>
      <div className="stats-bg-shape shape-3"></div>
      <div className="stats-bg-dot dot-1"></div>
      <div className="stats-bg-dot dot-2"></div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <div className="stats-eyebrow-wrapper">
            <span className="stats-line"></span>
            <p className="stats-eyebrow">TRUSTED BY THOUSANDS</p>
            <span className="stats-line"></span>
          </div>
          <h2 className="section-title text-3xl font-bold mt-4">
            Pawar Enterprises <span className="text-primary">in Numbers</span>
          </h2>
          <p className="text-muted text-center mt-4 max-w-2xl mx-auto" style={{ marginLeft: '270px' }}>
            Serving Balaghat with genuine products, best prices and trusted service.<br/>
            Your one-stop store for home appliances, electronics and more.
          </p>
        </div>

        <div className="stats-grid">
          {/* Card 1 */}
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <ShieldCheck className="stat-icon" size={28} />
            </div>
            <h3 className="stat-number">10+</h3>
            <p className="stat-title">YEARS OF EXPERIENCE</p>
            <p className="stat-desc">Serving our community<br/>with trust and quality.</p>
          </div>

          {/* Card 2 */}
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Users className="stat-icon" size={28} />
            </div>
            <h3 className="stat-number">5000+</h3>
            <p className="stat-title">HAPPY CUSTOMERS</p>
            <p className="stat-desc">Trusted by families<br/>across Balaghat.</p>
          </div>

          {/* Card 3 */}
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Package className="stat-icon" size={28} />
            </div>
            <h3 className="stat-number">100+</h3>
            <p className="stat-title">PRODUCTS</p>
            <p className="stat-desc" >Wide range of genuine<br/>products from top brands.</p>
          </div>

          {/* Card 4 */}
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Award className="stat-icon" size={28} />
            </div>
            <h3 className="stat-number">20+</h3>
            <p className="stat-title">TOP BRANDS</p>
            <p className="stat-desc">Leading national<br/>and global brands.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
