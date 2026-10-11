import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Coffee, Monitor, Zap, Tag } from 'lucide-react';
import './CategoryCard.css';

const ICON_MAP = {
  'home-appliances': Home,
  'kitchen-appliances': Coffee,
  'electronics': Monitor,
  'electrical-products': Zap,
  'Home': Home,
  'Coffee': Coffee,
  'Monitor': Monitor,
  'Zap': Zap
};

const CategoryCard = ({ category }) => {
  // Determine icon safely
  let IconComponent = Tag;
  if (category.icon && typeof category.icon !== 'string') {
    IconComponent = category.icon;
  } else if (category.iconName && ICON_MAP[category.iconName]) {
    IconComponent = ICON_MAP[category.iconName];
  } else if (ICON_MAP[category.slug]) {
    IconComponent = ICON_MAP[category.slug];
  }

  const categorySlug = category.slug || category.id;
  const theme = category.colorTheme || 'red';

  return (
    <Link to={`/products?category=${categorySlug}`} className={`category-card theme-${theme}`}>
      <div className="cat-card-header">
        <div className="cat-icon-box">
          <IconComponent size={24} />
        </div>
        <div className="cat-count-box">
          <strong>{category.productCount || 'Explore'}</strong>
          <span>Products</span>
        </div>
      </div>
      
      <div className="cat-image-wrapper">
        <div className="cat-image-circle"></div>
        <img 
          src={category.image || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800'} 
          alt={category.name} 
          className="cat-image" 
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800';
          }}
        />
      </div>

      <div className="cat-content">
        <h3 className="cat-title">{category.name}</h3>
        <p className="cat-desc">{category.description || 'Explore our quality range of products.'}</p>
        
        <div className="cat-footer">
          <div className="cat-link-text">
            View Products
            <div className="cat-link-underline"></div>
          </div>
          <div className="cat-arrow-btn">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
