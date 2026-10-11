import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, StarHalf, ShieldCheck, Truck, 
  RotateCcw, MessageCircle, ShoppingCart, 
  ChevronRight, CheckCircle2, Heart,
  Minus, Plus, Share2
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { products } = useProducts();

  const product = products.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="pd-not-found">
        <div className="container text-center">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={16} fill="#ED1C24" color="#ED1C24" />);
      } else if (i - 0.5 === rating) {
        stars.push(<StarHalf key={i} size={16} fill="#ED1C24" color="#ED1C24" />);
      } else {
        stars.push(<Star key={i} size={16} color="#E5E7EB" />);
      }
    }
    return stars;
  };

  return (
    <div className="product-details-page">
      {/* BREADCRUMBS */}
      <div className="pd-breadcrumbs-wrapper">
        <div className="container">
          <ul className="pd-breadcrumbs">
            <li><Link to="/">Home</Link></li>
            <li><ChevronRight size={14} /></li>
            <li><Link to="/products">Products</Link></li>
            <li><ChevronRight size={14} /></li>
            <li className="active">{product.name}</li>
          </ul>
        </div>
      </div>

      <section className="pd-main">
        <div className="container">
          <div className="pd-grid">
            
            {/* LEFT: IMAGE VIEWER */}
            <div className="pd-image-section animate-fade-up">
              <div className="pd-main-image-wrap">
                {product.badge && (
                  <div className="pd-badge">{product.badge.text}</div>
                )}
                <button className="pd-wishlist-btn" onClick={() => toggleWishlist(product.id)}>
                  <Heart size={20} fill={isInWishlist(product.id) ? "#ED1C24" : "none"} color={isInWishlist(product.id) ? "#ED1C24" : "currentColor"} />
                </button>
                <img src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} alt={product.name} className="pd-main-img" />
              </div>
              <div className="pd-thumbnail-list">
                {/* For demonstration, we repeat the same image. In reality, map over product.images */}
                <div className="pd-thumbnail active">
                  <img src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} alt={product.name} />
                </div>
                <div className="pd-thumbnail">
                  <img src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} alt={product.name} />
                </div>
                <div className="pd-thumbnail">
                  <img src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} alt={product.name} />
                </div>
              </div>
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="pd-info-section animate-fade-up delay-1">
              <div className="pd-brand-row">
                <span className="pd-brand">{product.brand}</span>
                <span className="pd-stock"><CheckCircle2 size={14} /> In Stock</span>
              </div>
              
              <h1 className="pd-title">{product.name}</h1>
              
              <div className="pd-rating-row">
                <div className="pd-stars">{renderStars(product.rating)}</div>
                <span className="pd-rating-score">{product.rating}</span>
                <span className="pd-reviews-count">({product.reviews} customer reviews)</span>
              </div>

              <div className="pd-price-row">
                <span className="pd-price">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <>
                    <span className="pd-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="pd-discount">{product.discount}</span>
                  </>
                )}
              </div>

              <p className="pd-short-desc">
                {product.description || "Premium quality appliance designed to make your life easier and more efficient. Backed by standard brand warranty."}
              </p>

              <hr className="pd-divider" />

              {/* Action Area */}
              <div className="pd-actions-area">
                <div className="pd-quantity-wrap">
                  <button onClick={() => handleQuantity('dec')}><Minus size={16} /></button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => handleQuantity('inc')}><Plus size={16} /></button>
                </div>
                
                <button className="pd-add-to-cart">
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>

              <a 
                href={`https://wa.me/919982462581?text=I am interested in buying: ${product.name}`} 
                target="_blank" 
                rel="noreferrer"
                className="pd-whatsapp-btn"
              >
                <MessageCircle size={18} /> Inquire on WhatsApp
              </a>

              {/* Trust Strip */}
              <div className="pd-trust-strip">
                <div className="pd-trust-item">
                  <ShieldCheck size={20} className="pd-trust-icon" />
                  <div className="pd-trust-text">
                    <strong>1 Year Warranty</strong>
                    <span>Brand Authorized</span>
                  </div>
                </div>
                <div className="pd-trust-item">
                  <Truck size={20} className="pd-trust-icon" />
                  <div className="pd-trust-text">
                    <strong>Fast Delivery</strong>
                    <span>In Balaghat Area</span>
                  </div>
                </div>
                <div className="pd-trust-item">
                  <RotateCcw size={20} className="pd-trust-icon" />
                  <div className="pd-trust-text">
                    <strong>Easy Returns</strong>
                    <span>7-Day Return Policy</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* TABS SECTION */}
      <section className="pd-tabs-section">
        <div className="container">
          <div className="pd-tabs-container animate-fade-up delay-2">
            <div className="pd-tabs-header">
              <button 
                className={activeTab === 'description' ? 'active' : ''} 
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={activeTab === 'specifications' ? 'active' : ''} 
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={activeTab === 'reviews' ? 'active' : ''} 
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviews})
              </button>
            </div>
            
            <div className="pd-tabs-content">
              {activeTab === 'description' && (
                <div className="pd-tab-pane">
                  <h3>Product Description</h3>
                  <p>
                    The {product.brand} {product.name} is a state-of-the-art appliance designed for modern Indian homes. 
                    Built with durability and efficiency in mind, it seamlessly blends into your lifestyle while delivering outstanding performance.
                  </p>
                  <p>
                    At Pawar Enterprises, we ensure that every product you purchase is 100% genuine and comes with the full 
                    backing of the manufacturer's warranty. Our expert team is always available to help you with installation 
                    and after-sales support.
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="pd-tab-pane">
                  <h3>Technical Specifications</h3>
                  <table className="pd-specs-table">
                    <tbody>
                      <tr>
                        <td>Brand</td>
                        <td>{product.brand}</td>
                      </tr>
                      <tr>
                        <td>Category</td>
                        <td>{(product.mainCategory || product.category || '').replace('-', ' ')}</td>
                      </tr>
                      <tr>
                        <td>Model Name</td>
                        <td>{product.name}</td>
                      </tr>
                      <tr>
                        <td>Condition</td>
                        <td>Brand New in Box</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="pd-tab-pane">
                  <h3>Customer Reviews</h3>
                  <div className="pd-reviews-summary">
                    <div className="pd-rs-big">
                      <h2>{product.rating}</h2>
                      <div className="pd-rs-stars">{renderStars(product.rating)}</div>
                      <span>Based on {product.reviews} reviews</span>
                    </div>
                  </div>
                  <p className="text-muted mt-4">Detailed reviews will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductDetails;
