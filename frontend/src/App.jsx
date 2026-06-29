/* App.jsx — shadowMarketplace index page (assembled from components) */

import { useState } from 'react'
import './App.css'

import Navbar         from './components/Navbar'
import CategoryStrip  from './components/CategoryStrip'
import ProductCard    from './components/ProductCard'
import FeatureCard    from './components/FeatureCard'
import BoardPostCard  from './components/BoardPostCard'
import Badge          from './components/Badge'

import { PRODUCTS, FEATURES, POSTS } from './data/mockData'

/* ─────────────────────────────────────────
   Section: Hero
───────────────────────────────────────── */
function HeroSection() {
  /** Mock products แสดงใน mockup preview (4 ตัวแรก) */
  const preview = PRODUCTS.slice(0, 4)

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-bg-orb hero-bg-orb-1" aria-hidden="true" />
      <div className="hero-bg-orb hero-bg-orb-2" aria-hidden="true" />
      <div className="hero-grid"                  aria-hidden="true" />

      <div className="hero-inner container">
        {/* ── Left: Copy ── */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <Badge variant="accent">🌑 Underground Marketplace v4.2</Badge>
          </div>

          <h1 className="hero-title" id="hero-title">
            Buy. Sell.<br />
            <span className="hero-title-gradient">Vanish.</span>
          </h1>

          <p className="hero-subtitle">
            The premier dark-web E-Commerce platform for exclusive digital goods,
            tools, and services. Anonymous. Encrypted. Unstoppable.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" id="btn-browse" style={{ padding: '14px 28px', fontSize: '16px' }}>
              🛍️ Browse Listings
            </button>
            <button className="btn btn-ghost" id="btn-sell" style={{ padding: '14px 28px', fontSize: '16px' }}>
              💰 Start Selling
            </button>
          </div>

          <div className="hero-stats" role="list" aria-label="Marketplace statistics">
            {[
              { value: '47K+',  label: 'Active Listings' },
              { value: '12K+',  label: 'Verified Vendors' },
              { value: '$2.4M', label: 'Volume / Month'   },
            ].map(stat => (
              <div key={stat.label} className="hero-stat" role="listitem">
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Mockup ── */}
        <div className="hero-visual animate-float" aria-hidden="true">
          <div className="hero-float-badge badge-1">
            <span style={{ color: 'var(--green)' }}>●</span> 3,847 users online
          </div>
          <div className="hero-float-badge badge-2">🔒 Escrow Protected</div>

          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" />
              <span className="mockup-title">shadowMarketplace — listings</span>
            </div>
            <div className="mockup-products">
              {preview.map(p => (
                <div key={p.id} className="mockup-card">
                  <div className="mockup-img" style={{ background: p.bg }}>{p.emoji}</div>
                  <div className="mockup-product-name">{p.name}</div>
                  <div className="mockup-product-price">${p.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Section: Products (Category + Grid)
───────────────────────────────────────── */
const SORT_OPTIONS = ['featured', 'newest', 'price-low', 'price-high', 'top-rated']

function ProductsSection({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter,   setActiveFilter]   = useState('featured')

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <>
      <CategoryStrip active={activeCategory} onSelect={setActiveCategory} />

      <section className="products-section" id="products" aria-labelledby="products-heading">
        <div className="products-inner">
          {/* Toolbar */}
          <div className="products-toolbar">
            <p className="products-count" id="products-heading">
              Showing <strong>{filtered.length}</strong> listings
            </p>
            <div className="products-filters" role="group" aria-label="Sort listings">
              {SORT_OPTIONS.map(f => (
                <button
                  key={f}
                  id={`filter-${f}`}
                  className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="products-grid" role="list" aria-label="Product listings">
            {filtered.map(product => (
              <div role="listitem" key={product.id}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─────────────────────────────────────────
   Section: Platform Features
───────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section className="features-section" id="features" aria-labelledby="features-title">
      <div className="features-inner">
        <div className="section-header" style={{ maxWidth: '100%', margin: 0 }}>
          <div>
            <h2 className="section-title" id="features-title">
              Why choose <span>shadow</span>Market?
            </h2>
            <p className="section-subtitle">Built for anonymity. Designed for trust.</p>
          </div>
        </div>

        <div className="features-grid" role="list" aria-label="Platform features">
          {FEATURES.map(feat => (
            <div role="listitem" key={feat.title}>
              <FeatureCard {...feat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Section: Discussion Board preview
───────────────────────────────────────── */
function BoardSection() {
  return (
    <section className="board-section" id="board" aria-labelledby="board-title">
      <div className="board-inner">
        <div className="section-header">
          <div>
            <h2 className="section-title" id="board-title">
              Discussion <span>Board</span>
            </h2>
            <p className="section-subtitle">Community knowledge, shared anonymously.</p>
          </div>
          <button className="btn btn-outline" id="btn-view-board" aria-label="View all board posts">
            View All →
          </button>
        </div>

        <div className="board-list" role="list" aria-label="Recent discussion posts">
          {POSTS.map(post => (
            <div role="listitem" key={post.id}>
              <BoardPostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Section: Call to Action
───────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="cta-inner">
        <Badge variant="accent" style={{ marginBottom: '20px', display: 'inline-flex' }}>
          🔥 Join 12,000+ vendors
        </Badge>
        <h2 className="cta-title" id="cta-title">
          Ready to start<br />
          <span style={{ color: 'var(--accent-light)' }}>selling in the shadows?</span>
        </h2>
        <p className="cta-subtitle">
          Create your vendor account in minutes. No KYC. No traces. Just pure commerce.
        </p>
        <div className="cta-actions">
          <button className="btn btn-primary" id="cta-register" style={{ padding: '14px 32px', fontSize: '16px' }}>
            🚀 Create Vendor Account
          </button>
          <button className="btn btn-ghost" id="cta-learn" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Section: Footer
───────────────────────────────────────── */
const FOOTER_COLS = [
  { title: 'Marketplace', links: ['All Listings', 'Digital Goods', 'Accounts', 'Tools', 'Exploits'] },
  { title: 'Community',   links: ['Discussion Board', 'Reviews', 'Vendors', 'Escrow System'] },
  { title: 'Account',     links: ['Login', 'Register', 'My Orders', 'My Profile', 'Admin Panel'] },
]

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
  )
}

/* ─────────────────────────────────────────
   Root App
───────────────────────────────────────── */
export default function App() {
  const [cartItems, setCartItems] = useState([])

  function addToCart(product) {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  function handleSearch(query) {
    // [VULN] intentional: log sensitive queries to console (Information Disclosure)
    console.log('[shadowMarket] search query:', query)
  }

  const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0)

  return (
    <>
      <Navbar cartCount={totalQty} onSearch={handleSearch} />
      <main id="main-content">
        <HeroSection />
        <ProductsSection onAddToCart={addToCart} />
        <FeaturesSection />
        <BoardSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
