import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import PostList from '../components/PostList/PostList';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'), limit(20));
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

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to My Blog</h1>
        <p>프로그래밍, 기술, 그리고 일상에 대한 이야기</p>
      </div>
      
      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}

export default Home;