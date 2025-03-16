import { userService } from './db';

// 處理 Clerk 登入成功後的操作
export const handleClerkSignIn = async (userData) => {
  try {
    // 從 Clerk 獲取用戶資料
    const email = userData.emailAddresses[0]?.emailAddress;
    const firstName = userData.firstName || '';
    const lastName = userData.lastName || '';
    const name = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || email.split('@')[0]);
    const imageUrl = userData.imageUrl;
    
    // 設置登入狀態
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    
    // 檢查用戶是否存在於資料庫中
    const existingUser = await userService.getUserByEmail(email);
    
    // 如果用戶不存在，則創建新用戶
    if (!existingUser) {
      await userService.saveUser({
        email: email,
        name: name,
        avatar: imageUrl || 'https://randomuser.me/api/portraits/men/1.jpg',
        joinDate: new Date().toISOString()
      });
    }
    
    return true;
  } catch (error) {
    console.error('處理 Clerk 登入時出錯:', error);
    return false;
  }
};

// 處理 Clerk 註冊成功後的操作
export const handleClerkSignUp = async (userData) => {
  try {
    // 從 Clerk 獲取用戶資料
    const email = userData.emailAddresses[0]?.emailAddress;
    const firstName = userData.firstName || '';
    const lastName = userData.lastName || '';
    const name = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || email.split('@')[0]);
    const imageUrl = userData.imageUrl;
    
    // 設置登入狀態
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    
    // 創建新用戶
    await userService.saveUser({
      email: email,
      name: name,
      avatar: imageUrl || 'https://randomuser.me/api/portraits/men/1.jpg',
      joinDate: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('處理 Clerk 註冊時出錯:', error);
    return false;
  }
}; 