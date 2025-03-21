import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import '../styles/auth.css';

function Welcome() {
  const navigate = useNavigate();
  const { isLoading } = useDatabase();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // 檢查用戶是否已登入
    const checkLoginStatus = () => {
      // 從 localStorage 中獲取登入狀態
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      // 設置動畫完成
      setTimeout(() => {
        setAnimationComplete(true);
      }, 2000);
      
      // 在動畫完成後導向相應頁面
      setTimeout(() => {
        if (isLoggedIn) {
          // 已登入用戶直接進入首頁
          navigate('/home');
        } else {
          // 未登入用戶進入登入頁
          navigate('/login');
        }
      }, 2500);
    };
    
    // 當資料庫初始化完成後檢查登入狀態
    if (!isLoading) {
      checkLoginStatus();
    }
  }, [navigate, isLoading]);

  return (
    <div className="auth-container">
      <div className={`auth-content ${animationComplete ? 'fade-out' : 'fade-in'}`}>
        <div className="heart-icon">
          <i className="fas fa-heart"></i>
        </div>
        <h1 className="auth-title">Make a Wish</h1>
        <p className="auth-subtitle">寫下願望，我們一起實現</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Welcome; 