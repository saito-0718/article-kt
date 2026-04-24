import { useState } from 'react'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import ThreeDotsMenu from './ThreeDotsMenu'

export default function ArticleItem({ article, onPost, loggedInUser, userId }) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(article.content)
  const [saving, setSaving] = useState(false)

  const isOwner = userId != null && article.userId === userId

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/article/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })
      setEditing(false)
      await onPost()
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    setEditContent(article.content)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('投稿を削除しますか？')) return
    await fetch(`/article/${article.id}`, { method: 'DELETE' })
    await onPost()
  }

  return (
    <div className="article-item">
      <div className="article-header">
        <span className="article-id">#{article.id}</span>
        <span className="article-name">{article.displayName}</span>
        {isOwner && !editing && (
          <ThreeDotsMenu onEdit={() => setEditing(true)} onDelete={handleDelete} />
        )}
      </div>

      {editing ? (
        <div className="edit-mode">
          <textarea
            className="edit-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
          />
          <div className="edit-actions">
            <button className="secondary-btn" onClick={handleDiscard}>
              変更を破棄
            </button>
            <button className="submit-btn" onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      ) : (
        <p className="article-content">{article.content}</p>
      )}

      <div className="comment-section">
        <h3 className="comment-heading">コメント</h3>
        <CommentList comments={article.commentList} userId={userId} onPost={onPost} />
      </div>
      <CommentForm
        articleId={article.id}
        onPost={onPost}
        loggedInUser={loggedInUser}
        userId={userId}
        likeCount={article.articleLikes?.length ?? 0}
        isLiked={!!(article.articleLikes?.find((like) => like.userId === userId))}
        likedId={article.articleLikes?.find((like) => like.userId === userId)?.id}
        canLike={userId != null}
      />
    </div>
  )
}
