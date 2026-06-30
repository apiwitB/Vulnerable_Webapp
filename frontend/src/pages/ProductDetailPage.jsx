import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/products';
import { addToCart } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import Badge from '../components/Badge';
import UrlFetcher from '../components/UrlFetcher';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartSuccess, setCartSuccess] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, 1);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Decrypting product data...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <RawErrorDisplay error={error} />
        <Link to="/" className="btn btn-ghost" style={{ marginTop: '20px' }}>
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  // Predefined Emojis and gradients corresponding to names or fallback
  const emoji = product.name.includes('VPN') ? '🌐' : 
                product.name.includes('Generator') ? '👤' :
                product.name.includes('SQL') ? '💉' :
                product.name.includes('Fortune') ? '📂' :
                product.name.includes('Exploit') ? '💣' :
                product.name.includes('Mixer') ? '₿' :
                product.name.includes('Phishing') ? '🎣' : '🔧';

  const gradient = product.name.includes('VPN') ? 'linear-gradient(135deg,#1a1040,#2d1f6e)' : 
                   product.name.includes('Generator') ? 'linear-gradient(135deg,#0d1f2d,#1a3a4a)' :
                   product.name.includes('SQL') ? 'linear-gradient(135deg,#1f0d0d,#3a1a1a)' :
                   product.name.includes('Fortune') ? 'linear-gradient(135deg,#1f1a0d,#3a2d0a)' :
                   product.name.includes('Exploit') ? 'linear-gradient(135deg,#1a0a2a,#2d1450)' :
                   product.name.includes('Mixer') ? 'linear-gradient(135deg,#0d1f0d,#1a3a1a)' :
                   product.name.includes('Phishing') ? 'linear-gradient(135deg,#0a1520,#162840)' : 'linear-gradient(135deg,#1a0d10,#2d1520)';

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Link to="/" className="btn btn-ghost" style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '13px' }} id="btn-back-home">
        ← Back to Listings
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Visual Mock Card representation */}
        <div className="card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '340px', 
              background: gradient, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '120px',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            {emoji}
          </div>
        </div>

        {/* Product Details Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <Badge variant="accent">VERIFIED ASSET</Badge>
              {product.stock <= 5 && <Badge variant="red">LOW STOCK ({product.stock})</Badge>}
            </div>
            <h1 style={{ fontSize: '36px', letterSpacing: '-1px', marginBottom: '8px' }}>{product.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Listed by: <span style={{ color: 'var(--accent-light)' }}>vendor_id_{product.created_by}</span>
            </p>
          </div>

          <div style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Description</h3>
            <p>{product.description || 'No description provided by vendor.'}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ESCROW PRICE</span>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                ${product.price.toFixed(2)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>AVAILABILITY</span>
              <div style={{ fontSize: '16px', fontWeight: 600, color: product.stock > 0 ? 'var(--green)' : 'var(--red)', marginTop: '6px' }}>
                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn btn-primary"
              style={{ flex: 1, padding: '16px', fontSize: '16px' }}
              id="btn-add-to-cart"
            >
              📥 Add to Anonymous Cart
            </button>
          </div>

          {cartSuccess && (
            <div style={{ color: 'var(--green)', fontSize: '14px', background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              ✓ Product successfully added to escrow cart.
            </div>
          )}

          {/* SSRF Trigger Endpoint */}
          <UrlFetcher />
        </div>
      </div>
    </div>
  );
}
