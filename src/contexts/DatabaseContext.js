import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishService, userService } from '../utils/db';

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 等待資料庫初始化完成
        await wishService.getWishes(1);
        
        setIsLoading(false);
      } catch (error) {
        console.error('資料庫初始化失敗:', error);
        setError('資料庫初始化失敗，請重新整理頁面');
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const value = {
    wishService,
    userService,
    isLoading,
    error
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase 必須在 DatabaseProvider 內使用');
  }
  return context;
} 