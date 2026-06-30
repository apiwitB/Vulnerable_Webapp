import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import Badge from '../components/Badge';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // [VULN] Broken Auth: No client-side checks for password strength or rules
      await register(username, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
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
          <Badge variant="accent" style={{ marginBottom: '16px' }}>☠️ Register Agent</Badge>
          <h2 style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>Join the Network</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Initialize your shadow identity on the grid.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', color: 'var(--green)', padding: '20px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--radius-md)' }}>
            ✓ Registration completed! Redirecting to login terminal...
          </div>
        ) : (
          /* [VULN] CSRF: Plain HTML form without anti-CSRF token protection */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="products-count" htmlFor="reg-username" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Username
              </label>
              <input
                id="reg-username"
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
              <label className="products-count" htmlFor="reg-email" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                className="search-input"
                style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@shadow.local"
                required
              />
            </div>

            <div>
              <label className="products-count" htmlFor="reg-password" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Password (No strength checks)
              </label>
              <input
                id="reg-password"
                type="password"
                className="search-input"
                style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (e.g. 12345)"
                required
              />
            </div>

            {error && <RawErrorDisplay error={error} />}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '10px' }}
              disabled={loading}
              id="btn-register-submit"
            >
              {loading ? 'Transmitting credentials...' : 'Establish Identity 💾'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }} id="link-login">
            Login here →
          </Link>
        </div>
      </div>
    </div>
  );
}
