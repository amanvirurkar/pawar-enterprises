import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { products } = useProducts();

  // Find products that match IDs in the wishlist
  const wishlistedProducts = products.filter(product => wishlist.includes(product.id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="wishlist-page">
      <div className="wl-header">
        <div className="container">
          <h1 className="wl-title">My Wishlist</h1>
          <p className="wl-subtitle">
            {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      <div className="container">
        <div className="wl-content">
          {wishlistedProducts.length === 0 ? (
            <div className="wl-empty-state">
              <div className="wl-empty-icon">
                <Heart size={48} color="#ED1C24" strokeWidth={1.5} />
              </div>
              <h2>Your wishlist is empty</h2>
              <p>Looks like you haven't saved any items to your wishlist yet.</p>
              <Link to="/products" className="wl-browse-btn">
                Browse Products <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="wl-grid">
              {wishlistedProducts.map(product => (
                <div key={product.id} className="wl-card">
                  
                  <Link to={`/product/${product.slug}`} className="wl-card-img-link">
                    <div className="wl-img-wrapper">
                      <img src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} alt={product.name} />
                    </div>
                  </Link>
                  
                  <div className="wl-card-info">
                    <span className="wl-brand">{product.brand}</span>
                    <Link to={`/product/${product.slug}`} className="wl-product-title">
                      {product.name}
                    </Link>
                    
                    <div className="wl-price-row">
                      <span className="wl-price">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="wl-orig-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  <div className="wl-card-actions">
                    <button 
                      className="wl-remove-btn" 
                      onClick={() => toggleWishlist(product.id)}
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <Link to={`/product/${product.slug}`} className="wl-view-btn">
                      <Eye size={16} /> View Details
                    </Link>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
