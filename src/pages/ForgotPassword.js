import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 簡單的表單驗證
    if (!email.trim()) {
      setError('請輸入您的電子郵件地址');
      return;
    }
    
    // 模擬重置密碼請求
    setLoading(true);
    setError('');
    
    // 模擬API請求延遲
    setTimeout(() => {
      // 模擬重置密碼郵件發送成功
      console.log('重置密碼郵件發送至:', email);
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };
  
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
              ? '我們將向您發送重置密碼的鏈接' 
              : '重置鏈接已發送至您的郵箱'}
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
              我們已向 <strong>{email}</strong> 發送了一封包含重置密碼鏈接的電子郵件。
            </p>
            <p style={{ marginBottom: '15px' }}>
              請檢查您的收件箱並點擊郵件中的鏈接來重置您的密碼。
            </p>
            <p>
              如果您沒有收到郵件，請檢查您的垃圾郵件文件夾或
              <button 
                onClick={handleSubmit} 
                style={{ 
                  background: 'none',
                  border: 'none',
                  color: '#007aff',
                  cursor: 'pointer',
                  padding: '0',
                  textDecoration: 'underline',
                  fontSize: 'inherit'
                }}
                disabled={loading}
              >
                重新發送郵件
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                電子郵件
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="輸入您的電子郵件"
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
              {loading ? '發送中...' : '發送重置鏈接'}
            </button>
          </form>
        )}
        
        <div style={{ textAlign: 'center' }}>
          <p>
            <Link to="/login" style={{ color: '#007aff', textDecoration: 'none' }}>
              返回登錄
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword; 