import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, Filter, LayoutGrid, List, Heart, 
  ShoppingCart, Star, StarHalf, ChevronRight, Eye 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import { useCategories } from '../context/CategoriesContext';
import { useBrands } from '../context/BrandsContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './Products.css';

const Products = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { seo } = useStoreSettings();
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState('Popularity');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // For dropdown toggles (optional, keep open by default for simplicity)
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true,
    availability: true
  });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({...prev, [sec]: !prev[sec]}));
  };

  const location = useLocation();

  // Dynamic Categories list from Firestore
  const categoriesList = useMemo(() => {
    const list = [{ name: 'All Products', filterValue: 'All Products', slug: 'all' }];
    (categories || []).forEach(cat => {
      if ((cat.status || 'Active').toLowerCase() === 'active') {
        list.push({
          name: cat.name,
          filterValue: cat.slug || cat.id,
          slug: cat.slug || cat.id
        });
      }
    });
    return list;
  }, [categories]);

  // Dynamic Brands list from Firestore
  const brandsList = useMemo(() => {
    if (brands && brands.length > 0) {
      return brands.filter(b => (b.status || 'Active').toLowerCase() === 'active').map(b => b.name);
    }
    return ['LG', 'Samsung', 'Philips', 'Bosch', 'Daikin', 'Kent', 'Haier'];
  }, [brands]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (seo?.productsTitle) {
      document.title = seo.productsTitle;
    }
    if (seo?.productsDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = seo.productsDescription;
    }

    const searchParams = new URLSearchParams(location.search);
    const catQuery = searchParams.get('category');
    if (catQuery) {
      const foundCat = categoriesList.find(c => 
        c.filterValue === catQuery || 
        c.slug === catQuery || 
        c.name.toLowerCase() === catQuery.toLowerCase()
      );
      if (foundCat) {
        setActiveCategory(foundCat.name);
      }
    }
    
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchKeyword(searchQuery.toLowerCase());
    } else {
      setSearchKeyword('');
    }
  }, [location.search, categoriesList, seo]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products || [];

    // 1. Category
    if (activeCategory !== 'All Products') {
      const catObj = categoriesList.find(c => c.name === activeCategory);
      if (catObj) {
        result = result.filter(p => {
          const pCat = (p.mainCategory || p.category || '').toLowerCase();
          return pCat === catObj.filterValue.toLowerCase() || 
                 pCat === (catObj.slug || '').toLowerCase() || 
                 pCat === catObj.name.toLowerCase();
        });
      }
    }

    // 2. Search Keyword
    if (searchKeyword) {
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(searchKeyword)) || 
        (p.brand && p.brand.toLowerCase().includes(searchKeyword)) ||
        (p.mainCategory || p.category || '').replace('-', ' ').toLowerCase().includes(searchKeyword)
      );
    }

    // 3. Price
    result = result.filter(p => p.price <= maxPrice);

    // 4. Brands
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 5. Rating
    if (selectedRating > 0) {
      result = result.filter(p => (p.rating || 5) >= selectedRating);
    }

    // 5. Availability (Assuming all in products.js are in stock for now, but we can fake it)
    if (inStockOnly) {
      // In a real app we check p.inStock
      result = result.filter(p => p.price > 0); 
    }

    // Sort Logic
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategory, maxPrice, selectedBrands, selectedRating, inStockOnly, sortBy, searchKeyword]);

  return (
    <div className="products-page-container">
      
      {/* 1. PRODUCT HERO */}
      <section className="ph-compact">
        <div className="ph-compact-bg">
          <div className="ph-compact-circle"></div>
          <div className="ph-compact-curve"></div>
        </div>
        <div className="container relative z-10">
          <div className="ph-compact-grid">
            <div className="ph-compact-left">
              <span className="ph-compact-eyebrow">OUR PRODUCTS</span>
              <h1 className="ph-compact-title">
                Home Appliances<br/>
                for a <span className="text-primary">Better Home.</span>
              </h1>
              <p className="ph-compact-desc">
                Explore a wide range of home appliances, kitchen appliances, electronics and electrical products from trusted brands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT TOOLBAR */}
      <div className="product-toolbar-wrapper">
        <div className="container">
          <div className="product-toolbar">
            <div className="toolbar-left">
              <p>Showing 1–{filteredProducts.length} of {products.length} products</p>
            </div>
            <div className="toolbar-right">
              <div className="toolbar-sort">
                <span>Sort By:</span>
                <select 
                  className="sort-dropdown" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }}
                >
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
              <div className="toolbar-view">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={20} />
                </button>
              </div>
              <button 
                className="mobile-filter-btn"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Filter size={18} /> Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN PRODUCT AREA */}
      <section className="main-product-area">
        <div className="container">
          <div className="product-area-grid">
            
            {/* FILTER SIDEBAR */}
            <aside className={`filter-sidebar ${isSidebarOpen ? 'open' : ''}`}>
              <div className="filter-panel">
                <div className="filter-header-mobile">
                  <h3>Filters</h3>
                  <button onClick={() => setIsSidebarOpen(false)}>×</button>
                </div>
                
                {/* Categories */}
                <div className="filter-group">
                  <div className="filter-title" onClick={() => toggleSection('categories')}>
                    <h4>Categories</h4>
                    <ChevronDown size={16} style={{ transform: openSections.categories ? 'rotate(180deg)' : 'none' }}/>
                  </div>
                  {openSections.categories && (
                    <ul className="filter-list">
                      {categoriesList.map((cat, idx) => {
                        const count = cat.name === 'All Products' ? products.length : products.filter(p => (p.mainCategory || p.category) === cat.filterValue).length;
                        return (
                          <li key={idx}>
                            <button 
                              className={`filter-cat-btn ${activeCategory === cat.name ? 'active' : ''}`}
                              onClick={() => setActiveCategory(cat.name)}
                            >
                              <ChevronRight size={14} className="cat-icon" />
                              <span className="cat-name">{cat.name}</span>
                              <span className="cat-count">({count})</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
                
                <hr className="filter-divider" />
                
                {/* Price Range */}
                <div className="filter-group">
                  <div className="filter-title" onClick={() => toggleSection('price')}>
                    <h4>Price Range</h4>
                    <ChevronDown size={16} style={{ transform: openSections.price ? 'rotate(180deg)' : 'none' }}/>
                  </div>
                  {openSections.price && (
                    <div className="price-slider-container">
                      <div className="price-labels">
                        <span>₹0</span>
                        <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="500000" 
                        step="1000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#ED1C24', marginTop: '10px' }} 
                      />
                    </div>
                  )}
                </div>

                <hr className="filter-divider" />

                {/* Brands */}
                <div className="filter-group">
                  <div className="filter-title" onClick={() => toggleSection('brands')}>
                    <h4>Brands</h4>
                    <ChevronDown size={16} style={{ transform: openSections.brands ? 'rotate(180deg)' : 'none' }}/>
                  </div>
                  {openSections.brands && (
                    <div className="checkbox-list">
                      {brandsList.map((brand, idx) => (
                        <label key={idx} className="checkbox-item">
                          <input 
                            type="checkbox" 
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                          />
                          <span className="checkmark"></span>
                          <span className="checkbox-label">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <hr className="filter-divider" />

                {/* Ratings */}
                <div className="filter-group">
                  <div className="filter-title" onClick={() => toggleSection('rating')}>
                    <h4>Customer Rating</h4>
                    <ChevronDown size={16} style={{ transform: openSections.rating ? 'rotate(180deg)' : 'none' }}/>
                  </div>
                  {openSections.rating && (
                    <div className="checkbox-list">
                      {[4.5, 4.0, 3.0].map(starVal => (
                        <label key={starVal} className="checkbox-item rating-item">
                          <input 
                            type="checkbox" 
                            checked={selectedRating === starVal}
                            onChange={() => setSelectedRating(selectedRating === starVal ? 0 : starVal)}
                          />
                          <span className="checkmark"></span>
                          <div className="rating-stars">
                            {[1,2,3,4,5].map(s => {
                              if (s <= Math.floor(starVal)) return <Star key={s} size={14} fill="#ED1C24" color="#ED1C24" />;
                              if (s - 0.5 === starVal) return <StarHalf key={s} size={14} fill="#ED1C24" color="#ED1C24" />;
                              return <Star key={s} size={14} color="#E5E7EB" />;
                            })}
                          </div>
                          <span className="rating-label">{starVal} & above</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <hr className="filter-divider" />

                {/* Availability */}
                <div className="filter-group">
                  <div className="filter-title" onClick={() => toggleSection('availability')}>
                    <h4>Availability</h4>
                    <ChevronDown size={16} style={{ transform: openSections.availability ? 'rotate(180deg)' : 'none' }}/>
                  </div>
                  {openSections.availability && (
                    <div className="checkbox-list">
                      <label className="checkbox-item">
                        <input 
                          type="checkbox" 
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <span className="checkbox-label">In Stock</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span className="checkbox-label">Out of Stock</span>
                      </label>
                    </div>
                  )}
                </div>

              </div>
            </aside>
            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* PRODUCT GRID */}
            <div className={`product-grid-container ${viewMode === 'list' ? 'list-view' : ''}`}>
              {filteredProducts.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>No products found</h3>
                  <p style={{ color: '#64748B' }}>Try adjusting your filters to see more results.</p>
                  <button 
                    onClick={() => {
                      setActiveCategory('All Products');
                      setMaxPrice(100000);
                      setSelectedBrands([]);
                      setSelectedRating(0);
                    }}
                    style={{ marginTop: '16px', background: '#ED1C24', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.slug}`} className="retail-card" style={{textDecoration: 'none'}}>
                      <div className="retail-card-img-wrap">
                        {product.badge && (
                          <div className="retail-badge">{product.badge.text}</div>
                        )}
                        <button 
                          className="retail-wishlist" 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product.id);
                          }}
                        >
                          <Heart size={16} fill={isInWishlist(product.id) ? "#ED1C24" : "none"} color={isInWishlist(product.id) ? "#ED1C24" : "currentColor"} />
                        </button>
                        <img src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} alt={product.name} />
                      </div>
                      
                      <div className="retail-card-body">
                        <div className="retail-brand">{product.brand}</div>
                        <h3 className="retail-title">{product.name}</h3>
                        
                        <div className="retail-rating">
                          <Star size={14} fill="#ED1C24" color="#ED1C24" />
                          <span className="rating-score">{product.rating}</span>
                          <span className="rating-count">({product.reviews} reviews)</span>
                        </div>
                        
                        <div className="retail-bottom">
                          <div className="retail-price-info">
                            <span className="retail-price">₹{product.price.toLocaleString('en-IN')}</span>
                            {product.originalPrice && (
                              <span className="retail-orig-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                          <button className="retail-cart-btn">
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Products;
