/* src/components/Navbar.jsx — Top navigation bar */

import { useState } from 'react'

/**
 * Navbar — sticky top navigation
 * @param {number}   cartCount   จำนวนสินค้าในตะกร้า
 * @param {Function} onSearch    callback เมื่อกด Enter ในช่อง search
 */
export default function Navbar({ cartCount = 0, onSearch }) {
  const [query, setQuery] = useState('')

  function handleKey(e) {
    if (e.key === 'Enter' && onSearch) onSearch(query)
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#" className="navbar-logo" id="nav-logo">
          <div className="logo-icon" aria-hidden="true">☠️</div>
          shadow<span className="logo-dot">Market</span>
        </a>

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
          <a href="#products" className="nav-link" id="nav-products">Products</a>
          <a href="#board"    className="nav-link" id="nav-board">Board</a>
          <a href="#features" className="nav-link" id="nav-features">About</a>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="cart-btn btn-ghost" id="btn-cart" aria-label={`Cart with ${cartCount} items`}>
            🛒 Cart
            {cartCount > 0 && (
              <span className="cart-count" aria-live="polite">{cartCount}</span>
            )}
          </button>
          <button className="btn btn-ghost"    id="btn-login"    aria-label="Login to your account">Login</button>
          <button className="btn btn-primary"  id="btn-register" aria-label="Create a new account">Sign Up</button>
        </div>
      </div>
    </nav>
  )
}
