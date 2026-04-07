import { useState } from 'react'

export default function ArticleForm({ onPost }) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
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
    <form className="article-form" onSubmit={handleSubmit}>
      <h2 className="form-heading">記事を投稿する</h2>
      {error && <p className="form-error">{error}</p>}
      <div className="form-field">
        <label htmlFor="name">名前</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="content">内容</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="内容を入力"
          rows={4}
          required
        />
      </div>
      <button type="submit" className="submit-btn" disabled={submitting}>
        {submitting ? '投稿中...' : '投稿する'}
      </button>
    </form>
  )
}
