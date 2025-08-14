import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Write.css';

function Write() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      if (id) {
        const docRef = doc(db, 'posts', id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
        alert('글이 수정되었습니다.');
      } else {
        await addDoc(collection(db, 'posts'), {
          ...formData,
          author: user.email,
          authorId: user.uid,
          createdAt: serverTimestamp(),
          views: 0
        });
        alert('글이 작성되었습니다.');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="write">
      <h1>{id ? '글 수정' : '새 글 작성'}</h1>
      <form onSubmit={handleSubmit} className="write-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">카테고리</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="카테고리 (예: 개발, 일상)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요 (마크다운 지원)"
            rows="20"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn-cancel">
            취소
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? '저장 중...' : (id ? '수정' : '작성')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Write;