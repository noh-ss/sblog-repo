import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import './PostView.css';

function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (id) {
      fetchPost();
      incrementViews();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      const docRef = doc(db, 'posts', id);
      await updateDoc(docRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'posts', id));
      alert('글이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!post) {
    return <div className="error">글을 찾을 수 없습니다.</div>;
  }

  const isAuthor = user && user.uid === post.authorId;

  return (
    <div className="post-view">
      <article className="post">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-author">{post.author}</span>
            <span className="post-date">
              {post.createdAt && format(post.createdAt.toDate?.() || new Date(post.createdAt), 'yyyy년 MM월 dd일 HH:mm')}
            </span>
            {post.category && (
              <span className="post-category">{post.category}</span>
            )}
            <span className="post-views">조회 {post.views || 0}</span>
          </div>
          {isAuthor && (
            <div className="post-actions">
              <Link to={`/write/${id}`} className="btn-edit">
                수정
              </Link>
              <button onClick={handleDelete} className="btn-delete">
                삭제
              </button>
            </div>
          )}
        </header>
        
        <div className="post-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
      
      <div className="back-to-list">
        <Link to="/" className="btn-back">
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default PostView;