import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // 模擬驗證令牌
    const validateToken = () => {
      // 在實際應用中，這裡會向後端發送請求驗證令牌
      setTimeout(() => {
        // 假設令牌有效（在實際應用中，這將基於API響應）
        if (token && token.length > 10) {
          setValidToken(true);
        } else {
          setValidToken(false);
          setError('無效或過期的重置鏈接。請重新請求密碼重置。');
        }
      }, 500);
    };
    
    validateToken();
  }, [token]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 簡單的表單驗證
    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('請填寫所有必填欄位');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('密碼和確認密碼不匹配');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('密碼必須至少包含8個字符');
      return;
    }
    
    // 模擬重置密碼請求
    setLoading(true);
    setError('');
    
    // 模擬API請求延遲
    setTimeout(() => {
      // 模擬重置密碼成功
      console.log('密碼已重置，令牌:', token);
      setLoading(false);
      setSuccess(true);
      
      // 3秒後重定向到登錄頁面
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 1500);
  };
  
  if (!validToken && !success) {
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ 
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '30px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>鏈接無效</h1>
            <p style={{ color: '#636366' }}>您的密碼重置鏈接無效或已過期</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#d32f2f', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p>{error}</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/forgot-password" 
              className="primary-btn" 
              style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                fontSize: '16px',
                textDecoration: 'none'
              }}
            >
              重新請求密碼重置
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ 
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '30px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>重置密碼</h1>
          <p style={{ color: '#636366' }}>
            {!success 
              ? '請創建一個新密碼' 
              : '您的密碼已成功重置'}
          </p>
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#d32f2f', 
            padding: '10px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}
        
        {success ? (
          <div style={{ 
            backgroundColor: '#e8f5e9', 
            color: '#2e7d32', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '15px' }}>
              您的密碼已成功重置！
            </p>
            <p>
              您將在幾秒鐘內被重定向到登錄頁面。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                新密碼
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="輸入新密碼"
                style={{ 
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                確認新密碼
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="再次輸入新密碼"
                style={{ 
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#636366' }}>
                密碼必須至少包含8個字符。
              </p>
            </div>
            
            <button 
              type="submit" 
              className="primary-btn" 
              style={{ 
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                marginBottom: '20px'
              }}
              disabled={loading}
            >
              {loading ? '重置中...' : '重置密碼'}
            </button>
          </form>
        )}
        
        {!success && (
          <div style={{ textAlign: 'center' }}>
            <p>
              <Link to="/login" style={{ color: '#007aff', textDecoration: 'none' }}>
                返回登錄
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword; 