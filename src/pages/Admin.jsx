import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchPosts();
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`"${postTitle}" 글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(post => post.id !== postId));
      alert('글이 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>관리자 페이지</h1>
        <Link to="/write" className="btn-new">
          새 글 작성
        </Link>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>전체 글</h3>
          <p className="stat-number">{posts.length}</p>
        </div>
        <div className="stat-card">
          <h3>전체 조회수</h3>
          <p className="stat-number">
            {posts.reduce((sum, post) => sum + (post.views || 0), 0)}
          </p>
        </div>
      </div>

      <div className="posts-table">
        <h2>글 목록</h2>
        {posts.length === 0 ? (
          <p className="no-posts">아직 작성된 글이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>제목</th>
                <th>카테고리</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/post/${post.id}`} className="post-link">
                      {post.title}
                    </Link>
                  </td>
                  <td>{post.category || '-'}</td>
                  <td>
                    {post.createdAt && format(
                      post.createdAt.toDate?.() || new Date(post.createdAt),
                      'yyyy-MM-dd'
                    )}
                  </td>
                  <td>{post.views || 0}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/write/${post.id}`} className="btn-edit">
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="btn-delete"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Admin;