import React, { useState, useEffect } from 'react';
import { 
  Package, LayoutGrid, AlertCircle, ShoppingBag, 
  MessageSquare, Users, Plus, Edit, Trash2, Eye 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useCategories } from '../../context/CategoriesContext';
import { useBrands } from '../../context/BrandsContext';
import './Dashboard.css';

const Dashboard = () => {
  const { categories } = useCategories();
  const { brands } = useBrands();
  const [statsData, setStatsData] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all products for stats
      const productsSnapshot = await getDocs(collection(db, 'products'));
      
      let total = 0;
      let active = 0;
      let outOfStock = 0;
      let recent = [];

      productsSnapshot.forEach((doc) => {
        total++;
        const data = doc.data();
        if (data.status === 'Active') active++;
        if (data.status === 'Out of Stock') outOfStock++;
        
        recent.push({ id: doc.id, ...data });
      });

      // Sort recent locally since we just fetched all for stats (for larger DBs, do 2 separate queries)
      recent.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      
      setStatsData({ total, active, outOfStock });
      setRecentProducts(recent.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Products', value: statsData.total, icon: Package, color: 'blue' },
    { title: 'Active Products', value: statsData.active, icon: ShoppingBag, color: 'green' },
    { title: 'Categories', value: categories ? categories.length : 0, icon: LayoutGrid, color: 'purple' },
    { title: 'New Enquiries', value: '0', icon: MessageSquare, color: 'orange' },
    { title: 'Out of Stock', value: statsData.outOfStock, icon: AlertCircle, color: 'red' },
    { title: 'Total Brands', value: brands ? brands.length : 0, icon: Users, color: 'indigo' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back to Pawar Enterprises Admin Panel</p>
        </div>
        <div className="quick-actions">
          <Link to="/admin/products/add" className="btn-primary">
            <Plus size={18} /> Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className={`stat-icon-box bg-${stat.color}`}>
              <stat.icon size={24} className={`text-${stat.color}`} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{loading ? '...' : stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="dashboard-sections">
        {/* Recent Products */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Recently Added Products</h3>
            <Link to="/admin/products" className="view-all-link">View All</Link>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
                ) : recentProducts.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No products yet. Add some!</td></tr>
                ) : (
                  recentProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="table-product">
                          <div className="table-product-img">
                            <img src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=100" alt="Product" />
                          </div>
                          <div className="table-product-info">
                            <strong>{product.name}</strong>
                            <span>{product.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td><strong>₹{product.price}</strong></td>
                      <td>
                        <span className={`status-badge ${(product.status || '').toLowerCase().replace(' ', '-')}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn view"><Eye size={16} /></button>
                          <button className="action-btn edit"><Edit size={16} /></button>
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
    </div>
  );
};

export default Dashboard;
