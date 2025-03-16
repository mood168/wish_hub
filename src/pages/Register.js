import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';

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
    
    // 基本驗證
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
      const users = await userService.getUsers();
      const existingUser = users.find(user => user.email === formData.email);
      if (existingUser) {
        throw new Error('該郵箱已被註冊');
      }
      
      // 創建新用戶
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
      
      // 保存用戶到數據庫
      await userService.createUser(newUser);
      
      // 自動登入新用戶
      await login(formData.email, formData.password);
      
      // 設置新用戶標記
      localStorage.setItem('isNewUser', 'true');
      
      // 導航到引導頁面
      navigate('/onboarding');
      
    } catch (err) {
      console.error('註冊錯誤:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // 處理 Google 註冊
  const handleGoogleSignUp = () => {
    setError('Google 登入功能尚未開放');
  };
  
  // 處理 Facebook 註冊
  const handleFacebookSignUp = () => {
    setError('Facebook 登入功能尚未開放');
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <div className="login-container">
      <div className="logo-container">
        <div className="logo-icon">
          <i className="fas fa-heart"></i>
        </div>
        <h1 className="app-title" style={{ color: 'var(--primary-color)' }}>Make a Wish</h1>
      </div>
      
      <p className="app-slogan" style={{ color: 'var(--text-secondary)' }}>創建帳戶，開始追蹤您的願望</p>
      
      <div className="login-form-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="name"
            className="input-field"
            placeholder="姓名"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <input
            type="email"
            name="email"
            className="input-field"
            placeholder="電子郵件"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="密碼"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="confirmPassword"
            className="input-field"
            placeholder="確認密碼"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <span>
                我同意 <Link to="/terms" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>服務條款</Link> 和 
                <Link to="/privacy" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}> 隱私政策</Link>
              </span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="primary-btn" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? '註冊中...' : '註冊'}
          </button>
        </form>
        
        <div className="divider">
          <span>或</span>
        </div>
        
        <div className="social-login">
          <button 
            className="social-login-btn google-btn"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <i className="fab fa-google"></i>
            使用 Google 註冊
          </button>
          
          <button 
            className="social-login-btn facebook-btn"
            onClick={handleFacebookSignUp}
            disabled={loading}
          >
            <i className="fab fa-facebook-f"></i>
            使用 Facebook 註冊
          </button>
        </div>
        
        <p className="login-footer">
          已有帳戶？ <span className="register-link" onClick={handleLoginClick} style={{ cursor: 'pointer' }}>登入</span>
        </p>
      </div>
    </div>
  );
}

export default Register; 