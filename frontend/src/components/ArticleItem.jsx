import CommentList from './CommentList'

export default function ArticleItem({ article }) {
  return (
    <div className="article-item">
      <div className="article-header">
        <span className="article-id">#{article.id}</span>
        <span className="article-name">{article.name}</span>
      </div>
      <p className="article-content">{article.content}</p>
      <div className="comment-section">
        <h3 className="comment-heading">コメント</h3>
        <CommentList comments={article.commentList} />
      </div>
    </div>
  )
}
