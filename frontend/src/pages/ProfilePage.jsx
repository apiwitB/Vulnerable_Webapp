import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, updateUser } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import Badge from '../components/Badge';
import FileUploader from '../components/FileUploader';

export default function ProfilePage() {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user: currentUser, setUser: setCurrentUser } = useAuth();

  // Profile Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchProfile = async () => {
    try {
      // [VULN] IDOR: Fetches profile data of any user by ID without ownership checks
      const data = await getUser(id);
      setProfileUser(data);
      setUsername(data.username || '');
      setEmail(data.email || '');
      setRole(data.role || 'user');
      setAvatarUrl(data.avatar_url || '');
    } catch (err) {
      setError(err.message || 'Profile retrieval failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // [VULN] Mass Assignment / IDOR: Sends 'role' and updates user ID based on url parameter directly
      const payload = { username, email, role, avatar_url: avatarUrl };
      const updated = await updateUser(id, payload);
      
      setProfileUser(updated);
      setSuccess(true);

      // If we updated our own profile, update AuthContext state as well
      if (currentUser && currentUser.id === parseInt(id)) {
        setCurrentUser({ ...currentUser, ...updated });
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Profile update failed');
    }
  };

  const handleUploadComplete = (newAvatarUrl) => {
    setAvatarUrl(newAvatarUrl);
    setSuccess(true);
    fetchProfile();
  };

  if (loading) {
    return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Decrypting profile node...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px', marginBottom: '24px' }}>👤 Agent Profile Terminal</h2>

      {error && <RawErrorDisplay error={error} />}
      {success && (
        <div style={{ color: 'var(--green)', fontSize: '14px', background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center', marginBottom: '20px' }}>
          ✓ Node database synchronized successfully.
        </div>
      )}

      {profileUser && (
        <div className="card animate-fade-in" style={{ padding: '32px' }}>
          {/* Avatar and Metadata banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
            <div 
              style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'var(--grad-accent)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '36px',
                overflow: 'hidden',
                border: '2px solid var(--accent)'
              }}
            >
              {avatarUrl ? (
                <img src={`http://localhost:8000${avatarUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                username[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '24px' }}>{profileUser.username}</h3>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <Badge variant={profileUser.role === 'admin' ? 'red' : 'accent'}>{profileUser.role}</Badge>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #{profileUser.id}</span>
              </div>
            </div>
          </div>

          {/* Upload avatar */}
          <div style={{ marginBottom: '32px', background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <FileUploader onUploadComplete={handleUploadComplete} onError={setError} />
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="products-count" htmlFor="profile-username" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Username
              </label>
              <input
                id="profile-username"
                type="text"
                className="search-input"
                style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="products-count" htmlFor="profile-email" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                className="search-input"
                style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* [VULN] Mass Assignment Vulnerability: Directly exposing the 'role' field in update profile */}
            <div>
              <label className="products-count" htmlFor="profile-role" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Access Role Level (Mass Assignment point)
              </label>
              <select
                id="profile-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="search-input"
                style={{ 
                  borderRadius: 'var(--radius-md)', 
                  paddingLeft: '12px', 
                  appearance: 'none', 
                  background: 'var(--bg-elevated) url("data:image/svg+xml;utf8,<svg fill=\'gray\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat 95% 50%' 
                }}
              >
                <option value="user">user (Standard encryption agent)</option>
                <option value="admin">admin (Full node privileges)</option>
              </select>
            </div>

            <div>
              <label className="products-count" htmlFor="profile-avatar" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Avatar Asset Path
              </label>
              <input
                id="profile-avatar"
                type="text"
                className="search-input"
                style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="/static/uploads/avatar.jpg"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '10px' }}
              id="btn-update-profile"
            >
              🔄 Update Node Identity
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
