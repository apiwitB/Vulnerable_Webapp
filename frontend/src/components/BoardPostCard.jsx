/* src/components/BoardPostCard.jsx — Discussion board post row card */

import Badge from './Badge'

const TAG_VARIANT = { OPSEC: 'accent', REVIEW: 'amber', TUTORIAL: 'green', DISCUSSION: 'accent' }

/**
 * BoardPostCard — แถว post ใน discussion board
 * @param {object} post  ข้อมูล post จาก mockData
 */
export default function BoardPostCard({ post }) {
  return (
    <article
      className="board-post-card"
      id={`post-${post.id}`}
      tabIndex={0}
      aria-label={`Post: ${post.title}`}
    >
      {/* Avatar */}
      <div
        className="board-post-avatar"
        aria-hidden="true"
        style={{ background: `hsl(${post.id * 60}, 60%, 35%)` }}
      >
        {post.author[0].toUpperCase()}
      </div>

      {/* Content */}
      <div className="board-post-content">
        <div className="board-post-title">{post.title}</div>
        <div className="board-post-meta">
          <Badge
            variant={TAG_VARIANT[post.tag] ?? 'accent'}
            style={{ fontSize: '10px', padding: '2px 8px' }}
          >
            {post.tag}
          </Badge>
          <span>by {post.author}</span>
          <span>{post.time}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="board-post-stats" aria-label="Post statistics">
        <div className="board-post-stat" title="Replies">
          <span aria-hidden="true">💬</span> {post.replies}
        </div>
        <div className="board-post-stat" title="Views">
          <span aria-hidden="true">👁️</span> {post.views.toLocaleString()}
        </div>
      </div>
    </article>
  )
}
