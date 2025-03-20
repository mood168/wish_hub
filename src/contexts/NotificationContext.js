import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { notificationService } = useDatabase();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        try {
          const count = await notificationService.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('獲取未讀通知數量失敗:', error);
        }
      };

      fetchUnreadCount();
      
      // 每分鐘更新一次未讀數量
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, notificationService]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('標記通知已讀失敗:', error);
    }
  };

  const value = {
    unreadCount,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
} 