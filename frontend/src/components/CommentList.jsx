export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="no-comments">コメントはまだありません</p>
  }

  const sorted = [...comments].sort((a, b) => b.id - a.id)

  return (
    <ul className="comment-list">
      {sorted.map((comment) => (
        <li key={comment.id} className="comment-item">
          <span className="comment-name">{comment.name}</span>
          <p className="comment-content">{comment.content}</p>
        </li>
      ))}
    </ul>
  )
}
