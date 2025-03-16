import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內部使用');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const { userService } = useDatabase();

  // 初始化時檢查登入狀態
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const isGuest = localStorage.getItem('isGuest') === 'true';
      
      if (isLoggedIn) {
        if (isGuest) {
          // 訪客用戶從 localStorage 讀取
          const userEmail = localStorage.getItem('userEmail');
          const userName = localStorage.getItem('userName');
          const storedToken = localStorage.getItem('token');
          
          setUser({
            email: userEmail,
            name: userName || '訪客用戶',
            isGuest: true
          });
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // 一般用戶從資料庫讀取
          try {
            const userEmail = localStorage.getItem('userEmail');
            const dbUser = await userService.getUserByEmail(userEmail);
            if (dbUser) {
              const { password, ...userWithoutPassword } = dbUser;
              setUser({
                ...userWithoutPassword,
                name: dbUser.name || dbUser.email.split('@')[0],
                isGuest: false
              });
              setToken(localStorage.getItem('token'));
              setIsAuthenticated(true);
            } else {
              // 如果用戶不存在，清除登入狀態
              logout();
            }
          } catch (error) {
            console.error('讀取用戶資料失敗:', error);
            logout();
          }
        }
      } else {
        // 如果沒有登入，清除所有狀態
        logout();
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, isGuest = false) => {
    try {
      if (isGuest) {
        // 訪客登入使用 localStorage
        const guestUser = {
          id: 'guest_' + Date.now(),
          email: 'guest@example.com',
          name: '訪客用戶',
          isGuest: true
        };
        
        const guestToken = 'guest_token_' + Date.now();
        
        setUser(guestUser);
        setToken(guestToken);
        setIsAuthenticated(true);
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', guestUser.email);
        localStorage.setItem('userName', guestUser.name);
        localStorage.setItem('isGuest', 'true');
        localStorage.setItem('token', guestToken);
        
        return { user: guestUser };
      }

      // 一般用戶登入使用資料庫
      const dbUser = await userService.getUserByEmail(email);
      
      // 驗證密碼
      if (dbUser.password !== password) {
        throw new Error('密碼錯誤');
      }

      const { password: _, ...userWithoutPassword } = dbUser;
      const user = {
        ...userWithoutPassword,
        name: dbUser.name || email.split('@')[0],
        isGuest: false
      };
      
      const userToken = 'user_token_' + Date.now();
      
      setUser(user);
      setToken(userToken);
      setIsAuthenticated(true);
      
      // 只保存必要的登入狀態到 localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('isGuest', 'false');
      localStorage.setItem('token', userToken);
      
      return { user };
    } catch (error) {
      console.error('登入失敗:', error);
      throw new Error(error.message || '登入失敗，請檢查您的電子郵件和密碼');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 