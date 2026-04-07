import { useEffect, useState } from 'react'
import ArticleItem from './ArticleItem'

export default function ArticleList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/article')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.id - a.id)
        setArticles(sorted)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status-message">読み込み中...</p>
  if (error) return <p className="status-message error">エラー: {error}</p>
  if (articles.length === 0) return <p className="status-message">記事がありません</p>

  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </div>
  )
}
