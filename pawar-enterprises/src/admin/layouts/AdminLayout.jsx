import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Tags, ListTree, 
  Home, Info, Store, MessageSquare, Search,
  Settings, LogOut, Menu, X, Bell, User
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
    { name: 'Categories', icon: ListTree, path: '/admin/categories' },
    { name: 'Brands', icon: Tags, path: '/admin/brands' },
    { name: 'Homepage', icon: Home, path: '/admin/homepage' },
    { name: 'About Settings', icon: Info, path: '/admin/about' },
    { name: 'Store Info', icon: Store, path: '/admin/store-information' },
    { name: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    { name: 'SEO', icon: Search, path: '/admin/seo' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo.jpg" alt="Pawar Enterprises" className="sidebar-logo" />
          <button className="close-sidebar-btn d-lg-none" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="menu-btn d-lg-none" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="page-title hide-mobile">Admin Panel</h2>
          </div>
          
          <div className="topbar-right">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="admin-profile">
              <div className="profile-avatar">
                <User size={18} />
              </div>
              <div className="profile-info hide-mobile">
                <span className="profile-name">{admin?.name || 'Store Admin'}</span>
                <span className="profile-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
