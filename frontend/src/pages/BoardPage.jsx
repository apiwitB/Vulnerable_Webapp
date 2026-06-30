import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/posts';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import BoardPostCard from '../components/BoardPostCard';
import Badge from '../components/Badge';

export default function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        setPosts(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch discussion posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Badge variant="accent" style={{ marginBottom: '12px' }}>🔒 Decentralized Forum</Badge>
          <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Discussion Board</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
            Exchange knowledge, tools, and warnings with other network agents.
          </p>
        </div>
        <Link to="/board/create" className="btn btn-primary" id="btn-create-post-nav">
          ✍️ Create New Post
        </Link>
      </div>

      {error && <RawErrorDisplay error={error} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Reading forum registry...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No posts available. Be the first to start a thread!
        </div>
      ) : (
        <div className="board-list" role="list">
          {posts.map((post) => (
            <Link key={post.id} to={`/board/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <BoardPostCard 
                post={{
                  ...post,
                  // Map database fields to mock fields expected by BoardPostCard
                  author: post.user?.username || 'Anonymous',
                  time: new Date(post.created_at).toLocaleDateString(),
                  replies: post.comments?.length || 0,
                  views: 100 + post.id * 15,
                  tag: post.title.includes('OPSEC') ? 'OPSEC' : 'DISCUSSION'
                }} 
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
