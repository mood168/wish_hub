import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useSignUp, useUser } from '@clerk/clerk-react';
import { handleClerkSignUp } from '../utils/clerkUtils';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { userService } = useDatabase();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { user, isLoaded: isUserLoaded } = useUser();
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
  
  // 檢查用戶是否已登入
  useEffect(() => {
    if (isUserLoaded && user) {
      navigate('/home');
    }
  }, [isUserLoaded, user, navigate]);
  
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
      const existingUser = await userService.getUserByEmail(formData.email);
      if (existingUser) {
        throw new Error('該郵箱已被註冊');
      }
      
      // 創建新用戶
      const newUser = {
        email: formData.email,
        name: formData.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      
      setLoading(false);
      
      // 導航到引導頁面
      navigate('/onboarding');
      
    } catch (err) {
      console.error('註冊錯誤:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  // 處理 Google 註冊
  const handleGoogleSignUp = async () => {
    if (!isSignUpLoaded) return;
    
    try {
      setLoading(true);
      setError('');
      
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + (window.clerkConfig?.redirectUrl || '/wish_hub'),
        redirectUrlComplete: window.location.origin + (window.clerkConfig?.redirectUrlComplete || '/wish_hub/home')
      });
      
      // 這裡不會執行，因為頁面會重定向
    } catch (err) {
      console.error('Google 註冊時出錯:', err);
      setError('Google 註冊時發生錯誤，請稍後再試');
      setLoading(false);
    }
  };
  
  // 處理 Facebook 註冊
  const handleFacebookSignUp = async () => {
    if (!isSignUpLoaded) return;
    
    try {
      setLoading(true);
      setError('');
      
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_facebook',
        redirectUrl: window.location.origin + (window.clerkConfig?.redirectUrl || '/wish_hub'),
        redirectUrlComplete: window.location.origin + (window.clerkConfig?.redirectUrlComplete || '/wish_hub/home')
      });
      
      // 這裡不會執行，因為頁面會重定向
    } catch (err) {
      console.error('Facebook 註冊時出錯:', err);
      setError('Facebook 註冊時發生錯誤，請稍後再試');
      setLoading(false);
    }
  };
  
  // 處理 Clerk 重定向回調
  useEffect(() => {
    async function handleRedirect() {
      if (!isSignUpLoaded) return;
      
      // 檢查是否是從 OAuth 重定向回來的
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('__clerk_status')) {
        try {
          console.log('Clerk 狀態:', signUp.status);
          
          if (signUp.status === 'complete') {
            // 獲取用戶資料
            const userData = signUp.userData;
            console.log('用戶資料:', userData);
            
            // 處理註冊成功
            const success = await handleClerkSignUp(userData);
            if (success) {
              // 直接使用 window.location 進行重定向，避免 React Router 的問題
              window.location.href = `${window.location.origin}/wish_hub/home`;
            } else {
              setError('註冊處理時發生錯誤，請稍後再試');
            }
          } else if (signUp.status === 'needs_first_factor') {
            // 用戶需要完成第一步驗證
            console.log('需要完成第一步驗證');
          } else if (signUp.status === 'needs_second_factor') {
            // 用戶需要完成第二步驗證
            console.log('需要完成第二步驗證');
          } else if (signUp.status === 'needs_identifier') {
            // 用戶需要提供標識符
            console.log('需要提供標識符');
          } else if (signUp.status === 'needs_new_password') {
            // 用戶需要設置新密碼
            console.log('需要設置新密碼');
          }
        } catch (err) {
          console.error('處理 Clerk 重定向時出錯:', err);
          setError('註冊處理時發生錯誤，請稍後再試');
        }
      }
    }
    
    handleRedirect();
  }, [isSignUpLoaded, signUp, navigate]);
  
  const handleDemoSignup = () => {
    // 模擬演示註冊
    setLoading(true);
    
    // 模擬API請求延遲
    setTimeout(() => {
      // 設置登入狀態
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', 'demo@example.com');
      localStorage.setItem('userName', 'Demo User');
      
      setLoading(false);
      
      // 導航到引導頁面
      navigate('/onboarding');
    }, 1000);
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
          />
          
          <input
            type="email"
            name="email"
            className="input-field"
            placeholder="電子郵件"
            value={formData.email}
            onChange={handleChange}
          />
          
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="密碼"
            value={formData.password}
            onChange={handleChange}
          />
          
          <input
            type="password"
            name="confirmPassword"
            className="input-field"
            placeholder="確認密碼"
            value={formData.confirmPassword}
            onChange={handleChange}
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
            disabled={loading || !isSignUpLoaded}
          >
            <i className="fab fa-google"></i>
            使用 Google 註冊
          </button>
          
          <button 
            className="social-login-btn facebook-btn"
            onClick={handleFacebookSignUp}
            disabled={loading || !isSignUpLoaded}
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