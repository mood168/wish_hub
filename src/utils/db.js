import Dexie from 'dexie';

// 創建 Dexie 資料庫實例
const db = new Dexie('wishHubDB');

// 定義資料庫結構
db.version(2).stores({
  users: '++id, email, username, name, password, avatar, bio, joinDate, location, website, settings',
  wishes: '++id, userId, title, description, category, visibility, createdAt, dueDate, status, priority, progress, *tags',
  steps: '++id, wishId, title, description, completed, dueDate, order',
  wishlists: '++id, userId, name, icon, createdAt',
  wishlistItems: '++id, wishlistId, wishId',
  comments: '++id, targetId, targetType, userId, content, createdAt, likes',
  notifications: '++id, userId, type, read, timestamp, content, targetId, targetType, targetTitle, senderId',
  badges: '++id, userId, name, icon, description, earnedAt',
  points: '++id, userId, amount, reason, timestamp',
  rewards: '++id, name, description, icon, cost, available'
});

// 用戶相關操作
export const userService = {
  // 獲取用戶資料
  async getUser(id) {
    return await db.users.get(id);
  },
  
  // 通過電子郵件獲取用戶
  async getUserByEmail(email) {
    return await db.users.where('email').equals(email).first();
  },
  
  // 創建或更新用戶
  async saveUser(user) {
    if (user.id) {
      await db.users.update(user.id, user);
      return user.id;
    } else {
      return await db.users.add({
        ...user,
        joinDate: new Date().toISOString()
      });
    }
  },
  
  // 更新用戶資料
  async updateUser(id, changes) {
    await db.users.update(id, changes);
    return await db.users.get(id);
  },

  // 獲取用戶朋友列表
  async getUserFriends(userId) {
    try {
      // 獲取用戶資料
      const user = await db.users.get(String(userId));
      if (!user) {
        console.log('獲取朋友列表失敗: 用戶不存在');
        return [];
      }
      
      // 如果用戶沒有朋友列表，返回空數組
      if (!user.friends || !Array.isArray(user.friends)) {
        return [];
      }
      
      // 獲取所有朋友的詳細資料
      const friendIds = user.friends.map(friendId => String(friendId));
      const friends = await db.users.where('id').anyOf(friendIds).toArray();
      
      // 移除敏感資訊
      return friends.map(friend => {
        const { password, ...friendData } = friend;
        return friendData;
      });
    } catch (error) {
      console.error('獲取朋友列表失敗:', error);
      return [];
    }
  },

  // 添加朋友
  async addFriend(userId, friendId) {
    try {
      // 確保 ID 是字串類型
      userId = String(userId);
      friendId = String(friendId);
      
      // 不能添加自己為朋友
      if (userId === friendId) {
        throw new Error('不能添加自己為朋友');
      }
      
      // 獲取用戶資料
      const user = await db.users.get(userId);
      const friend = await db.users.get(friendId);
      
      if (!user) {
        throw new Error('用戶不存在');
      }
      
      if (!friend) {
        throw new Error('要添加的朋友不存在');
      }
      
      // 確保用戶有朋友列表
      if (!user.friends || !Array.isArray(user.friends)) {
        user.friends = [];
      }
      
      // 檢查是否已經是朋友
      if (user.friends.includes(friendId)) {
        return { success: true, message: '已經是朋友了' };
      }
      
      // 添加朋友關係
      user.friends.push(friendId);
      
      // 更新用戶資料
      await db.users.update(userId, { friends: user.friends });
      
      // 互相添加朋友關係 (雙向好友)
      if (!friend.friends || !Array.isArray(friend.friends)) {
        friend.friends = [];
      }
      
      if (!friend.friends.includes(userId)) {
        friend.friends.push(userId);
        await db.users.update(friendId, { friends: friend.friends });
      }
      
      return { success: true, message: '添加朋友成功' };
    } catch (error) {
      console.error('添加朋友失敗:', error);
      return { success: false, message: error.message || '添加朋友失敗' };
    }
  },
  
  // 移除朋友
  async removeFriend(userId, friendId) {
    try {
      // 確保 ID 是字串類型
      userId = String(userId);
      friendId = String(friendId);
      
      // 獲取用戶資料
      const user = await db.users.get(userId);
      const friend = await db.users.get(friendId);
      
      if (!user) {
        throw new Error('用戶不存在');
      }
      
      // 確保用戶有朋友列表
      if (!user.friends || !Array.isArray(user.friends)) {
        return { success: true, message: '用戶沒有朋友' };
      }
      
      // 檢查是否是朋友
      if (!user.friends.includes(friendId)) {
        return { success: true, message: '他們不是朋友' };
      }
      
      // 移除朋友關係
      user.friends = user.friends.filter(id => id !== friendId);
      
      // 更新用戶資料
      await db.users.update(userId, { friends: user.friends });
      
      // 互相移除朋友關係 (如果對方存在)
      if (friend && friend.friends && Array.isArray(friend.friends)) {
        friend.friends = friend.friends.filter(id => id !== userId);
        await db.users.update(friendId, { friends: friend.friends });
      }
      
      return { success: true, message: '移除朋友成功' };
    } catch (error) {
      console.error('移除朋友失敗:', error);
      return { success: false, message: error.message || '移除朋友失敗' };
    }
  },
  
  // 檢查朋友關係
  async checkFriendship(userId, otherUserId) {
    try {
      // 確保 ID 是字串類型
      userId = String(userId);
      otherUserId = String(otherUserId);
      
      // 獲取用戶資料
      const user = await db.users.get(userId);
      
      if (!user) {
        return { isFriend: false, error: '用戶不存在' };
      }
      
      // 檢查朋友列表
      if (!user.friends || !Array.isArray(user.friends)) {
        return { isFriend: false };
      }
      
      // 返回朋友關係狀態
      return { isFriend: user.friends.includes(otherUserId) };
    } catch (error) {
      console.error('檢查朋友關係失敗:', error);
      return { isFriend: false, error: error.message || '檢查朋友關係失敗' };
    }
  },

  // 檢查願望訪問權限
  async checkWishAccessPermission(wishId, userId) {
    try {
      // 如果沒有用戶 ID，表示未登入，只能查看公開願望
      if (!userId) {
        const wish = await db.wishes.get(String(wishId));
        return wish && wish.visibility === 'public';
      }
      
      // 確保 ID 是字串類型
      wishId = String(wishId);
      userId = String(userId);
      
      // 獲取願望資料
      const wish = await db.wishes.get(wishId);
      
      if (!wish) {
        return false; // 願望不存在
      }
      
      // 如果是創建者，直接授權訪問
      if (String(wish.userId) === userId) {
        return true;
      }
      
      // 根據隱私設定檢查訪問權限
      switch (wish.visibility) {
        case 'public':
          return true; // 公開願望，任何人都可以訪問
          
        case 'friends':
          // 檢查朋友關係
          const friendshipCheck = await this.checkFriendship(wish.userId, userId);
          return friendshipCheck.isFriend;
          
        case 'private':
          return false; // 私人願望，只有創建者可以訪問
          
        default:
          return false; // 未知的隱私設定，默認拒絕訪問
      }
    } catch (error) {
      console.error('檢查願望訪問權限失敗:', error);
      return false;
    }
  }
};

// 願望相關操作
export const wishService = {
  // 獲取願望列表
  async getWishes(userId, filter = {}) {
    let query = db.wishes.where('userId').equals(userId);
    
    // 應用過濾條件
    if (filter.status) {
      query = query.and(wish => wish.status === filter.status);
    }
    if (filter.category) {
      query = query.and(wish => wish.category === filter.category);
    }
    if (filter.priority) {
      query = query.and(wish => wish.priority === filter.priority);
    }
    
    // 應用排序
    const wishes = await query.toArray();
    
    // 根據不同條件排序
    if (filter.sortBy === 'dueDate') {
      wishes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (filter.sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      wishes.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (filter.sortBy === 'progress') {
      wishes.sort((a, b) => b.progress - a.progress);
    } else {
      // 默認按創建時間排序
      wishes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return wishes;
  },
  
  // 獲取單個願望
  async getWish(id) {
    console.log('db.js getWish 被調用，原始 id:', id, '類型:', typeof id);
    
    // 確保 id 是字符串類型
    let wishId = String(id);
    console.log('轉換後的 wishId:', wishId, '類型:', typeof wishId);
    
    try {
      const wish = await db.wishes.get(wishId);
      console.log('查詢結果:', wish ? '找到願望' : '未找到願望');
      return wish;
    } catch (error) {
      console.error('在 db.js 中獲取願望時出錯:', error);
      console.error('錯誤詳情:', error.message);
      console.error('錯誤堆棧:', error.stack);
      throw error; // 重新拋出錯誤以供上層處理
    }
  },
  
  // 創建願望
  async createWish(wishData) {
    console.log('createWish 被調用，參數:', wishData);
    try {
      if (!wishData) {
        console.error('創建願望失敗: 願望數據為空');
        return null;
      }
      
      // 確保必要字段存在並有預設值
      const wish = {
        ...wishData,
        id: wishData.id || `wish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: String(wishData.userId || ''),
        createdAt: wishData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: wishData.progress || 0,
        comments: wishData.comments || [],
        steps: Array.isArray(wishData.steps) ? wishData.steps : [],
        dailyGoals: Array.isArray(wishData.dailyGoals) ? wishData.dailyGoals : [],
        weeklyGoals: Array.isArray(wishData.weeklyGoals) ? wishData.weeklyGoals : [],
        progressByDate: wishData.progressByDate || {},
        dailyProgress: wishData.dailyProgress || {},
        weeklyProgress: wishData.weeklyProgress || {},
        progressLog: wishData.progressLog || []
      };
      
      console.log('準備添加到數據庫的願望:', wish);
      
      // 使用數據庫添加願望
      const id = await db.wishes.add(wish);
      console.log('願望已添加，ID:', id);
      
      // 獲取剛添加的願望
      const savedWish = await db.wishes.get(id);
      console.log('已保存的願望:', savedWish);
      
      return savedWish;
    } catch (error) {
      console.error('創建願望時出錯:', error);
      return null;
    }
  },
  
  // 更新願望
  async updateWish(id, changes) {
    console.log('更新願望請求:', { id, changes });
    
    try {
      const db = await this.getDB();
      const tx = db.transaction('wishes', 'readwrite');
      const store = tx.objectStore('wishes');
      
      // 先獲取現有的願望
      const wish = await store.get(id);
      
      if (!wish) {
        console.error('找不到要更新的願望:', id);
        return null;
      }
      
      // 處理各種特殊字段
      const updatedWish = { ...wish };
      
      // 更新基本字段
      for (const key in changes) {
        if (changes.hasOwnProperty(key)) {
          updatedWish[key] = changes[key];
        }
      }
      
      // 刪除對 tasks 的特殊處理邏輯
      
      // 更新時間戳
      updatedWish.updatedAt = new Date().toISOString();
      
      // 保存更新後的願望
      await store.put(updatedWish);
      await tx.done;
      
      console.log('願望更新成功:', updatedWish);
      return updatedWish;
    } catch (error) {
      console.error('更新願望出錯:', error);
      return null;
    }
  },
  
  // 刪除願望
  async deleteWish(id) {
    // 刪除相關步驟
    await db.steps.where('wishId').equals(id).delete();
    // 刪除願望
    await db.wishes.delete(id);
  },
  
  // 更新願望進度
  async updateProgress(id, progress) {
    await db.wishes.update(id, { progress });
    return await db.wishes.get(id);
  },
  
  // 獲取公開願望（用於社群頁面）
  async getPublicWishes(filter = {}) {
    let query = db.wishes.where('visibility').equals('public');
    
    // 應用過濾條件
    if (filter.category) {
      query = query.and(wish => wish.category === filter.category);
    }
    
    const wishes = await query.toArray();
    
    // 根據不同條件排序
    if (filter.sortBy === 'trending') {
      // 這裡可以實現更複雜的趨勢算法
      wishes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (filter.sortBy === 'latest') {
      wishes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return wishes;
  },
  
  // 搜索願望
  async searchWishes(searchTerm) {
    const term = searchTerm.toLowerCase();
    const wishes = await db.wishes.toArray();
    return wishes.filter(wish => 
      wish.title.toLowerCase().includes(term) || 
      wish.description.toLowerCase().includes(term) ||
      (wish.tags && wish.tags.some(tag => tag.toLowerCase().includes(term)))
    );
  },
  
  // 更新願望進度數據
  async updateWishProgress(wishId, progressData) {
    console.log('updateWishProgress called with:', { wishId, progressData });
    try {
      // 確保 wishId 是字串
      const wishIdStr = String(wishId);
    
      // 獲取現有的願望資料
      const wish = await db.wishes.get(wishIdStr);
    if (!wish) {
        console.log('Wish not found in updateWishProgress');
      return null;
    }
    
      // 準備更新的資料，開始時使用現有的資料
      const updateData = {
        dailyProgress: wish.dailyProgress || {},
        weeklyProgress: wish.weeklyProgress || {},
        progressByDate: wish.progressByDate || {},
      updatedAt: new Date().toISOString()
    };
    
      // 處理 dailyProgress (如果有提供)
      if (progressData.dailyProgress !== undefined) {
        const normalizedDailyProgress = {};
        // 過濾掉 undefined 和 null 值
        Object.entries(progressData.dailyProgress).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            normalizedDailyProgress[String(key)] = value;
          }
        });
        updateData.dailyProgress = normalizedDailyProgress;
      }
      
      // 處理 weeklyProgress (如果有提供)
      if (progressData.weeklyProgress !== undefined) {
        const normalizedWeeklyProgress = {};
        // 過濾掉 undefined 和 null 值
        Object.entries(progressData.weeklyProgress).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            normalizedWeeklyProgress[String(key)] = value;
          }
        });
        updateData.weeklyProgress = normalizedWeeklyProgress;
      }
      
      // 處理 progressByDate (如果有提供)
      if (progressData.progressByDate !== undefined) {
        const normalizedProgressByDate = {};
        
        Object.entries(progressData.progressByDate).forEach(([date, dateProgress]) => {
          // 確保 dateProgress 不是 null 或 undefined
          if (dateProgress !== null && dateProgress !== undefined) {
            normalizedProgressByDate[date] = {
              daily: {},
              weekly: {}
            };
            
            // 處理每日進度
            if (dateProgress.daily) {
              Object.entries(dateProgress.daily).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  normalizedProgressByDate[date].daily[String(key)] = value;
                }
              });
            }
            
            // 處理每週進度
            if (dateProgress.weekly) {
              Object.entries(dateProgress.weekly).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  normalizedProgressByDate[date].weekly[String(key)] = value;
                }
              });
            }
          }
        });
        
        updateData.progressByDate = normalizedProgressByDate;
      }
      
      // 只保留非 undefined 的值
      const finalUpdateData = {};
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          finalUpdateData[key] = value;
        }
      });
      
      console.log('最終更新資料庫的資料:', finalUpdateData);
      
      // 更新數據庫
      await db.wishes.update(wishIdStr, finalUpdateData);
      
      // 獲取更新後的願望資料
      const updatedWish = await db.wishes.get(wishIdStr);
    console.log('Wish progress updated:', updatedWish);
    
    return updatedWish;
    } catch (error) {
      console.error('Error in updateWishProgress:', error);
      return null;
    }
  },
  
  // 獲取願望的進度數據
  async getWishProgress(wishId) {
    console.log('getWishProgress called with:', wishId);
    try {
      const wishIdStr = String(wishId);
      console.log('正在使用字串 ID 獲取願望:', wishIdStr);
      
      const wish = await db.wishes.get(wishIdStr);
    
    if (!wish) {
        console.log('Wish not found in getWishProgress');
        // 返回完整的空結構
        return {
          dailyProgress: {},
          weeklyProgress: {},
          progressByDate: {}
        };
      }
      
      // 確保索引都是字串類型，並且過濾掉 null 和 undefined 值
      const normalizedDailyProgress = {};
      const normalizedWeeklyProgress = {};
      const normalizedProgressByDate = {};
      
      // 處理 dailyProgress
      if (wish.dailyProgress && typeof wish.dailyProgress === 'object') {
        Object.entries(wish.dailyProgress).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            normalizedDailyProgress[String(key)] = value;
          }
        });
      }
      
      // 處理 weeklyProgress
      if (wish.weeklyProgress && typeof wish.weeklyProgress === 'object') {
        Object.entries(wish.weeklyProgress).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            normalizedWeeklyProgress[String(key)] = value;
          }
        });
      }
      
      // 處理 progressByDate
      if (wish.progressByDate && typeof wish.progressByDate === 'object') {
        Object.entries(wish.progressByDate).forEach(([date, dateProgress]) => {
          if (dateProgress && typeof dateProgress === 'object') {
            normalizedProgressByDate[date] = {
              daily: {},
              weekly: {}
            };
            
            // 處理每日進度
            if (dateProgress.daily && typeof dateProgress.daily === 'object') {
              Object.entries(dateProgress.daily).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  normalizedProgressByDate[date].daily[String(key)] = value;
                }
              });
            }
            
            // 處理每週進度
            if (dateProgress.weekly && typeof dateProgress.weekly === 'object') {
              Object.entries(dateProgress.weekly).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  normalizedProgressByDate[date].weekly[String(key)] = value;
                }
              });
            }
          }
        });
      }
      
      // 確保日期為今天的結構一定存在
      const today = new Date().toISOString().split('T')[0];
      if (!normalizedProgressByDate[today]) {
        normalizedProgressByDate[today] = {
          daily: {},
          weekly: {}
        };
      }
      
      const result = {
        dailyProgress: normalizedDailyProgress, 
        weeklyProgress: normalizedWeeklyProgress,
        progressByDate: normalizedProgressByDate
      };
      
      console.log('返回的處理過的進度數據:', result);
      return result;
    } catch (error) {
      console.error('Error in getWishProgress:', error);
      // 返回完整的空結構以防錯誤
      return {
        dailyProgress: {},
        weeklyProgress: {},
        progressByDate: {
          [new Date().toISOString().split('T')[0]]: {
            daily: {},
            weekly: {}
          }
        }
      };
    }
  },
  
  // 添加願望
  async addWish(wish) {
    try {
      console.log('addWish 被調用，參數:', wish);
      
      // 確保所有 ID 都是字串類型
      const normalizedWish = { ...wish };
      
      if (normalizedWish.userId) {
        normalizedWish.userId = String(normalizedWish.userId);
      }
      
      if (Array.isArray(normalizedWish.steps)) {
        normalizedWish.steps = normalizedWish.steps.map(step => ({
          ...step,
          id: step.id ? String(step.id) : undefined
        }));
      }
      
      // 確保進度數據結構存在
      if (!normalizedWish.dailyProgress) normalizedWish.dailyProgress = {};
      if (!normalizedWish.weeklyProgress) normalizedWish.weeklyProgress = {};
      if (!normalizedWish.progressByDate) normalizedWish.progressByDate = {};
      
      // 使用 createWish 方法存儲願望
      return await this.createWish(normalizedWish);
    } catch (error) {
      console.error('添加願望時出錯:', error);
      return null;
    }
  }
};

// 步驟相關操作
export const stepService = {
  // 獲取願望的步驟
  async getSteps(wishId) {
    const steps = await db.steps.where('wishId').equals(wishId).toArray();
    return steps.sort((a, b) => a.order - b.order);
  },
  
  // 創建步驟
  async createStep(step) {
    // 獲取當前最大順序值
    const steps = await db.steps.where('wishId').equals(step.wishId).toArray();
    const maxOrder = steps.length > 0 ? Math.max(...steps.map(s => s.order)) : 0;
    
    return await db.steps.add({
      ...step,
      completed: false,
      order: maxOrder + 1
    });
  },
  
  // 更新步驟
  async updateStep(id, changes) {
    await db.steps.update(id, changes);
    return await db.steps.get(id);
  },
  
  // 切換步驟完成狀態
  async toggleStepCompletion(id) {
    const step = await db.steps.get(id);
    await db.steps.update(id, { completed: !step.completed });
    
    // 更新願望進度
    const steps = await db.steps.where('wishId').equals(step.wishId).toArray();
    const completedSteps = steps.filter(s => s.completed).length;
    const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;
    
    await db.wishes.update(step.wishId, { progress });
    
    return await db.steps.get(id);
  },
  
  // 刪除步驟
  async deleteStep(id) {
    const step = await db.steps.get(id);
    await db.steps.delete(id);
    
    // 重新排序剩餘步驟
    const remainingSteps = await db.steps.where('wishId').equals(step.wishId).toArray();
    remainingSteps.sort((a, b) => a.order - b.order);
    
    for (let i = 0; i < remainingSteps.length; i++) {
      await db.steps.update(remainingSteps[i].id, { order: i + 1 });
    }
    
    // 更新願望進度
    const completedSteps = remainingSteps.filter(s => s.completed).length;
    const progress = remainingSteps.length > 0 ? Math.round((completedSteps / remainingSteps.length) * 100) : 0;
    
    await db.wishes.update(step.wishId, { progress });
  },
  
  // 重新排序步驟
  async reorderSteps(wishId, stepIds) {
    for (let i = 0; i < stepIds.length; i++) {
      await db.steps.update(stepIds[i], { order: i + 1 });
    }
    return await stepService.getSteps(wishId);
  }
};

// 願望清單相關操作
export const wishlistService = {
  // 獲取用戶的願望清單
  async getWishlists(userId) {
    return await db.wishlists.where('userId').equals(userId).toArray();
  },
  
  // 獲取單個願望清單
  async getWishlist(id) {
    return await db.wishlists.get(id);
  },
  
  // 創建願望清單
  async createWishlist(wishlist) {
    return await db.wishlists.add({
      ...wishlist,
      createdAt: new Date().toISOString()
    });
  },
  
  // 更新願望清單
  async updateWishlist(id, changes) {
    await db.wishlists.update(id, changes);
    return await db.wishlists.get(id);
  },
  
  // 刪除願望清單
  async deleteWishlist(id) {
    // 刪除清單中的項目
    await db.wishlistItems.where('wishlistId').equals(id).delete();
    // 刪除清單
    await db.wishlists.delete(id);
  },
  
  // 獲取願望清單中的願望
  async getWishlistItems(wishlistId) {
    const items = await db.wishlistItems.where('wishlistId').equals(wishlistId).toArray();
    const wishes = [];
    
    for (const item of items) {
      const wish = await db.wishes.get(item.wishId);
      if (wish) {
        wishes.push(wish);
      }
    }
    
    return wishes;
  },
  
  // 添加願望到清單
  async addWishToWishlist(wishlistId, wishId) {
    // 檢查是否已存在
    const existing = await db.wishlistItems
      .where('wishlistId').equals(wishlistId)
      .and(item => item.wishId === wishId)
      .first();
      
    if (!existing) {
      return await db.wishlistItems.add({ wishlistId, wishId });
    }
    
    return existing.id;
  },
  
  // 從清單中移除願望
  async removeWishFromWishlist(wishlistId, wishId) {
    await db.wishlistItems
      .where('wishlistId').equals(wishlistId)
      .and(item => item.wishId === wishId)
      .delete();
  }
};

// 評論相關操作
export const commentService = {
  // 獲取目標的評論
  async getComments(targetId, targetType) {
    const comments = await db.comments
      .where('targetId').equals(targetId)
      .and(comment => comment.targetType === targetType)
      .toArray();
      
    return comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  // 添加評論
  async addComment(comment) {
    return await db.comments.add({
      ...comment,
      createdAt: new Date().toISOString(),
      likes: 0
    });
  },
  
  // 點讚評論
  async likeComment(id) {
    const comment = await db.comments.get(id);
    await db.comments.update(id, { likes: (comment.likes || 0) + 1 });
    return await db.comments.get(id);
  },
  
  // 刪除評論
  async deleteComment(id) {
    await db.comments.delete(id);
  }
};

// 通知相關操作
export const notificationService = {
  // 獲取用戶通知
  async getNotifications(userId) {
    const notifications = await db.notifications
      .where('userId').equals(userId)
      .toArray();
      
    return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
  
  // 獲取未讀通知數量
  async getUnreadCount(userId) {
    return await db.notifications
      .where('userId').equals(userId)
      .and(notification => !notification.read)
      .count();
  },
  
  // 添加通知
  async addNotification(notification) {
    return await db.notifications.add({
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    });
  },
  
  // 標記通知為已讀
  async markAsRead(id) {
    await db.notifications.update(id, { read: true });
  },
  
  // 標記所有通知為已讀
  async markAllAsRead(userId) {
    await db.notifications
      .where('userId').equals(userId)
      .modify({ read: true });
  },
  
  // 刪除通知
  async deleteNotification(id) {
    await db.notifications.delete(id);
  }
};

// 徽章和獎勵相關操作
export const rewardService = {
  // 獲取用戶徽章
  async getBadges(userId) {
    return await db.badges.where('userId').equals(userId).toArray();
  },
  
  // 添加徽章
  async addBadge(badge) {
    return await db.badges.add({
      ...badge,
      earnedAt: new Date().toISOString()
    });
  },
  
  // 獲取用戶積分歷史
  async getPointsHistory(userId) {
    const points = await db.points.where('userId').equals(userId).toArray();
    return points.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
  
  // 獲取用戶總積分
  async getTotalPoints(userId) {
    const points = await db.points.where('userId').equals(userId).toArray();
    return points.reduce((total, point) => total + point.amount, 0);
  },
  
  // 添加積分
  async addPoints(userId, amount, reason) {
    return await db.points.add({
      userId,
      amount,
      reason,
      timestamp: new Date().toISOString()
    });
  },
  
  // 獲取所有獎勵
  async getRewards() {
    return await db.rewards.toArray();
  },
  
  // 兌換獎勵
  async redeemReward(userId, rewardId) {
    const reward = await db.rewards.get(rewardId);
    const totalPoints = await rewardService.getTotalPoints(userId);
    
    if (totalPoints >= reward.cost && reward.available) {
      // 扣除積分
      await rewardService.addPoints(userId, -reward.cost, `兌換獎勵: ${reward.name}`);
      
      // 如果獎勵數量有限，減少可用數量
      if (typeof reward.available === 'number') {
        await db.rewards.update(rewardId, { available: reward.available - 1 });
      }
      
      // 添加通知
      await notificationService.addNotification({
        userId,
        type: 'reward',
        content: `您已成功兌換獎勵: ${reward.name}`,
        targetId: rewardId,
        targetType: 'reward',
        targetTitle: reward.name
      });
      
      return true;
    }
    
    return false;
  }
};

// 初始化資料庫
export const initializeDatabase = async () => {
  // 檢查是否已初始化
  const userCount = await db.users.count();
  
  if (userCount === 0) {
    // 添加示範用戶
    const userId = await db.users.add({
      email: 'user@example.com',
      username: 'demo_user',
      name: '張小明',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: '熱愛學習和自我提升的普通人',
      joinDate: new Date().toISOString(),
      location: '台北市',
      website: 'https://example.com'
    });
    
    // 添加示範願望清單
    const wishlistId = await db.wishlists.add({
      userId,
      name: '學習目標',
      icon: 'book',
      createdAt: new Date().toISOString()
    });
    
    // 添加示範願望
    const wishId = await db.wishes.add({
      userId,
      title: '學習 React',
      description: '掌握 React 框架的基本概念和應用',
      category: '學習',
      visibility: 'public',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'in-progress',
      priority: 'high',
      progress: 30,
      tags: ['程式設計', 'Web開發', 'JavaScript']
    });
    
    // 添加願望到清單
    await db.wishlistItems.add({
      wishlistId,
      wishId
    });
    
    // 添加步驟
    await db.steps.bulkAdd([
      {
        wishId,
        title: '學習 JSX 語法',
        description: '理解 JSX 語法和基本用法',
        completed: true,
        order: 1
      },
      {
        wishId,
        title: '理解組件和 Props',
        description: '學習 React 組件的創建和使用 Props 傳遞數據',
        completed: true,
        order: 2
      },
      {
        wishId,
        title: '掌握 State 和生命週期',
        description: '理解 React 的狀態管理和組件生命週期',
        completed: false,
        order: 3
      },
      {
        wishId,
        title: '學習 Hooks',
        description: '掌握 React Hooks 的使用方法',
        completed: false,
        order: 4
      }
    ]);
    
    // 添加示範徽章
    await db.badges.add({
      userId,
      name: '新手上路',
      icon: 'star',
      description: '創建第一個願望',
      earnedAt: new Date().toISOString()
    });
    
    // 添加示範積分
    await db.points.add({
      userId,
      amount: 100,
      reason: '註冊獎勵',
      timestamp: new Date().toISOString()
    });
    
    // 添加示範獎勵
    await db.rewards.bulkAdd([
      {
        name: '專業模板',
        description: '解鎖專業願望計劃模板',
        icon: 'template',
        cost: 200,
        available: true
      },
      {
        name: '高級主題',
        description: '解鎖高級界面主題',
        icon: 'palette',
        cost: 300,
        available: true
      }
    ]);
    
    console.log('資料庫初始化完成');
  }
};

// 導出資料庫實例
export default db; 