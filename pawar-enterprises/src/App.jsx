import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';

// Admin Imports
import AdminLogin from './admin/pages/Login';
import ResetPassword from './admin/pages/ResetPassword';
import AdminLayout from './admin/layouts/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import AdminProducts from './admin/pages/Products';
import AddProduct from './admin/pages/AddProduct';
import EditProduct from './admin/pages/EditProduct';
import AdminCategories from './admin/pages/Categories';
import AdminStoreInfo from './admin/pages/StoreInfo';
import AdminHomepage from './admin/pages/HomepageSettings';
import AdminEnquiries from './admin/pages/Enquiries';
import AdminBrands from './admin/pages/Brands';
import AboutSettings from './admin/pages/AboutSettings';
import SEOSettings from './admin/pages/SEOSettings';
import AdminSettings from './admin/pages/AdminSettings';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';

const PublicLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Admin layout with protected guard
const ProtectedAdminLayout = () => (
  <ProtectedAdminRoute>
    <AdminLayout />
  </ProtectedAdminRoute>
);

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* ---- PUBLIC ROUTES ---- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          {/* ---- ADMIN ROUTES ---- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

          <Route path="/admin" element={<ProtectedAdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="store-information" element={<AdminStoreInfo />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="about" element={<AboutSettings />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="seo" element={<SEOSettings />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
