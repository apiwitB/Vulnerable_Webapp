import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart } from '../api/cart';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const { token, user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Load cart count dynamically if logged in
  useEffect(() => {
    if (!token) {
      setCartCount(0);
      return;
    }
    
    async function loadCartCount() {
      try {
        const cart = await getCart();
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      } catch (err) {
        console.error('Failed to load cart count:', err);
        const errMsg = err.message || '';
        if (errMsg.includes('401') || errMsg.includes('Unauthorized') || errMsg.includes('Not authenticated')) {
          logout();
        }
      }
    }
    
    loadCartCount();
    // Poll or check on interval just in case
    const interval = setInterval(loadCartCount, 5000);
    return () => clearInterval(interval);
  }, [token]);

  function handleKey(e) {
    if (e.key === 'Enter') {
      if (onSearch) onSearch(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="nav-logo">
          <div className="logo-icon" aria-hidden="true">☠️</div>
          shadow<span className="logo-dot">Market</span>
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            id="nav-search"
            type="text"
            className="search-input"
            placeholder="Search listings…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            aria-label="Search marketplace listings"
          />
        </div>

        {/* Nav Links */}
        <nav className="navbar-nav" aria-label="Section navigation">
          <Link to="/" className="nav-link" id="nav-products">listings</Link>
          <Link to="/board" className="nav-link" id="nav-board">board</Link>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {token ? (
            <>
              {/* Cart Button */}
              <Link to="/cart" className="cart-btn btn-ghost" id="btn-cart" aria-label={`Cart with ${cartCount} items`}>
                🛒 Cart
                {cartCount > 0 && (
                  <span className="cart-count" aria-live="polite">{cartCount}</span>
                )}
              </Link>

              {/* User Identity / Profile Link */}
              <Link to={`/profile/${user?.id}`} className="nav-link" style={{ fontWeight: 600, color: 'var(--accent-light)' }} id="btn-navbar-profile">
                👤 {user?.username}
              </Link>

              {/* Conditional Admin dashboard link */}
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-ghost" style={{ borderColor: 'var(--red)', color: 'var(--red)' }} id="btn-navbar-admin">
                  ⚡ Admin
                </Link>
              )}

              {/* Logout Button */}
              <button onClick={logout} className="btn btn-ghost" id="btn-logout" aria-label="Logout session">
                Exit
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" id="btn-login" aria-label="Login to your account">Login</Link>
              <Link to="/register" className="btn btn-primary" id="btn-register" aria-label="Create a new account">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

