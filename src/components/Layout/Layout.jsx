import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import './Layout.css';

function Layout({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>My Blog</h1>
          </Link>
          <nav className="nav">
            <Link to="/">홈</Link>
            {user ? (
              <>
                <Link to="/write">글쓰기</Link>
                <Link to="/admin">관리</Link>
                <button onClick={handleLogout} className="logout-btn">
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/login">로그인</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 My Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;