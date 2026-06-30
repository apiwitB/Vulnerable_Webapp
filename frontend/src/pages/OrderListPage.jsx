import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import Badge from '../components/Badge';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Failed to retrieve orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Decrypting order registry...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px', marginBottom: '24px' }}>📦 Order History</h2>

      {error && <RawErrorDisplay error={error} />}

      {!error && orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No orders found in your escrow cache. <Link to="/" style={{ color: 'var(--accent-light)' }}>Browse listings</Link> to create orders.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="card animate-fade-in" 
              style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ORDER ID: #{order.id}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Placed on: {new Date(order.created_at).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <Badge variant={order.status === 'completed' ? 'green' : order.status === 'pending' ? 'amber' : 'red'}>
                    {order.status}
                  </Badge>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TOTAL VALUE</span>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                    ${order.total.toFixed(2)}
                  </div>
                </div>
                <Link to={`/orders/${order.id}`} className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '13px' }} id={`btn-view-order-${order.id}`}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
