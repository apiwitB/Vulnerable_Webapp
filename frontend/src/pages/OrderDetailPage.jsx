import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api/orders';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import Badge from '../components/Badge';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        // [VULN] Information Leakage: Expose raw error trace on IDOR attempts if database crashes or returns 500
        setError(err.message || 'Order details retrieval failed');
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Decrypting order node...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <RawErrorDisplay error={error} />
        <Link to="/orders" className="btn btn-ghost" style={{ marginTop: '20px' }}>
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <Link to="/orders" className="btn btn-ghost" style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '13px' }} id="btn-back-orders">
        ← Back to Orders
      </Link>

      <div className="card animate-fade-in" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SECURE ESCROW CONTRACT</span>
            <h2 style={{ fontSize: '28px', letterSpacing: '-0.5px', marginTop: '4px' }}>Order #{order.id}</h2>
          </div>
          <div>
            <Badge variant={order.status === 'completed' ? 'green' : order.status === 'pending' ? 'amber' : 'red'}>
              {order.status}
            </Badge>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assets Escrowed</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {order.items && order.items.map((item) => (
                <div 
                  key={item.id} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.product.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Escrow Total Value:</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-light)', fontFamily: 'var(--font-display)' }}>
              ${order.total.toFixed(2)}
            </span>
          </div>

          <div style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.1)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
            🔒 <strong>Escrow Protection Enabled:</strong> Funds are held securely in darkpool multisig address. Only released to vendor upon buyer confirmation. Owner Account ID: <span style={{ color: 'var(--accent-light)', fontFamily: 'monospace' }}>{order.user_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
