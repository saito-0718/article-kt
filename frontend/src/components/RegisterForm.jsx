import { useState } from 'react'

export default function RegisterForm({ onNavigate }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = '名前は必須です'
    if (!form.email.trim()) errs.email = 'メールアドレスは必須です'
    if (!form.password) {
      errs.password = 'パスワードは必須です'
    } else if (form.password.length < 5 || form.password.length > 10) {
      errs.password = 'パスワードは5文字以上10文字以下で入力してください'
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = '確認用パスワードは必須です'
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'パスワードが一致しません'
    }
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      if (!res.ok) {
        const text = await res.text()
        setErrors({ submit: text || '登録に失敗しました' })
        return
      }
      alert('ユーザの登録が完了しました')
      onNavigate('login')
    } catch {
      setErrors({ submit: '通信エラーが発生しました' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-form-wrapper">
      <h2 className="page-form-title">ユーザー登録</h2>
      <form className="page-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">名前</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="名前を入力"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
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
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="5〜10文字"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="confirmPassword">確認用パスワード</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="もう一度入力"
          />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>
        {errors.submit && <p className="form-error">{errors.submit}</p>}
        <div className="page-form-actions">
          <button type="button" className="secondary-btn" onClick={() => onNavigate('board')}>
            戻る
          </button>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </div>
  )
}
