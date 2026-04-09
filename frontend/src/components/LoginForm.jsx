import { useState } from 'react'

export default function LoginForm({ onLoginSuccess, onNavigate }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'ログインに失敗しました')
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.name)
      onLoginSuccess(data.token, data.name, data.userId)
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-form-wrapper">
      <h2 className="page-form-title">ログイン</h2>
      <form className="page-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@example.com"
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">パスワード</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="パスワードを入力"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
            >
              {showPassword ? '非表示' : '表示'}
            </button>
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="page-form-actions">
          <button type="button" className="secondary-btn" onClick={() => onNavigate('board')}>
            戻る
          </button>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>
      </form>
    </div>
  )
}
