import { useEffect, useState } from 'react'
import ArticleList from './components/ArticleList'
import ArticleForm from './components/ArticleForm'
import HamburgerMenu from './components/HamburgerMenu'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('board')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loggedInUser, setLoggedInUser] = useState(() => localStorage.getItem('username'))
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('userId')
    return stored ? Number(stored) : null
  })

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

  const handleLoginSuccess = (newToken, name, newUserId) => {
    setToken(newToken)
    setLoggedInUser(name)
    setUserId(newUserId)
    localStorage.setItem('userId', newUserId)
    setCurrentPage('board')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    setToken(null)
    setLoggedInUser(null)
    setUserId(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1
          className="app-header-title"
          onClick={() => setCurrentPage('board')}
          style={{ cursor: 'pointer' }}
        >
          掲示板
        </h1>
        <div className="header-right">
          {loggedInUser ? (
            <div className="user-info">
              <span className="username-display">{loggedInUser} さん</span>
              <button className="logout-btn" onClick={handleLogout}>
                ログアウト
              </button>
            </div>
          ) : (
            <HamburgerMenu onNavigate={setCurrentPage} />
          )}
        </div>
      </header>
      <main className="app-main">
        {currentPage === 'board' && (
          <>
            <ArticleForm onPost={fetchArticles} loggedInUser={loggedInUser} userId={userId} />
            {loading && <p className="status-message">読み込み中...</p>}
            {error && <p className="status-message error">エラー: {error}</p>}
            {!loading && !error && (
              <ArticleList
                articles={articles}
                onPost={fetchArticles}
                loggedInUser={loggedInUser}
                userId={userId}
              />
            )}
          </>
        )}
        {currentPage === 'register' && (
          <RegisterForm onNavigate={setCurrentPage} />
        )}
        {currentPage === 'login' && (
          <LoginForm onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />
        )}
      </main>
    </div>
  )
}
