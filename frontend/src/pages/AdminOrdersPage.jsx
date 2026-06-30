import { useState, useEffect } from 'react';
import { getAdminOrders } from '../api/admin';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import Badge from '../components/Badge';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getAdminOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Failed to retrieve global orders registry');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Escrow Operations audit</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
          Inspect global escrow multisig contracts and statuses.
        </p>
      </div>

      {error && <RawErrorDisplay error={error} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading escrow database logs...</div>
      ) : (
        <div className="card animate-fade-in" style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Agent ID</th>
                <th style={{ padding: '12px' }}>Created Date</th>
                <th style={{ padding: '12px' }}>Escrow value</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>#{o.id}</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>agent_{o.user_id}</td>
                  <td style={{ padding: '12px' }}>{new Date(o.created_at).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--accent-light)' }}>
                    ${o.total.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Badge variant={o.status === 'completed' ? 'green' : o.status === 'pending' ? 'amber' : 'red'}>
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
