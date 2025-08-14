import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import './PostList.css';

function PostList({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <p>아직 작성된 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <article key={post.id} className="post-card">
          <Link to={`/post/${post.id}`} className="post-link">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-excerpt">
              {post.content?.substring(0, 150)}...
            </p>
            <div className="post-meta">
              <span className="post-date">
                {post.createdAt && format(post.createdAt.toDate?.() || new Date(post.createdAt), 'yyyy년 MM월 dd일')}
              </span>
              {post.category && (
                <span className="post-category">{post.category}</span>
              )}
              <span className="post-views">조회 {post.views || 0}</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export default PostList;