import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryStrip from '../components/CategoryStrip';
import ProductCard from '../components/ProductCard';
import FeatureCard from '../components/FeatureCard';
import BoardPostCard from '../components/BoardPostCard';
import Badge from '../components/Badge';
import { getProducts } from '../api/products';
import { addToCart } from '../api/cart';
import { getPosts } from '../api/posts';
import { FEATURES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-bg-orb hero-bg-orb-1" aria-hidden="true" />
      <div className="hero-bg-orb hero-bg-orb-2" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner container">
        <div className="hero-content animate-slide-up">
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
            <a href="#products" className="btn btn-primary" id="btn-browse" style={{ padding: '14px 28px', fontSize: '16px' }}>
              🛍️ Browse Listings
            </a>
            <Link to="/board" className="btn btn-ghost" id="btn-sell" style={{ padding: '14px 28px', fontSize: '16px' }}>
              💬 Join Discussions
            </Link>
          </div>
        </div>

        <div className="hero-visual animate-float" aria-hidden="true">
          <div className="hero-float-badge badge-1">
            <span style={{ color: 'var(--green)' }}>●</span> 3,847 users online
          </div>
          <div className="hero-float-badge badge-2">🔒 Escrow Protected</div>

          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" />
              <span className="mockup-title">shadowMarketplace — status</span>
            </div>
            <div style={{ padding: '10px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <p style={{ fontFamily: 'monospace', color: 'var(--accent-light)', marginBottom: '8px' }}>&gt; Initializing OPSEC layers...</p>
              <p style={{ fontFamily: 'monospace', color: 'var(--green)', marginBottom: '8px' }}>&gt; Tor tunnel established. [OK]</p>
              <p style={{ fontFamily: 'monospace', color: 'var(--green)', marginBottom: '8px' }}>&gt; P2P Escrow node sync. [OK]</p>
              <p style={{ fontFamily: 'monospace', color: 'var(--amber)' }}>&gt; WARNING: System debug mode active. Tracebacks enabled.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const prodData = await getProducts();
        setProducts(prodData || []);
        
        const postData = await getPosts(0, 4);
        setPosts(postData || []);
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      alert(`✓ ${product.name} added to cart.`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => {
        // Simple client mapping since backend model doesn't strictly have categories table
        // We'll classify mock items based on their names
        const cat = p.name.includes('VPN') || p.name.includes('Phishing') ? 'digital' :
                    p.name.includes('Generator') ? 'accounts' :
                    p.name.includes('SQL') || p.name.includes('Mixer') || p.name.includes('RAT') ? 'tools' :
                    p.name.includes('Dump') ? 'data' :
                    p.name.includes('Exploit') ? 'exploits' : 'digital';
        return cat === activeCategory;
      });

  return (
    <div>
      <HeroSection />

      <CategoryStrip active={activeCategory} onSelect={setActiveCategory} />

      <section className="products-section" id="products" aria-labelledby="products-heading">
        <div className="products-inner">
          <div className="products-toolbar">
            <p className="products-count" id="products-heading">
              Showing <strong>{filteredProducts.length}</strong> active listings
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Retrieving database listings...
            </div>
          ) : (
            <div className="products-grid" role="list" aria-label="Product listings">
              {filteredProducts.map(product => (
                <div role="listitem" key={product.id}>
                  <ProductCard 
                    product={{
                      ...product,
                      // Append defaults to match styling
                      bg: product.name.includes('VPN') ? 'linear-gradient(135deg,#1a1040,#2d1f6e)' : 
                          product.name.includes('Generator') ? 'linear-gradient(135deg,#0d1f2d,#1a3a4a)' :
                          product.name.includes('SQL') ? 'linear-gradient(135deg,#1f0d0d,#3a1a1a)' :
                          product.name.includes('Dump') ? 'linear-gradient(135deg,#1f1a0d,#3a2d0a)' :
                          product.name.includes('Exploit') ? 'linear-gradient(135deg,#1a0a2a,#2d1450)' : 'linear-gradient(135deg,#0d1f0d,#1a3a1a)',
                      emoji: product.name.includes('VPN') ? '🌐' : 
                             product.name.includes('Generator') ? '👤' :
                             product.name.includes('SQL') ? '💉' :
                             product.name.includes('Dump') ? '📂' :
                             product.name.includes('Exploit') ? '💣' : '🔧',
                      category: product.name.includes('VPN') || product.name.includes('Phishing') ? 'digital' :
                                product.name.includes('Generator') ? 'accounts' : 'tools',
                    }} 
                    onAddToCart={() => handleAddToCart(product)} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-inner">
          <div className="section-header" style={{ maxWidth: '100%', margin: 0 }}>
            <div>
              <h2 className="section-title">
                Why choose <span>shadow</span>Market?
              </h2>
              <p className="section-subtitle">Built for anonymity. Designed for trust.</p>
            </div>
          </div>
          <div className="features-grid" role="list">
            {FEATURES.map(feat => (
              <div role="listitem" key={feat.title}>
                <FeatureCard {...feat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discussions Board Section */}
      <section className="board-section" id="board">
        <div className="board-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Discussion <span>Board</span>
              </h2>
              <p className="section-subtitle">Community knowledge, shared anonymously.</p>
            </div>
            <Link to="/board" className="btn btn-outline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading board posts...</div>
          ) : (
            <div className="board-list" role="list">
              {posts.slice(0, 4).map(post => (
                <div role="listitem" key={post.id}>
                  <BoardPostCard 
                    post={{
                      ...post,
                      // Map field names
                      author: post.user?.username || 'Anonymous',
                      time: new Date(post.created_at).toLocaleDateString(),
                      replies: post.comments?.length || 0,
                      views: 120 + post.id * 15,
                      tag: post.title.includes('OPSEC') ? 'OPSEC' : 'DISCUSSION'
                    }} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
