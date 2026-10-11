import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  const getIcon = (iconName) => {
    const Icon = LucideIcons[iconName];
    return Icon ? <Icon size={14} /> : null;
  };

  return (
    <div className="product-card">
      {/* Top Image Section */}
      <div className="pc-image-area">
        <div className="pc-bg-circle"></div>
        
        <div className="pc-header-badges">
          {product.badge && (
            <div className={`pc-badge badge-${product.badge.type}`}>
              {getIcon(product.badge.icon)}
              <span>{product.badge.text}</span>
            </div>
          )}
          <button 
            className="pc-wishlist-btn" 
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
          >
            <LucideIcons.Heart 
              size={18} 
              fill={isInWishlist(product.id) ? "#ED1C24" : "none"} 
              color={isInWishlist(product.id) ? "#ED1C24" : "currentColor"} 
            />
          </button>
        </div>
        
        <div className="pc-main-image-wrapper">
          <div className="pc-spec-pills">
            {product.specTags && product.specTags.map((tag, idx) => (
              <div key={idx} className="pc-pill">
                {getIcon(tag.icon)}
                <span>{tag.text}</span>
              </div>
            ))}
          </div>
          <Link to={`/product/${product.slug}`} className="pc-image-link">
            <img 
              src={(product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=600'} 
              alt={product.name} 
              className="pc-image" 
              loading="lazy" 
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=600';
              }}
            />
          </Link>
          
          <div className="pc-slider-dots" style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ED1C24' }}></span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pc-content-area">
        <p className="pc-brand">{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="pc-title-link">
          <h3 className="pc-title">{product.name}</h3>
        </Link>
        
        <div className="pc-rating">
          <LucideIcons.Star size={14} className="star-icon" fill="#FBBF24" color="#FBBF24" />
          <strong>{product.rating}</strong>
          <span>({product.reviews} Reviews)</span>
        </div>
        
        <div className="pc-price-row">
          <span className="pc-current-price">₹{formatPrice(product.price)}</span>
          <span className="pc-original-price">₹{formatPrice(product.originalPrice)}</span>
          <span className="pc-discount-badge">{product.discount}</span>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="pc-footer-area">
        <Link to={`/product/${product.slug}`} className="pc-add-to-cart btn-outline" style={{ textDecoration: 'none' }}>
          <LucideIcons.ShoppingCart size={18} />
          <span>Add to Cart</span>
        </Link>
        <Link to={`/product/${product.slug}`} className="pc-action-btn">
          <LucideIcons.ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
