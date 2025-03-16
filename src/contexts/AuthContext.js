import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';

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
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        const isGuest = localStorage.getItem('isGuest') === 'true';
        const storedToken = localStorage.getItem('token');
        
        setUser({
          email: userEmail,
          name: userName,
          isGuest: isGuest
        });
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // 如果沒有登入，清除所有狀態
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, isGuest = false) => {
    try {
      if (isGuest) {
        const guestUser = {
          id: 'guest_' + Date.now(),
          email: 'guest@example.com',
          name: '訪客用戶',
          isGuest: true
        };
        
        const guestToken = 'guest_token_' + Date.now();
        
        // 先設置狀態
        setUser(guestUser);
        setToken(guestToken);
        setIsAuthenticated(true);
        
        // 然後保存到 localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', guestUser.email);
        localStorage.setItem('userName', guestUser.name);
        localStorage.setItem('isGuest', 'true');
        localStorage.setItem('token', guestToken);
        
        return { user: guestUser };
      }

      // 一般用戶登入
      const existingUser = await userService.getUserByEmail(email);
      if (!existingUser) {
        throw new Error('用戶不存在');
      }

      // 這裡應該要有真實的密碼驗證
      // 目前為了測試，我們先略過密碼驗證
      const user = {
        ...existingUser,
        isGuest: false
      };
      
      const userToken = 'user_token_' + Date.now();
      
      // 先設置狀態
      setUser(user);
      setToken(userToken);
      setIsAuthenticated(true);
      
      // 然後保存到 localStorage
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
    // 先清除狀態
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    
    // 然後清除 localStorage
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