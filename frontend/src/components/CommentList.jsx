import { useState } from 'react'
import ThreeDotsMenu from './ThreeDotsMenu'

export default function CommentList({ comments, userId, onPost }) {
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  if (!comments || comments.length === 0) {
    return <p className="no-comments">コメントはまだありません</p>
  }

  const sorted = [...comments].sort((a, b) => b.id - a.id)

  const handleEdit = (comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const handleSave = async (commentId) => {
    setSaving(true)
    try {
      await fetch(`/comment/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })
      setEditingId(null)
      await onPost()
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = (originalContent) => {
    setEditContent(originalContent)
    setEditingId(null)
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('コメントを削除しますか？')) return
    await fetch(`/comment/${commentId}`, { method: 'DELETE' })
    await onPost()
  }

  return (
    <ul className="comment-list">
      {sorted.map((comment) => {
        const isOwner = userId != null && comment.userId === userId
        const isEditing = editingId === comment.id

        return (
          <li key={comment.id} className="comment-item">
            <div className="comment-header">
              <span className="comment-name">{comment.displayName}</span>
              {isOwner && !isEditing && (
                <ThreeDotsMenu onEdit={() => handleEdit(comment)} onDelete={() => handleDelete(comment.id)} />
              )}
            </div>

            {isEditing ? (
              <div className="edit-mode">
                <textarea
                  className="edit-textarea"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                />
                <div className="edit-actions">
                  <button className="secondary-btn" onClick={() => handleDiscard(comment.content)}>
                    変更を破棄
                  </button>
                  <button className="submit-btn" onClick={() => handleSave(comment.id)} disabled={saving}>
                    {saving ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="comment-content">{comment.content}</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
