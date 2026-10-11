import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, Search, X, Check, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useCategories } from '../../context/CategoriesContext';
import { useProducts } from '../../context/ProductsContext';

const AdminCategories = () => {
  const { categories, loading } = useCategories();
  const { products } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    colorTheme: 'red',
    status: 'Active'
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculate dynamic product count for each category
  const productCountMap = useMemo(() => {
    const counts = {};
    if (!products) return counts;
    products.forEach(p => {
      const cat = p.mainCategory || p.category;
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
        // Also map lowercase
        counts[cat.toLowerCase()] = (counts[cat.toLowerCase()] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const getProductCount = (category) => {
    if (!category) return 0;
    return productCountMap[category.slug] || 
           productCountMap[category.name] || 
           productCountMap[category.name.toLowerCase()] || 
           productCountMap[category.slug.toLowerCase()] || 
           0;
  };

  // Slug generator helper
  const handleNameChange = (e, isEditing = false) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({
      ...prev,
      name: val,
      ...(!isEditing && (!prev.slugManual ? { slug: generatedSlug } : {}))
    }));
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
      colorTheme: 'red',
      status: 'Active',
      slugManual: false
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      colorTheme: cat.colorTheme || 'red',
      status: cat.status || 'Active',
      slugManual: true
    });
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const docId = editingCategory ? editingCategory.id : slug;

    setSaving(true);
    try {
      await setDoc(doc(db, 'categories', docId), {
        name: formData.name.trim(),
        slug: slug,
        description: formData.description.trim(),
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
        colorTheme: formData.colorTheme,
        status: formData.status,
        updatedAt: serverTimestamp(),
        ...(editingCategory ? {} : { createdAt: serverTimestamp() })
      }, { merge: true });

      showToast(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
      setIsAddModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error saving category:', err);
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'categories', deletingCategory.id));
      showToast(`Category "${deletingCategory.name}" deleted successfully!`);
      setDeletingCategory(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      showToast('Failed to delete category: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`admin-toast ${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-header">
        <div className="header-text">
          <h1>Categories</h1>
          <p>Manage product categories, subcategories, and live store catalogue display.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px' }}>
          <span>Total: <strong>{categories.length}</strong> categories</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Products Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && categories.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    <RefreshCw size={24} className="spin-icon" style={{ margin: '0 auto 8px', display: 'block' }} />
                    Loading categories from store...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    No categories found matching "{searchTerm}". Click "+ Add Category" to create one.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div className="table-product">
                        <div className="table-product-img" style={{ overflow: 'hidden' }}>
                          <img 
                            src={cat.image || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=200'} 
                            alt={cat.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=200'; }}
                          />
                        </div>
                        <div className="table-product-info">
                          <strong>{cat.name}</strong>
                          <span>{cat.description ? (cat.description.length > 50 ? cat.description.substring(0, 50) + '...' : cat.description) : 'No description'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', color: '#475569' }}>
                        {cat.slug || cat.id}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#1E293B', fontSize: '14px' }}>
                        {getProductCount(cat)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${(cat.status || 'Active').toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                        {cat.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {/* View Option */}
                        <button 
                          className="action-btn view" 
                          title="View Details"
                          onClick={() => setViewingCategory(cat)}
                        >
                          <Eye size={16} />
                        </button>
                        {/* Edit Option */}
                        <button 
                          className="action-btn edit" 
                          title="Edit Category"
                          onClick={() => openEditModal(cat)}
                        >
                          <Edit size={16} />
                        </button>
                        {/* Delete Option */}
                        <button 
                          className="action-btn delete" 
                          title="Delete Category"
                          onClick={() => setDeletingCategory(cat)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {(isAddModalOpen || editingCategory) && (
        <div className="admin-modal-overlay" onClick={() => { setIsAddModalOpen(false); setEditingCategory(null); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <form id="category-modal-form" onSubmit={handleSaveCategory}>
              <div className="admin-modal-header">
                <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ padding: '7px 14px', fontSize: '13px' }}
                    disabled={saving}
                  >
                    <Check size={15} /> {saving ? 'Saving...' : editingCategory ? 'Update' : 'Add Category'}
                  </button>
                  <button 
                    type="button"
                    className="modal-close-btn" 
                    onClick={() => { setIsAddModalOpen(false); setEditingCategory(null); }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="admin-modal-body">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Home Appliances, Kitchen Appliances"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e, !!editingCategory)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug (URL key)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. home-appliances"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value, slugManual: true }))}
                    required
                  />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Used in website URL: /products?category={formData.slug || 'category-slug'}
                  </span>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="Short description for website cards..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  />
                  {formData.image && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Image Preview</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Color Theme</label>
                    <select 
                      className="form-input"
                      value={formData.colorTheme}
                      onChange={(e) => setFormData(prev => ({ ...prev, colorTheme: e.target.value }))}
                    >
                      <option value="red">Red (Default)</option>
                      <option value="orange">Orange</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      className="form-input"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => { setIsAddModalOpen(false); setEditingCategory(null); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : '+ Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW MODAL --- */}
      {viewingCategory && (
        <div className="admin-modal-overlay" onClick={() => setViewingCategory(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Category Details</h3>
              <button className="modal-close-btn" onClick={() => setViewingCategory(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="admin-modal-body">
              <div style={{ position: 'relative', height: '180px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                <img 
                  src={viewingCategory.image || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800'} 
                  alt={viewingCategory.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                  position: 'absolute', bottom: '12px', left: '16px', 
                  background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 14px', borderRadius: '20px',
                  fontSize: '13px', fontWeight: '600'
                }}>
                  Theme: {viewingCategory.colorTheme || 'red'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>
                  {viewingCategory.name}
                </h2>
                <span className={`status-badge ${(viewingCategory.status || 'Active').toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                  {viewingCategory.status || 'Active'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Slug</span>
                  <code style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>{viewingCategory.slug || viewingCategory.id}</code>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Assigned Products</span>
                  <strong style={{ fontSize: '18px', color: '#ED1C24' }}>{getProductCount(viewingCategory)} Products</strong>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>Description</span>
                <p style={{ color: '#64748B', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                  {viewingCategory.description || 'No description provided for this category.'}
                </p>
              </div>

              <div style={{ marginTop: '8px' }}>
                <Link 
                  to={`/products?category=${viewingCategory.slug || viewingCategory.id}`} 
                  target="_blank"
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                >
                  <ExternalLink size={16} /> View Category Products on Store
                </Link>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={() => setViewingCategory(null)}>
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  const cat = viewingCategory;
                  setViewingCategory(null);
                  openEditModal(cat);
                }}
              >
                <Edit size={16} /> Edit Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingCategory && (
        <div className="admin-modal-overlay" onClick={() => setDeletingCategory(null)}>
          <div className="admin-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ color: '#EF4444' }}>Delete Category</h3>
              <button className="modal-close-btn" onClick={() => setDeletingCategory(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="admin-modal-body">
              <p style={{ fontSize: '15px', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                Are you sure you want to delete <strong>"{deletingCategory.name}"</strong>?
              </p>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                This action cannot be undone. Products assigned to this category will remain, but will no longer be grouped under this category on the website.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={() => setDeletingCategory(null)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ backgroundColor: '#EF4444' }} 
                onClick={handleDeleteCategory}
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;
