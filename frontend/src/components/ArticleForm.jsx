import { useState, useEffect } from 'react'

export default function ArticleForm({ onPost, loggedInUser, userId }) {
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
    // 未ログイン:   name を送信, userId=null
    const body = loggedInUser
      ? { name: null, content, userId }
      : { name, content, userId: null }

    try {
      const res = await fetch('/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
    <form className="article-form" onSubmit={handleSubmit}>
      <h2 className="form-heading">記事を投稿する</h2>
      {error && <p className="form-error">{error}</p>}
      <div className="form-field">
        <label htmlFor="article-name">名前</label>
        <input
          id="article-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
          readOnly={!!loggedInUser}
          className={loggedInUser ? 'input-locked' : ''}
          required={!loggedInUser}
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
