import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        alert('회원가입이 완료되었습니다.');
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      if (error.code === 'auth/user-not-found') {
        alert('등록되지 않은 이메일입니다.');
      } else if (error.code === 'auth/wrong-password') {
        alert('비밀번호가 올바르지 않습니다.');
      } else if (error.code === 'auth/email-already-in-use') {
        alert('이미 사용 중인 이메일입니다.');
      } else if (error.code === 'auth/weak-password') {
        alert('비밀번호는 6자 이상이어야 합니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>{isSignUp ? '회원가입' : '로그인'}</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? '처리 중...' : (isSignUp ? '회원가입' : '로그인')}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="toggle-btn"
            >
              {isSignUp ? '로그인' : '회원가입'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;