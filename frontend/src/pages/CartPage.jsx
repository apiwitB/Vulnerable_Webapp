import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, updateCart, removeFromCart } from '../api/cart';
import { createOrder } from '../api/orders';
import { RawErrorDisplay } from '../components/ErrorBoundary';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQtyChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      // [VULN] IDOR: Sends request targeting arbitrary item IDs
      await updateCart(itemId, newQty);
      fetchCart();
    } catch (err) {
      setError(err.message || 'Failed to update item quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      // [VULN] IDOR: Sends delete request targeting arbitrary item IDs
      await removeFromCart(itemId);
      fetchCart();
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart');
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await createOrder();
      setCheckoutSuccess(true);
      setCartItems([]);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading && cartItems.length === 0) {
    return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Decrypting cart items...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px', marginBottom: '24px' }}>🛒 Secure Escrow Cart</h2>

      {error && <RawErrorDisplay error={error} />}

      {checkoutSuccess ? (
        <div style={{ textAlign: 'center', color: 'var(--green)', padding: '24px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--radius-md)' }}>
          ✓ Order established! Smart contract escrow initialized. Redirecting to order terminal...
        </div>
      ) : cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Your cart is empty. <Link to="/" style={{ color: 'var(--accent-light)' }}>Browse listings</Link> to buy digital assets.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Cart items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="card animate-fade-in" 
                style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div 
                    style={{ 
                      width: '52px', 
                      height: '52px', 
                      background: 'var(--bg-elevated)', 
                      borderRadius: 'var(--radius-sm)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    🔧
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{item.product.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Price: ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button 
                      onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                      className="btn btn-ghost" 
                      style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}
                      id={`dec-qty-${item.id}`}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 600, width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button 
                      onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                      className="btn btn-ghost" 
                      style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}
                      id={`inc-qty-${item.id}`}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="btn btn-ghost" 
                    style={{ padding: '10px 14px', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    id={`remove-item-${item.id}`}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Panel */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Escrow Summary
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--text-secondary)' }}>
              <span>Escrow Fee</span>
              <span style={{ color: 'var(--green)' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent-light)' }}>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
              disabled={loading}
              id="btn-checkout"
            >
              🔒 Check out Anonymous Escrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
