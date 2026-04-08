import { useState } from 'react'

export default function CommentForm({ articleId, onPost }) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append('name', name)
      params.append('content', content)
      params.append('articleId', articleId)

      const res = await fetch('/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      })
      if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)
      setName('')
      setContent('')
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
          required
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
