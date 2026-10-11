import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle, Tag, Users, Gem, Headphones } from 'lucide-react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import StoreLocation from '../components/StoreLocation';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { useCategories } from '../context/CategoriesContext';
import { useProducts } from '../context/ProductsContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './Home.css';

const Home = () => {
  const { categories } = useCategories();
  const { products } = useProducts();
  const { homepage, seo } = useStoreSettings();

  useEffect(() => {
    if (seo?.homeTitle) {
      document.title = seo.homeTitle;
    }
    if (seo?.homeDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = seo.homeDescription;
    }
  }, [seo]);

  const featuredProducts = products ? products.filter(p => p.featured).slice(0, 4) : [];

  // Filter only active categories for public display
  const activeCategories = (categories || []).filter(c => (c.status || 'Active').toLowerCase() === 'active');

  // Compute live product count for each category
  const categoriesWithCounts = activeCategories.map(cat => {
    const count = (products || []).filter(p => {
      const c = p.mainCategory || p.category;
      return c === cat.slug || c === cat.name || c === cat.id;
    }).length;

    return {
      ...cat,
      productCount: count > 0 ? `${count}+` : (cat.productCount || 'Explore')
    };
  });

  return (
    <div className="home-page">
      <Hero />
      <Stats />
      
      {/* Categories Section */}
      {homepage.showCategories !== false && (
        <section className="section bg-background relative overflow-hidden">
          <div className="container relative z-10">
            <div className="text-center mb-16 relative">
              <div className="stats-eyebrow-wrapper">
                <span className="stats-line"></span>
                <p className="stats-eyebrow">OUR CATEGORIES</p>
                <span className="stats-line"></span>
              </div>
              
              <h2 className="section-title text-3xl font-bold mt-4" style={{fontSize: '2.5rem'}}>
                Explore Our <span className="text-primary">Product Categories</span>
              </h2>
              <p className="text-muted text-center mt-4 max-w-2xl mx-auto" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                Wide range of home appliances, kitchen appliances, electronics and electrical products from top brands, all under one roof.
              </p>
              
              {/* Hand-drawn decoration */}
              <div style={{ position: 'absolute', top: '-10px', right: '0', zIndex: 10 }} className="hand-drawn-deco">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'cursive, "Comic Sans MS"', color: '#9ca3af', transform: 'rotate(-5deg)', marginBottom: '0.5rem', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
                    All You Need<br/>All Under One Roof
                  </span>
                  <svg width="40" height="50" viewBox="0 0 40 50" fill="none" stroke="#E31E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(15deg) translateX(-20px)' }}>
                    <path d="M40 5 C 20 5, 5 20, 5 45" />
                    <path d="M0 35 L 5 45 L 15 40" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {categoriesWithCounts.map(category => (
                <CategoryCard key={category.id || category.slug} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {homepage.showFeatured !== false && (
        <section className="section" style={{ backgroundColor: '#FAFAFA' }}>
          <div className="container">
            <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div style={{ width: '30px', height: '3px', backgroundColor: '#ED1C24' }}></div>
                  <p className="text-xs uppercase tracking-widest font-bold" style={{ color: '#64748B' }}>FEATURED PRODUCTS</p>
                </div>
                <h2 className="text-5xl font-black mb-2" style={{ color: '#111827', letterSpacing: '-1px' }}>
                  Popular <span style={{ color: '#ED1C24' }}>Products</span>
                </h2>
                <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Explore some of our best products from top brands.</p>
              </div>
              
              <div className="flex items-center gap-6">
                <Link to="/products" className="btn" style={{ borderRadius: '30px', padding: '0.7rem 1.8rem', border: '1.5px solid #ED1C24', color: '#ED1C24', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent' }}>
                  View All Products <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <div className="flex gap-3">
                  <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #F1F5F9', color: '#64748B' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  </button>
                  <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FDEBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: '#ED1C24' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748B' }}>
                  No featured products available yet. Mark products as "Featured" in the Admin panel to display them here!
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <WhyChooseUs />

      {/* Location Section */}
      <StoreLocation />
    </div>
  );
};

export default Home;
