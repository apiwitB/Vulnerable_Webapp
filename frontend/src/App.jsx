import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout & Global Components
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import BoardPage from './pages/BoardPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

const FOOTER_COLS = [
  { title: 'Marketplace', links: ['All Listings', 'Digital Goods', 'Accounts', 'Tools', 'Exploits'] },
  { title: 'Community',   links: ['Discussion Board', 'Reviews', 'Vendors', 'Escrow System'] },
  { title: 'Account',     links: ['Login', 'Register', 'My Orders', 'My Profile', 'Admin Panel'] },
];

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div className="logo-icon" style={{ width: '28px', height: '28px', fontSize: '14px' }}>☠️</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px' }}>
                shadow<span style={{ color: 'var(--accent-light)' }}>Market</span>
              </span>
            </div>
            <p>The underground E-Commerce platform. Anonymous, encrypted, and untraceable since 2021.</p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <ul className="footer-links" aria-label={`${col.title} links`}>
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" id={`footer-${link.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 shadowMarketplace. All rights reserved. Use at your own risk.
          </p>
          <div className="footer-warning" role="note">
            ⚠️ Educational purposes only — intentionally vulnerable
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  function handleSearch(query) {
    // [VULN] console.log sensitive queries directly to console (Information Disclosure)
    console.log('[shadowMarket] search query:', query);
  }

  return (
    <Router>
      <ErrorBoundary>
        <Navbar onSearch={handleSearch} />
        <main id="main-content" style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/:id" element={<PostDetailPage />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/board/create" element={<CreatePostPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
}
