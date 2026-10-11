import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, Search, X, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useBrands } from '../../context/BrandsContext';
import { useProducts } from '../../context/ProductsContext';

const AdminBrands = () => {
  const { brands, loading } = useBrands();
  const { products } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [viewingBrand, setViewingBrand] = useState(null);
  const [deletingBrand, setDeletingBrand] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    status: 'Active'
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculate dynamic product count for each brand
  const productCountMap = useMemo(() => {
    const counts = {};
    if (!products) return counts;
    products.forEach(p => {
      const b = p.brand;
      if (b) {
        counts[b.toLowerCase()] = (counts[b.toLowerCase()] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const getProductCount = (brand) => {
    if (!brand || !brand.name) return 0;
    return productCountMap[brand.name.toLowerCase()] || 0;
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=200',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      description: brand.description || '',
      logo: brand.logo || '',
      status: brand.status || 'Active'
    });
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter brand name', 'error');
      return;
    }

    const docId = editingBrand ? editingBrand.id : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setSaving(true);
    try {
      await setDoc(doc(db, 'brands', docId), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        logo: formData.logo.trim() || 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=200',
        status: formData.status,
        updatedAt: serverTimestamp(),
        ...(editingBrand ? {} : { createdAt: serverTimestamp() })
      }, { merge: true });

      showToast(editingBrand ? 'Brand updated successfully!' : 'Brand created successfully!');
      setIsAddModalOpen(false);
      setEditingBrand(null);
    } catch (err) {
      console.error('Error saving brand:', err);
      showToast(err.message || 'Failed to save brand', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (!deletingBrand) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'brands', deletingBrand.id));
      showToast(`Brand "${deletingBrand.name}" deleted successfully!`);
      setDeletingBrand(null);
    } catch (err) {
      console.error('Error deleting brand:', err);
      showToast('Failed to delete brand: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredBrands = brands.filter(b =>
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1>Brands Management</h1>
          <p>Manage product brands, manufacture logos, and catalogue brand tags.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add New Brand
          </button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search brands..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px' }}>
          <span>Total: <strong>{brands.length}</strong> brands</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Description</th>
                <th>Products Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && brands.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    <RefreshCw size={24} className="spin-icon" style={{ margin: '0 auto 8px', display: 'block' }} />
                    Loading brands from store...
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    No brands found matching "{searchTerm}". Click "+ Add New Brand" to create one.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.id}>
                    <td>
                      <div className="table-product">
                        <div className="table-product-img" style={{ overflow: 'hidden' }}>
                          <img 
                            src={brand.logo || 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=200'} 
                            alt={brand.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=200'; }}
                          />
                        </div>
                        <div className="table-product-info">
                          <strong>{brand.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: '#64748B', fontSize: '13px' }}>
                        {brand.description || 'Standard manufacturer brand'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#1E293B', fontSize: '14px' }}>
                        {getProductCount(brand)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${(brand.status || 'Active').toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                        {brand.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {/* View Option */}
                        <button 
                          className="action-btn view" 
                          title="View Details"
                          onClick={() => setViewingBrand(brand)}
                        >
                          <Eye size={16} />
                        </button>
                        {/* Edit Option */}
                        <button 
                          className="action-btn edit" 
                          title="Edit Brand"
                          onClick={() => openEditModal(brand)}
                        >
                          <Edit size={16} />
                        </button>
                        {/* Delete Option */}
                        <button 
                          className="action-btn delete" 
                          title="Delete Brand"
                          onClick={() => setDeletingBrand(brand)}
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

      {/* --- ADD / EDIT BRAND MODAL --- */}
      {(isAddModalOpen || editingBrand) && (
        <div className="admin-modal-overlay" onClick={() => { setIsAddModalOpen(false); setEditingBrand(null); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <form id="brand-modal-form" onSubmit={handleSaveBrand}>
              <div className="admin-modal-header">
                <h3>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ padding: '7px 14px', fontSize: '13px' }}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : editingBrand ? 'Update' : 'Add Brand'}
                  </button>
                  <button 
                    type="button"
                    className="modal-close-btn" 
                    onClick={() => { setIsAddModalOpen(false); setEditingBrand(null); }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label>Brand Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Samsung, LG, Sony, Haier"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Logo / Image URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://..."
                    value={formData.logo}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  />
                  {formData.logo && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={formData.logo} 
                        alt="Preview" 
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #E2E8F0', padding: '4px' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Logo Preview</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="Short brand overview..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
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

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => { setIsAddModalOpen(false); setEditingBrand(null); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingBrand ? 'Update Brand' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW BRAND MODAL --- */}
      {viewingBrand && (
        <div className="admin-modal-overlay" onClick={() => setViewingBrand(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Brand Details</h3>
              <button className="modal-close-btn" onClick={() => setViewingBrand(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="admin-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', padding: '6px' }}>
                  <img 
                    src={viewingBrand.logo || 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=200'} 
                    alt={viewingBrand.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0' }}>
                    {viewingBrand.name}
                  </h2>
                  <span className={`status-badge ${(viewingBrand.status || 'Active').toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                    {viewingBrand.status || 'Active'}
                  </span>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', marginTop: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Total Products in Store</span>
                <strong style={{ fontSize: '18px', color: '#ED1C24' }}>{getProductCount(viewingBrand)} Products</strong>
              </div>

              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>Description</span>
                <p style={{ color: '#64748B', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                  {viewingBrand.description || 'No description provided for this brand.'}
                </p>
              </div>

              <div style={{ marginTop: '16px' }}>
                <Link 
                  to={`/products?search=${encodeURIComponent(viewingBrand.name)}`} 
                  target="_blank"
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                >
                  <ExternalLink size={16} /> View Brand Products on Store
                </Link>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={() => setViewingBrand(null)}>
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  const b = viewingBrand;
                  setViewingBrand(null);
                  openEditModal(b);
                }}
              >
                <Edit size={16} /> Edit Brand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE BRAND MODAL --- */}
      {deletingBrand && (
        <div className="admin-modal-overlay" onClick={() => setDeletingBrand(null)}>
          <div className="admin-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ color: '#EF4444' }}>Delete Brand</h3>
              <button className="modal-close-btn" onClick={() => setDeletingBrand(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="admin-modal-body">
              <p style={{ fontSize: '15px', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                Are you sure you want to delete <strong>"{deletingBrand.name}"</strong>?
              </p>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                This will remove the brand from the list. Existing products will retain their brand name.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={() => setDeletingBrand(null)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ backgroundColor: '#EF4444' }} 
                onClick={handleDeleteBrand}
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

export default AdminBrands;
