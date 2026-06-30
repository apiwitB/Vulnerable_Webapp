import Badge from './Badge';

export default function CommentCard({ comment, onDelete }) {
  const authorName = comment.user?.username || 'Anonymous';
  const role = comment.user?.role || 'user';
  const isCommentOwner = comment.user_id === JSON.parse(localStorage.getItem('user') || '{}')?.id;
  const isAdmin = JSON.parse(localStorage.getItem('user') || '{}')?.role === 'admin';

  return (
    <div className="comment-card card animate-fade-in" style={{ padding: '16px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="board-post-avatar" style={{ width: '32px', height: '32px', fontSize: '13px' }}>
            {authorName[0].toUpperCase()}
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{authorName}</span>
            {role === 'admin' && (
              <Badge variant="red" style={{ marginLeft: '6px', fontSize: '10px' }}>Admin</Badge>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {new Date(comment.created_at).toLocaleString()}
          </span>
          {(isCommentOwner || isAdmin) && onDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="btn btn-ghost"
              style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)' }}
              id={`delete-comment-${comment.id}`}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* [VULN] Stored XSS: Renders user-supplied comment text using dangerouslySetInnerHTML */}
      <div 
        className="comment-content"
        dangerouslySetInnerHTML={{ __html: comment.content }}
        style={{ fontSize: '14px', color: 'var(--text-secondary)', paddingLeft: '42px', wordBreak: 'break-word' }}
      />
    </div>
  );
}
