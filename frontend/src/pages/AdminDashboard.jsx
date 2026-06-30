import { Link } from 'react-router-dom';
import Badge from '../components/Badge';

export default function AdminDashboard() {
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Badge variant="red" style={{ marginBottom: '12px' }}>⚠️ Admin Node privileges active</Badge>
        <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Admin Panel Terminal</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
          Manage users, listing catalog, and global escrow registries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* User Admin link */}
        <div className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '36px' }}>👥</div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>User Management</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Inspect registered agent identities and elevate credentials/role levels.
            </p>
          </div>
          <Link to="/admin/users" className="btn btn-outline" style={{ marginTop: 'auto', textAlign: 'center' }} id="btn-admin-users">
            Configure Users →
          </Link>
        </div>

        {/* Catalog management */}
        <div className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '36px' }}>🛍️</div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>Catalog Control</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Inject, modify, or terminate listed digital assets in the marketplace.
            </p>
          </div>
          <Link to="/admin/products" className="btn btn-outline" style={{ marginTop: 'auto', textAlign: 'center' }} id="btn-admin-products">
            Control Catalog →
          </Link>
        </div>

        {/* Global Orders list */}
        <div className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '36px' }}>📦</div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>Escrow Operations</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Monitor global multisig escrow status and manual dispute resolution.
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-outline" style={{ marginTop: 'auto', textAlign: 'center' }} id="btn-admin-orders">
            Audit Escrows →
          </Link>
        </div>
      </div>
    </div>
  );
}
