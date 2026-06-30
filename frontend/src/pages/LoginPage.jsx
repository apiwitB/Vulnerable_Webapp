import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import Badge from '../components/Badge';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      // [VULN] Information Leakage: Exposes raw backend exception directly
      setError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '40px 20px' }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Badge variant="accent" style={{ marginBottom: '16px' }}>🌑 Login shadowMarket</Badge>
          <h2 style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Enter your underground credentials to access listings.
          </p>
        </div>

        {/* [VULN] CSRF: Plain HTML form without anti-CSRF token protection */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="products-count" htmlFor="login-username" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Username
            </label>
            <input
              id="login-username"
              type="text"
              className="search-input"
              style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. hacker01"
              required
            />
          </div>

          <div>
            <label className="products-count" htmlFor="login-password" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="search-input"
              style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <RawErrorDisplay error={error} />}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '10px' }}
            disabled={loading}
            id="btn-login-submit"
          >
            {loading ? 'Decrypting credentials...' : 'Unlock Account 🔓'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          New agent?{' '}
          <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600 }} id="link-register">
            Register Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
