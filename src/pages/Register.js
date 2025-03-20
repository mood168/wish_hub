import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

function Register() {
  const navigate = useNavigate();
  const { userService } = useDatabase();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('密碼不匹配');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('密碼長度必須至少為 6 個字符');
      return;
    }
    
    if (!agreeTerms) {
      setError('請同意服務條款和隱私政策');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 檢查郵箱是否已存在
      const existingUser = await userService.getUserByEmail(formData.email);
      if (existingUser) {
        throw new Error('該郵箱已被註冊');
      }
      
      const newUser = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        settings: {
          theme: 'light',
          notifications: true,
          language: 'zh-TW'
        }
      };
      
      await userService.saveUser(newUser);
      await login(formData.email, formData.password);
      localStorage.setItem('isNewUser', 'true');
      navigate('/onboarding');
      
    } catch (err) {
      console.error('註冊錯誤:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoginClick = () => {
    navigate('/login');
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
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            className="auth-input"
            placeholder="暱稱"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="電子郵件"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="密碼"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="confirmPassword"
            className="auth-input"
            placeholder="確認密碼"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '8px',
            marginTop: '5px',
            marginBottom: '10px'
          }}>
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ margin: 0 }}
            />
            <label 
              htmlFor="agreeTerms" 
              style={{ 
                fontSize: '13px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              我同意服務條款和隱私政策
            </label>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '註冊中...' : '註冊'}
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
            onClick={() => setError('Google 註冊功能尚未開放')}
            disabled={loading}
            style={{ height: '36px', fontSize: '14px' }}
          >
            <i className="fab fa-google"></i>
            Google
          </button>
          
          <button 
            className="social-auth-button facebook"
            onClick={() => setError('Facebook 註冊功能尚未開放')}
            disabled={loading}
            style={{ height: '36px', fontSize: '14px' }}
          >
            <i className="fab fa-facebook-f"></i>
            Facebook
          </button>

          <button 
            className="social-auth-button line"
            onClick={() => setError('Line 註冊功能尚未開放')}
            disabled={loading}
            style={{ height: '36px', fontSize: '14px' }}
          >
            <i className="fab fa-line"></i>
            Line
          </button>

          <button 
            className="social-auth-button apple"
            onClick={() => setError('Apple 註冊功能尚未開放')}
            disabled={loading}
            style={{ height: '36px', fontSize: '14px' }}
          >
            <i className="fab fa-apple"></i>
            Apple
          </button>
        </div>
        
        <button 
          className="auth-button register"
          onClick={handleLoginClick}
          disabled={loading}
          style={{ 
            width: '100%',
            height: '40px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white'
          }}
        >
          已有帳號？立即登入
        </button>
      </div>
    </div>
  );
}

export default Register; 