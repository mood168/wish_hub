import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';

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
    <div className="welcome-container">
      <div className={`welcome-content ${animationComplete ? 'fade-out' : 'fade-in'}`}>
        <div className="logo-container">
          <div className="logo-icon">
            <i className="fas fa-heart"></i>
          </div>
          <h1 className="app-title">Make a Wish</h1>
        </div>
        <p className="app-slogan">開始寫下你的心願清單</p>
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