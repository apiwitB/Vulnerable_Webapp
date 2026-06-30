import { useState, useEffect } from 'react';
import { getAdminUsers, updateUserRole } from '../api/admin';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import Badge from '../components/Badge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve admin user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      // [VULN] Admin bypass demo: User can trigger this bypass via setting headers
      // Normally uses standard token from client.js, but also allows X-Admin bypass
      await updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user role');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Configure Registered Agents</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
          Database level role privileges control room.
        </p>
      </div>

      {error && <RawErrorDisplay error={error} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Fetching user indexes...</div>
      ) : (
        <div className="card animate-fade-in" style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Username</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Created At</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>#{u.id}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{u.username}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <Badge variant={u.role === 'admin' ? 'red' : 'accent'}>{u.role}</Badge>
                  </td>
                  <td style={{ padding: '12px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="search-input"
                      style={{ 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '4px 8px', 
                        width: 'auto', 
                        background: 'var(--bg-elevated)',
                        borderColor: 'var(--border)'
                      }}
                      id={`select-role-${u.id}`}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
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
