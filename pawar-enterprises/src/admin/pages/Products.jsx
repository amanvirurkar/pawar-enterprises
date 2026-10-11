import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Products.css';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="header-text">
          <h1>Products</h1>
          <p>Manage your product catalogue, pricing, and visibility.</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/products/add" className="btn-primary">
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {/* Toolbar (Search & Filter) */}
      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <button className="btn-secondary">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No products found. Add one!</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="table-product">
                        <div className="table-product-img">
                          <img src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=100" alt={product.name} />
                        </div>
                        <div className="table-product-info">
                          <strong>{product.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{product.category || 'N/A'}</td>
                    <td>{product.brand || 'N/A'}</td>
                    <td><strong>₹{product.price || 0}</strong></td>
                    <td>
                      <span className={`status-badge ${(product.status || '').toLowerCase().replace(' ', '-')}`}>
                        {product.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="action-btn view" title="View"><Eye size={16} /></a>
                        <Link to={`/admin/products/edit/${product.id}`} className="action-btn edit" title="Edit"><Edit size={16} /></Link>
                        <button className="action-btn delete" title="Delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
