import { useEffect, useState } from 'react'
import ArticleList from './components/ArticleList'
import ArticleForm from './components/ArticleForm'
import HamburgerMenu from './components/HamburgerMenu'
import RegisterForm from './components/RegisterForm'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('board')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchArticles = async () => {
    try {
      const res = await fetch('/article')
      if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)
      const data = await res.json()
      setArticles([...data].sort((a, b) => b.id - a.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentPage === 'board') fetchArticles()
  }, [currentPage])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-header-title" onClick={() => setCurrentPage('board')} style={{ cursor: 'pointer' }}>
          掲示板
        </h1>
        <HamburgerMenu onNavigate={setCurrentPage} />
      </header>
      <main className="app-main">
        {currentPage === 'board' && (
          <>
            <ArticleForm onPost={fetchArticles} />
            {loading && <p className="status-message">読み込み中...</p>}
            {error && <p className="status-message error">エラー: {error}</p>}
            {!loading && !error && <ArticleList articles={articles} onPost={fetchArticles} />}
          </>
        )}
        {currentPage === 'register' && (
          <RegisterForm onNavigate={setCurrentPage} />
        )}
        {currentPage === 'login' && (
          <div className="page-form-wrapper">
            <h2 className="page-form-title">ログイン</h2>
            <p style={{ color: '#666', marginTop: '12px' }}>ログイン機能は準備中です。</p>
            <button className="secondary-btn" style={{ marginTop: '16px' }} onClick={() => setCurrentPage('board')}>
              掲示板に戻る
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
