import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPost } from '../api/posts';
import { RawErrorDisplay } from '../components/ErrorBoundary';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // [VULN] Stored XSS: Sends raw, un-sanitized content directly to server
      const newPost = await createPost({ title, content });
      navigate(`/board/${newPost.id}`);
    } catch (err) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '720px' }}>
      <Link to="/board" className="btn btn-ghost" style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '13px' }} id="btn-back-board">
        ← Back to Board
      </Link>

      <div className="card animate-slide-up" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '28px', letterSpacing: '-0.5px', marginBottom: '8px' }}>✍️ Write New Thread</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          Publish information anonymously. Markup tags are allowed.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="products-count" htmlFor="post-title" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Thread Title
            </label>
            <input
              id="post-title"
              type="text"
              className="search-input"
              style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Important zero-day vulnerability announcement"
              required
            />
          </div>

          <div>
            <label className="products-count" htmlFor="post-content" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Content / Details (No Client sanitization)
            </label>
            <textarea
              id="post-content"
              className="search-input"
              style={{ 
                borderRadius: 'var(--radius-md)', 
                paddingLeft: '16px', 
                paddingTop: '12px',
                minHeight: '200px', 
                resize: 'vertical',
                width: '100%'
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide analysis or paste codes..."
              required
            />
          </div>

          {error && <RawErrorDisplay error={error} />}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            disabled={loading}
            id="btn-publish-post"
          >
            {loading ? 'Transmitting package...' : 'Broadcast Thread 📡'}
          </button>
        </form>
      </div>
    </div>
  );
}
