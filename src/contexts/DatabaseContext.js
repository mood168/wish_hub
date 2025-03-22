import React, { createContext, useContext, useState, useEffect } from 'react';
import db, { userService, stepService, commentService, notificationService, rewardService, wishlistService, initializeDatabase } from '../utils/db';
import WishService from '../services/WishService';

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 初始化 WishService 實例，直接傳入 db 對象
  const wishServiceInstance = new WishService(db);

  useEffect(() => {
    const initDB = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 等待資料庫初始化完成
        await initializeDatabase();
        console.log('資料庫初始化成功');
        
        // 測試一個簡單的數據庫操作以確認連接正常
        try {
          const testData = { title: 'test', description: 'test' };
          console.log('執行測試操作:', testData);
          // 這裡不要真正添加數據，只是測試
          console.log('測試操作成功');
        } catch (testError) {
          console.error('測試操作失敗:', testError);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('資料庫初始化失敗:', error);
        setError('資料庫初始化失敗，請重新整理頁面');
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const value = {
    db,
    wishService: wishServiceInstance, // 使用新創建的 WishService 實例
    userService,
    stepService,
    commentService,
    notificationService,
    rewardService,
    wishlistService,
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