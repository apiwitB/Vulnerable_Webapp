import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, deletePost } from '../api/posts';
import { createComment, deleteComment } from '../api/comments';
import { useAuth } from '../context/AuthContext';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import CommentCard from '../components/CommentCard';
import Badge from '../components/Badge';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  // Comment state
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchPostDetails = async () => {
    try {
      const data = await getPost(id);
      setPost(data);
    } catch (err) {
      setError(err.message || 'Post retrieval failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent) return;
    setCommentLoading(true);
    setError(null);

    try {
      // [VULN] Stored XSS / CSRF: Form sends commentContent straight to database
      await createComment(parseInt(id), commentContent);
      setCommentContent('');
      fetchPostDetails();
    } catch (err) {
      setError(err.message || 'Failed to submit comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Delete comment?')) return;
    try {
      await deleteComment(commentId);
      fetchPostDetails();
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  const handlePostDelete = async () => {
    if (!window.confirm('Delete thread?')) return;
    try {
      await deletePost(id);
      window.location.href = '/board';
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Decrypting forum thread...</div>;
  }

  if (error && !post) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <RawErrorDisplay error={error} />
        <Link to="/board" className="btn btn-ghost" style={{ marginTop: '20px' }}>
          ← Back to Board
        </Link>
      </div>
    );
  }

  const isPostOwner = post.user_id === user?.id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <Link to="/board" className="btn btn-ghost" style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '13px' }} id="btn-back-board">
        ← Back to Board
      </Link>

      {error && <RawErrorDisplay error={error} />}

      {post && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Main Thread Card */}
          <div className="card animate-fade-in" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <Badge variant="accent" style={{ marginBottom: '8px' }}>FORUM THREAD</Badge>
                <h1 style={{ fontSize: '30px', letterSpacing: '-0.5px' }}>{post.title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
                  Posted by <span style={{ color: 'var(--accent-light)' }}>{post.user?.username || 'Anonymous'}</span> on {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
              {(isPostOwner || isAdmin) && (
                <button
                  onClick={handlePostDelete}
                  className="btn btn-ghost"
                  style={{ color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '8px 16px', fontSize: '13px' }}
                  id="btn-delete-post"
                >
                  🗑️ Delete Post
                </button>
              )}
            </div>

            {/* [VULN] Stored XSS: Renders user-supplied post content using dangerouslySetInnerHTML */}
            <div 
              style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Comments Section */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
              Replies ({post.comments ? post.comments.length : 0})
            </h3>

            {post.comments && post.comments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {post.comments.map((comment) => (
                  <CommentCard 
                    key={comment.id} 
                    comment={comment} 
                    onDelete={handleCommentDelete} 
                  />
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', fontStyle: 'italic' }}>
                No replies yet. Start the conversation below.
              </div>
            )}

            {/* Reply Input Form */}
            {token ? (
              <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
                <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Post Reply</h4>
                {/* [VULN] CSRF: Form submits directly with cookies / credentials without anti-CSRF token verification */}
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <textarea
                    className="search-input"
                    style={{ 
                      borderRadius: 'var(--radius-md)', 
                      paddingLeft: '16px', 
                      paddingTop: '12px',
                      minHeight: '100px',
                      resize: 'vertical',
                      width: '100%'
                    }}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write your comment... (HTML tags are accepted)"
                    required
                    id="comment-textarea"
                  />
                  <button
                    type="submit"
                    disabled={commentLoading || !commentContent}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '13px', alignSelf: 'flex-end' }}
                    id="btn-comment-submit"
                  >
                    {commentLoading ? 'Transmitting...' : 'Send Reply 💬'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                You must <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Login</Link> to post replies.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
