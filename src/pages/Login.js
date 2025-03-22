import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 監聽認證狀態變化
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  // 設置 body 類別
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      console.error('登入錯誤:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await login(null, null, true);
    } catch (err) {
      console.error('訪客登入錯誤:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // 處理註冊點擊
  const handleRegisterClick = () => {
    navigate('/register');
  };
  
  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="heart-icon">
          <i className="fas fa-heart"></i>
        </div>
        <h1 className="auth-title">Make a Wish</h1>
        <p className="auth-subtitle">寫下心願，我們一起實現</p>
        
        {error && (
          <div className="error-message" style={{ color: 'white', marginBottom: '20px', background: 'rgba(255,0,0,0.2)', padding: '10px', borderRadius: '10px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            className="auth-input"
            placeholder="電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            className="auth-input"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
        
        <div className="divider">
          <span>或</span>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '8px',
          marginBottom: '15px'
        }}>
          <button 
            className="social-auth-button google"
            onClick={() => setError('Google 登入功能尚未開放')}
            disabled={loading}
            style={{ height: '36px', fontSize: '14px' }}
          >
            <i className="fab fa-google"></i>
            Google
          </button>
          
          <button 
            className="social-auth-button facebook"
            onClick={() => setError('Facebook 登入功能尚未開放')}
            disabled={loading}
            style={{ height: '36px', fontSize: '14px' }}
          >
            <i className="fab fa-facebook-f"></i>
            Facebook
          </button>
        </div>
        
        <button 
          className="auth-button guest"
          onClick={handleGuestLogin}
          disabled={loading}
          style={{ 
            marginBottom: '15px',
            width: '100%',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          使用訪客身分進入
        </button>
        
        <button 
          className="auth-button register"
          onClick={handleRegisterClick}
          disabled={loading}
          style={{ 
            width: '100%',
            height: '40px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white'
          }}
        >
          沒有帳號？馬上註冊
        </button>
      </div>
    </div>
  );
}

export default Login; 