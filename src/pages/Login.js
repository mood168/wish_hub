import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
=======
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useSignIn, useUser } from '@clerk/clerk-react';
import { handleClerkSignIn } from '../utils/clerkUtils';

function Login() {
  const navigate = useNavigate();
  const { userService } = useDatabase();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { user, isLoaded: isUserLoaded } = useUser();
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
<<<<<<< HEAD
  // 監聽認證狀態變化
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
=======
  // 檢查用戶是否已登入
  useEffect(() => {
    if (isUserLoaded && user) {
      navigate('/home');
    }
  }, [isUserLoaded, user, navigate]);
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
<<<<<<< HEAD
      await login(email, password);
    } catch (err) {
      console.error('登入錯誤:', err);
      setError(err.message);
=======
      // 模擬登入過程
      // 在實際應用中，這裡應該調用 API 進行身份驗證
      if (email && password) {
        // 登入成功
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        const userName = email.split('@')[0];
        localStorage.setItem('userName', userName);
        
        // 檢查用戶是否存在於資料庫中
        const existingUser = await userService.getUserByEmail(email);
        
        // 如果用戶不存在，則創建新用戶
        if (!existingUser) {
          await userService.saveUser({
            email: email,
            name: userName,
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            joinDate: new Date().toISOString()
          });
        }
        
        navigate('/home');
      } else {
        // 登入失敗
        setError('請輸入有效的電子郵件和密碼');
      }
    } catch (err) {
      console.error('登入時出錯:', err);
      setError('登入時發生錯誤，請稍後再試');
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
    } finally {
      setLoading(false);
    }
  };
  
<<<<<<< HEAD
  const handleGuestLogin = async () => {
=======
  const handleDemoLogin = async () => {
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
    setLoading(true);
    setError('');
    
    try {
<<<<<<< HEAD
      await login(null, null, true);
    } catch (err) {
      console.error('訪客登入錯誤:', err);
      setError(err.message);
=======
      const demoEmail = 'demo@example.com';
      const demoName = 'Demo User';
      
      // 設置本地存儲
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', demoEmail);
      localStorage.setItem('userName', demoName);
      
      // 檢查演示用戶是否存在
      const existingUser = await userService.getUserByEmail(demoEmail);
      
      // 如果演示用戶不存在，則創建
      if (!existingUser) {
        await userService.saveUser({
          email: demoEmail,
          name: demoName,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          bio: '這是一個演示帳戶，用於展示應用功能。',
          joinDate: new Date().toISOString()
        });
      }
      
      navigate('/home');
    } catch (err) {
      console.error('演示登入時出錯:', err);
      setError('登入時發生錯誤，請稍後再試');
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
    } finally {
      setLoading(false);
    }
  };
  
  // 處理 Google 登入
  const handleGoogleLogin = async () => {
    if (!isSignInLoaded) return;
    
    try {
      setLoading(true);
      setError('');
      
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + (window.clerkConfig?.redirectUrl || '/wish_hub'),
        redirectUrlComplete: window.location.origin + (window.clerkConfig?.redirectUrlComplete || '/wish_hub/home')
      });
      
      // 這裡不會執行，因為頁面會重定向
    } catch (err) {
      console.error('Google 登入時出錯:', err);
      setError('Google 登入時發生錯誤，請稍後再試');
      setLoading(false);
    }
  };
  
  // 處理 Facebook 登入
  const handleFacebookLogin = async () => {
    if (!isSignInLoaded) return;
    
    try {
      setLoading(true);
      setError('');
      
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_facebook',
        redirectUrl: window.location.origin + (window.clerkConfig?.redirectUrl || '/wish_hub'),
        redirectUrlComplete: window.location.origin + (window.clerkConfig?.redirectUrlComplete || '/wish_hub/home')
      });
      
      // 這裡不會執行，因為頁面會重定向
    } catch (err) {
      console.error('Facebook 登入時出錯:', err);
      setError('Facebook 登入時發生錯誤，請稍後再試');
      setLoading(false);
    }
  };
  
  // 處理 Clerk 重定向回調
  useEffect(() => {
    async function handleRedirect() {
      if (!isSignInLoaded) return;
      
      // 檢查是否是從 OAuth 重定向回來的
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('__clerk_status')) {
        try {
          console.log('Clerk 狀態:', signIn.status);
          
          if (signIn.status === 'complete') {
            // 獲取用戶資料
            const userData = signIn.userData;
            console.log('用戶資料:', userData);
            
            // 處理登入成功
            const success = await handleClerkSignIn(userData);
            if (success) {
              // 直接使用 window.location 進行重定向，避免 React Router 的問題
              window.location.href = `${window.location.origin}/wish_hub/home`;
            } else {
              setError('登入處理時發生錯誤，請稍後再試');
            }
          } else if (signIn.status === 'needs_first_factor') {
            // 用戶需要完成第一步驗證
            console.log('需要完成第一步驗證');
          } else if (signIn.status === 'needs_second_factor') {
            // 用戶需要完成第二步驗證
            console.log('需要完成第二步驗證');
          } else if (signIn.status === 'needs_identifier') {
            // 用戶需要提供標識符
            console.log('需要提供標識符');
          } else if (signIn.status === 'needs_new_password') {
            // 用戶需要設置新密碼
            console.log('需要設置新密碼');
          }
        } catch (err) {
          console.error('處理 Clerk 重定向時出錯:', err);
          setError('登入處理時發生錯誤，請稍後再試');
        }
      }
    }
    
    handleRedirect();
  }, [isSignInLoaded, signIn, navigate]);
  
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
<<<<<<< HEAD
            disabled={true}
=======
            onClick={handleGoogleLogin}
            disabled={loading || !isSignInLoaded}
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
          >
            <i className="fab fa-google"></i>
            使用 Google 登入
          </button>
          
          <button 
            className="social-login-btn facebook-btn"
<<<<<<< HEAD
            disabled={true}
=======
            onClick={handleFacebookLogin}
            disabled={loading || !isSignInLoaded}
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
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