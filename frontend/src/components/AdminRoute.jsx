import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading auth state...</div>;
  }

  // [VULN] Broken Access Control: checks the role stored in localStorage.
  // Tampering with localStorage (e.g. set user.role = 'admin') bypasses this check on client-side routing.
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
