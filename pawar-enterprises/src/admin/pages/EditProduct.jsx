import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Image as ImageIcon, Trash2, Star, UploadCloud } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useCategories } from '../../context/CategoriesContext';
import { useBrands } from '../../context/BrandsContext';
import './AddProduct.css'; // Reuse AddProduct styles

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    oldPrice: '',
    shortDesc: '',
    fullDesc: '',
    status: 'Active',
    featured: false,
    seoTitle: '',
    seoDesc: ''
  });

  // Images state
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            ...data,
            price: data.price || '',
            oldPrice: data.oldPrice || '',
          });
          // Load images
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            setImages(data.images);
          } else if (data.image) {
            setImages([data.image]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages(prev => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCover = (indexToCover) => {
    setImages(prev => {
      const copy = [...prev];
      const [item] = copy.splice(indexToCover, 1);
      return [item, ...copy];
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill in required fields (Name, Price, Category)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const defaultImg = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=600';

      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...formData,
        slug: generatedSlug,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        images: images.length > 0 ? images : [defaultImg],
        image: defaultImg
      });
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Error updating product');
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="admin-page-container"><p>Loading product...</p></div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div className="header-text">
          <h1>Edit Product</h1>
          <p>Update product information, images, pricing, and visibility.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/admin/products')}>
            <X size={18} /> Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={loading}>
            <Save size={18} /> {loading ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '10px', backgroundColor: '#FEE2E2', borderRadius: '5px' }}>{error}</div>}

      <div className="product-form-layout">
        <div className="form-main-content">
          <div className="admin-card form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <select name="brand" value={formData.brand} onChange={handleChange} className="form-input">
                  <option value="">Select Brand</option>
                  {(brands || []).map(b => (
                    <option key={b.id || b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Main Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-input">
                  <option value="">Select Category</option>
                  {(categories || []).map(c => (
                    <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Images Section */}
          <div className="admin-card form-section">
            <h3 className="section-title">Product Images</h3>
            
            {/* File Upload Zone */}
            <label className="image-upload-zone" style={{ cursor: 'pointer', display: 'block' }}>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <UploadCloud size={36} className="upload-icon" style={{ margin: '0 auto 10px', display: 'block' }} />
              <h4>Click here to Upload Photos from your Device</h4>
              <p>Supports multiple JPG, PNG, WEBP files</p>
            </label>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Or Add Photo via URL
              </label>
              <div className="image-input-row">
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/... or web image link"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                />
                <button type="button" className="btn-secondary" onClick={handleAddImageUrl} style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={16} /> Add Image
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            {images.length > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '12px', marginBottom: '8px' }}>
                  <strong>{images.length}</strong> photo{images.length > 1 ? 's' : ''} added. First photo is used as main thumbnail.
                </p>
                <div className="product-images-grid">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className={`product-image-card ${idx === 0 ? 'is-cover' : ''}`}>
                      <img src={imgUrl} alt={`Product photo ${idx + 1}`} />
                      {idx === 0 && <span className="product-image-cover-badge">Main</span>}
                      <div className="product-image-actions">
                        {idx !== 0 && (
                          <button 
                            type="button" 
                            className="product-image-action-btn"
                            title="Set as main cover image"
                            onClick={() => handleSetCover(idx)}
                          >
                            <Star size={11} /> Cover
                          </button>
                        )}
                        <button 
                          type="button" 
                          className="product-image-action-btn delete-btn"
                          title="Delete photo"
                          onClick={() => handleRemoveImage(idx)}
                          style={{ marginLeft: 'auto' }}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="admin-card form-section">
            <h3 className="section-title">Pricing</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Selling Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>Old Price (₹) - Optional</label>
                <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>

          <div className="admin-card form-section">
            <h3 className="section-title">Description</h3>
            <div className="form-group full-width">
              <label>Short Description</label>
              <textarea name="shortDesc" value={formData.shortDesc} onChange={handleChange} className="form-input" rows="3"></textarea>
            </div>
            <div className="form-group full-width">
              <label>Full Description</label>
              <textarea name="fullDesc" value={formData.fullDesc} onChange={handleChange} className="form-input" rows="6"></textarea>
            </div>
          </div>
        </div>

        <div className="form-sidebar">
          <div className="admin-card form-section">
            <h3 className="section-title">Visibility</h3>
            <div className="toggle-group">
              <div className="toggle-info">
                <strong>Publish Status</strong>
              </div>
              <select name="status" value={formData.status} onChange={handleChange} className="form-input mt-2">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="toggle-group mt-4">
              <div className="toggle-info">
                <strong>Featured Product</strong>
              </div>
              <label className="switch mt-2">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="admin-card form-section">
            <h3 className="section-title">Search Engine Optimization</h3>
            <div className="form-group full-width">
              <label>SEO Title</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group full-width mt-3">
              <label>SEO Description</label>
              <textarea name="seoDesc" value={formData.seoDesc} onChange={handleChange} className="form-input" rows="4"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
