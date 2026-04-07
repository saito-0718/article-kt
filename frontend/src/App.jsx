import { useEffect, useState } from 'react'
import ArticleList from './components/ArticleList'
import ArticleForm from './components/ArticleForm'
import './App.css'

export default function App() {
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
    fetchArticles()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>掲示板</h1>
      </header>
      <main className="app-main">
        <ArticleForm onPost={fetchArticles} />
        {loading && <p className="status-message">読み込み中...</p>}
        {error && <p className="status-message error">エラー: {error}</p>}
        {!loading && !error && <ArticleList articles={articles} />}
      </main>
    </div>
  )
}
