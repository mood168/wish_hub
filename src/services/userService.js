import db from '../utils/db';

export const userService = {
  // 獲取所有用戶
  getUsers: async () => {
    return await db.users.toArray();
  },

  // 根據郵箱獲取用戶
  getUserByEmail: async (email) => {
    const user = await db.users.where('email').equals(email).first();
    if (!user) {
      throw new Error('用戶不存在');
    }
    return user;
  },

  // 創建新用戶
  createUser: async (userData) => {
    // 檢查郵箱是否已存在
    const existingUser = await db.users.where('email').equals(userData.email).first();
    if (existingUser) {
      throw new Error('該郵箱已被註冊');
    }
    
    // 創建新用戶對象
    const newUser = {
      email: userData.email,
      name: userData.name || userData.email.split('@')[0], // 如果沒有提供名稱，使用郵箱前綴
      username: userData.username || userData.email.split('@')[0], // 用戶名
      password: userData.password, // 注意：實際應用中應該加密密碼
      avatar: userData.avatar || null, // 頭像
      settings: userData.settings || {
        theme: 'light',
        notifications: true,
        language: 'zh-TW'
      },
      joinDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 添加到資料庫
    const id = await db.users.add(newUser);
    
    // 返回新用戶（不包含密碼）
    const { password, ...userWithoutPassword } = await db.users.get(id);
    return userWithoutPassword;
  },

  // 更新用戶信息
  updateUser: async (userId, userData) => {
    const user = await db.users.get(userId);
    if (!user) {
      throw new Error('用戶不存在');
    }
    
    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    await db.users.update(userId, updatedUser);
    return await db.users.get(userId);
  },

  // 刪除用戶
  deleteUser: async (userId) => {
    await db.users.delete(userId);
  }
}; 