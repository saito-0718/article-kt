import ArticleItem from './ArticleItem'

export default function ArticleList({ articles }) {
  if (articles.length === 0) return <p className="status-message">記事がありません</p>

  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </div>
  )
}
