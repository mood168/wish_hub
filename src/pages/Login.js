import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="login-container">
      <div className="logo-container">
        <div className="logo-icon">
          <i className="fas fa-heart"></i>
        </div>
        <h1 className="app-title" style={{ color: 'var(--primary-color)' }}>Make a Wish</h1>
      </div>
      
      <p className="app-slogan" style={{ color: 'var(--text-secondary)' }}>開始寫下你的心願清單</p>
      
      <div className="login-form-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            className="input-field"
            placeholder="電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            className="input-field"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            className="primary-btn" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
        
        <div className="divider">
          <span>或</span>
        </div>
        
        <div className="social-login">
          <button 
            className="social-login-btn google-btn"
            disabled={true}
          >
            <i className="fab fa-google"></i>
            使用 Google 登入
          </button>
          
          <button 
            className="social-login-btn facebook-btn"
            disabled={true}
          >
            <i className="fab fa-facebook-f"></i>
            使用 Facebook 登入
          </button>
        </div>
        
        <button 
          className="secondary-btn" 
          style={{ width: '100%', marginTop: '20px' }}
          onClick={handleGuestLogin}
          disabled={loading}
        >
          使用訪客身分進入
        </button>
        
        <p className="login-footer">
          還沒有帳戶？ <span className="register-link" onClick={handleRegisterClick} style={{ cursor: 'pointer' }}>註冊</span>
        </p>
      </div>
    </div>
  );
}

export default Login; 