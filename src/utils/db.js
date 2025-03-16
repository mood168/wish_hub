import Dexie from 'dexie';

// 創建 Dexie 資料庫實例
const db = new Dexie('wishHubDB');

// 定義資料庫結構
db.version(1).stores({
  users: '++id, email, username, name, avatar, bio, joinDate, location, website',
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
    // 確保 id 是數字類型
    let wishId = id;
    if (typeof id === 'string') {
      try {
        wishId = parseInt(id);
        if (isNaN(wishId)) {
          wishId = id; // 如果轉換失敗，使用原始值
        }
      } catch (e) {
        console.error('無法將 id 轉換為整數:', id);
        wishId = id; // 如果轉換失敗，使用原始值
      }
    }
    
    // 嘗試獲取願望
    try {
      const wish = await db.wishes.get(wishId);
      return wish;
    } catch (error) {
      console.error('獲取願望時出錯:', error);
      return null;
    }
  },
  
  // 創建願望
  async createWish(wish) {
    return await db.wishes.add({
      ...wish,
      createdAt: new Date().toISOString(),
      progress: 0
    });
  },
  
  // 更新願望
  async updateWish(id, changes) {
    await db.wishes.update(id, changes);
    return await db.wishes.get(id);
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