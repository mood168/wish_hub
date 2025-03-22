import React, { createContext, useContext, useEffect, useState } from 'react';
import db, { 
  initializeDatabase, 
  userService, 
  wishService, 
  stepService, 
  wishlistService, 
  commentService, 
  notificationService, 
  rewardService 
} from '../utils/db';
import { userService as userServiceFromServices } from '../services/userService';

// 創建上下文
const DatabaseContext = createContext();

// 自定義鉤子，用於在組件中訪問資料庫服務
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase 必須在 DatabaseProvider 內部使用');
  }
  return context;
};

// 資料庫提供者組件
export const DatabaseProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化資料庫
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await initializeDatabase();
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error('初始化資料庫時出錯:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // 提供所有資料庫服務
  const value = {
    db,
    isInitialized,
    isLoading,
    error,
    userService: userServiceFromServices,
    wishService,
    stepService,
    wishlistService,
    commentService,
    notificationService,
    rewardService
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext; 