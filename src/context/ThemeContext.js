import React, { createContext, useContext, useState, useEffect } from 'react';

// 創建主題上下文
const ThemeContext = createContext();

// 自定義鉤子，用於在組件中訪問主題
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme 必須在 ThemeProvider 內部使用');
  }
  return context;
};

// 主題提供者組件
export const ThemeProvider = ({ children }) => {
  // 從 localStorage 獲取保存的主題設定，默認為淺色模式
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true';
  });

  // 切換主題
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // 當主題變化時，更新 localStorage 和 CSS 變數
  useEffect(() => {
    // 保存到 localStorage
    localStorage.setItem('darkMode', darkMode);
    
    // 更新 document 的 class
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // 提供主題狀態和切換函數
  const value = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 