import { useState, useEffect } from 'react'

export default function CommentForm({ articleId, onPost, loggedInUser, userId }) {
  const [name, setName] = useState(loggedInUser ?? '')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setName(loggedInUser ?? '')
  }, [loggedInUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // ログイン済み: name=null, userId を送信
    // 未ログイン:   name を送信, userId は送らない
    const params = new URLSearchParams()
    params.append('content', content)
    params.append('articleId', articleId)
    if (loggedInUser) {
      params.append('userId', userId)
    } else {
      params.append('name', name)
    }

    try {
      const res = await fetch('/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      })
      if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)
      setContent('')
      if (!loggedInUser) setName('')
      await onPost()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <div className="comment-form-fields">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前"
          readOnly={!!loggedInUser}
          className={loggedInUser ? 'input-locked' : ''}
          required={!loggedInUser}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="コメントを入力"
          rows={3}
          required
        />
        <button type="submit" className="comment-submit-btn" disabled={submitting}>
          {submitting ? '送信中...' : '送信'}
        </button>
      </div>
    </form>
  )
}
