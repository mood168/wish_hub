class WishService {
  constructor(db) {
    this.db = db;
    console.log('WishService 被初始化，db 對象:', db);
  }
  
  async getWish(id) {
    console.log('WishService.getWish 被調用，id:', id);
    try {
      // 直接使用 db.wishes 集合
      const wish = await this.db.wishes.get(String(id));
      console.log('獲取願望結果:', wish);
      return wish;
    } catch (error) {
      console.error('獲取願望時出錯:', error);
      return null;
    }
  }
  
  async getWishes(filter = {}) {
    console.log('WishService.getWishes 被調用，filter:', filter);
    try {
      let collection = this.db.wishes;
      
      // 根據過濾條件查詢
      if (filter.userId) {
        collection = collection.where('userId').equals(String(filter.userId));
      }
      
      const wishes = await collection.toArray();
      console.log('獲取願望列表結果:', wishes);
      
      // 根據不同條件排序
      if (filter.sortBy === 'dueDate') {
        wishes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else if (filter.sortBy === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        wishes.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      } else if (filter.sortBy === 'progress') {
        wishes.sort((a, b) => b.progress - a.progress);
      } else {
        // 默認按創建時間排序，最新的在前面
        wishes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      return wishes;
    } catch (error) {
      console.error('獲取願望列表時出錯:', error);
      return [];
    }
  }
  
  async addWish(wish) {
    try {
      console.log('WishService.addWish 被調用，參數:', wish);
      
      if (!wish) {
        console.error('添加願望失敗: 願望數據為空');
        return null;
      }
      
      // 確保所有 ID 都是字串類型
      const normalizedWish = { ...wish };
      
      // 確保 ID 是字串
      if (normalizedWish.id) {
        normalizedWish.id = String(normalizedWish.id);
      } else {
        normalizedWish.id = `wish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }
      
      // 確保用戶 ID 是字串
      if (normalizedWish.userId) {
        normalizedWish.userId = String(normalizedWish.userId);
      }
      
      // 確保 tags 屬性存在
      if (!normalizedWish.tags) {
        normalizedWish.tags = [];
      }
      
      // 確保步驟中的 ID 都是字串
      if (Array.isArray(normalizedWish.steps)) {
        normalizedWish.steps = normalizedWish.steps.map(step => ({
          ...step,
          id: step.id ? String(step.id) : `step_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        }));
      } else {
        normalizedWish.steps = [];
      }
      
      // 確保目標數組都存在
      if (!Array.isArray(normalizedWish.dailyGoals)) {
        normalizedWish.dailyGoals = [];
      }
      
      if (!Array.isArray(normalizedWish.weeklyGoals)) {
        normalizedWish.weeklyGoals = [];
      }
      
      // 確保進度數據結構存在
      if (!normalizedWish.dailyProgress) normalizedWish.dailyProgress = {};
      if (!normalizedWish.weeklyProgress) normalizedWish.weeklyProgress = {};
      if (!normalizedWish.progressByDate) normalizedWish.progressByDate = {};
      
      console.log('使用規範化的願望數據調用 db.wishes.add:', normalizedWish);
      
      // 直接使用 db.wishes 集合添加
      const id = await this.db.wishes.add(normalizedWish);
      console.log('願望添加成功，ID:', id);
      
      // 獲取添加的願望
      const savedWish = await this.db.wishes.get(id);
      console.log('返回的願望數據:', savedWish);
      
      return savedWish;
    } catch (error) {
      console.error('添加願望時出錯:', error);
      return null;
    }
  }
  
  async updateWish(id, updates) {
    console.log('WishService.updateWish 被調用，參數:', { id, updates });
    try {
      // 確保 ID 是字串
      const idStr = String(id);
      
      // 更新數據
      await this.db.wishes.update(idStr, updates);
      
      // 獲取更新後的數據
      const updatedWish = await this.db.wishes.get(idStr);
      console.log('願望更新成功:', updatedWish);
      
      return updatedWish;
    } catch (error) {
      console.error('更新願望時出錯:', error);
      return null;
    }
  }
  
  async deleteWish(id) {
    console.log('WishService.deleteWish 被調用，id:', id);
    try {
      // 確保 ID 是字串
      const idStr = String(id);
      
      // 先獲取願望以返回
      const wish = await this.db.wishes.get(idStr);
      
      // 刪除願望
      await this.db.wishes.delete(idStr);
      console.log('願望刪除成功, ID:', idStr);
      
      return wish;
    } catch (error) {
      console.error('刪除願望時出錯:', error);
      return null;
    }
  }
  
  async getWishProgress(wishId) {
    console.log('WishService.getWishProgress 被調用，wishId:', wishId);
    try {
      // 確保 ID 是字串
      const idStr = String(wishId);
      
      // 獲取願望
      const wish = await this.db.wishes.get(idStr);
      
      if (!wish) {
        console.log('找不到願望, ID:', idStr);
        return {
          dailyProgress: {},
          weeklyProgress: {},
          progressByDate: {}
        };
      }
      
      // 返回進度數據
      return {
        dailyProgress: wish.dailyProgress || {},
        weeklyProgress: wish.weeklyProgress || {},
        progressByDate: wish.progressByDate || {}
      };
    } catch (error) {
      console.error('獲取願望進度時出錯:', error);
      return {
        dailyProgress: {},
        weeklyProgress: {},
        progressByDate: {}
      };
    }
  }
  
  async updateWishProgress(wishId, progressData) {
    // 只處理有效的資料
    console.log('WishService.updateWishProgress 接收參數:', { wishId, progressData });
    
    try {
      // 確保 ID 是字串
      const idStr = String(wishId);
      
      // 獲取當前願望
      const wish = await this.db.wishes.get(idStr);
      
      if (!wish) {
        console.log('找不到願望, ID:', idStr);
        return null;
      }
      
      // 準備更新數據
      const updateData = {
        dailyProgress: { ...wish.dailyProgress } || {},
        weeklyProgress: { ...wish.weeklyProgress } || {},
        progressByDate: { ...wish.progressByDate } || {},
        updatedAt: new Date().toISOString()
      };
      
      // 處理 dailyProgress
      if (progressData.dailyProgress !== undefined) {
        Object.entries(progressData.dailyProgress).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            updateData.dailyProgress[String(key)] = value;
          }
        });
      }
      
      // 處理 weeklyProgress
      if (progressData.weeklyProgress !== undefined) {
        Object.entries(progressData.weeklyProgress).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            updateData.weeklyProgress[String(key)] = value;
          }
        });
      }
      
      // 處理 progressByDate
      if (progressData.progressByDate !== undefined) {
        Object.entries(progressData.progressByDate).forEach(([date, dateProgress]) => {
          if (dateProgress && typeof dateProgress === 'object') {
            // 確保日期結構存在
            if (!updateData.progressByDate[date]) {
              updateData.progressByDate[date] = { daily: {}, weekly: {} };
            }
            
            // 處理每日進度
            if (dateProgress.daily) {
              Object.entries(dateProgress.daily).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  if (!updateData.progressByDate[date].daily) {
                    updateData.progressByDate[date].daily = {};
                  }
                  updateData.progressByDate[date].daily[String(key)] = value;
                }
              });
            }
            
            // 處理每週進度
            if (dateProgress.weekly) {
              Object.entries(dateProgress.weekly).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  if (!updateData.progressByDate[date].weekly) {
                    updateData.progressByDate[date].weekly = {};
                  }
                  updateData.progressByDate[date].weekly[String(key)] = value;
                }
              });
            }
          }
        });
      }
      
      console.log('更新願望進度，數據:', updateData);
      
      // 更新數據庫
      await this.db.wishes.update(idStr, updateData);
      
      // 獲取更新後的數據
      const updatedWish = await this.db.wishes.get(idStr);
      console.log('願望進度更新成功:', updatedWish);
      
      return updatedWish;
    } catch (error) {
      console.error('更新願望進度時出錯:', error);
      return null;
    }
  }
  
  // 切換任務完成狀態
  async toggleTaskComplete(taskId) {
    console.log('WishService.toggleTaskComplete 被調用，taskId:', taskId);
    
    try {
      // 解析任務 ID 格式: wishId-taskType-index
      const [wishId, taskType, taskIndex] = taskId.split('-');
      
      if (!wishId || !taskType || taskIndex === undefined) {
        console.error('無效的任務 ID 格式:', taskId);
        return false;
      }
      
      console.log(`解析任務 ID: 願望ID=${wishId}, 任務類型=${taskType}, 索引=${taskIndex}`);
      
      // 獲取該願望
      const wish = await this.db.wishes.get(String(wishId));
      
      if (!wish) {
        console.error('找不到對應的願望:', wishId);
        return false;
      }
      
      // 根據任務類型更新進度
      const today = new Date().toISOString().split('T')[0];
      
      // 確保進度數據結構存在
      if (!wish.dailyProgress) wish.dailyProgress = {};
      if (!wish.weeklyProgress) wish.weeklyProgress = {};
      if (!wish.progressByDate) wish.progressByDate = {};
      if (!wish.progressByDate[today]) wish.progressByDate[today] = { daily: {}, weekly: {} };
      
      const progressType = taskType === 'daily' ? 'dailyProgress' : 'weeklyProgress';
      const dateProgressType = taskType === 'daily' ? 'daily' : 'weekly';
      
      // 檢查是否已完成
      const isCompleted = Boolean(wish[progressType][taskIndex]);
      
      // 更新狀態
      const updatedProgressData = { ...wish[progressType] };
      
      if (isCompleted) {
        // 如果已完成，則設為未完成
        updatedProgressData[taskIndex] = null;
        if (wish.progressByDate[today] && wish.progressByDate[today][dateProgressType]) {
          delete wish.progressByDate[today][dateProgressType][taskIndex];
        }
      } else {
        // 如果未完成，則設為已完成
        const now = new Date().toISOString();
        updatedProgressData[taskIndex] = now;
        
        // 確保日期進度結構存在
        if (!wish.progressByDate[today]) {
          wish.progressByDate[today] = { daily: {}, weekly: {} };
        }
        if (!wish.progressByDate[today][dateProgressType]) {
          wish.progressByDate[today][dateProgressType] = {};
        }
        
        // 更新今日進度
        wish.progressByDate[today][dateProgressType][taskIndex] = now;
      }
      
      // 準備更新數據
      const updateData = {
        [progressType]: updatedProgressData,
        progressByDate: wish.progressByDate,
        updatedAt: new Date().toISOString()
      };
      
      console.log('更新任務狀態，數據:', updateData);
      
      // 更新數據庫
      await this.db.wishes.update(String(wishId), updateData);
      
      console.log('任務狀態更新成功');
      return true;
    } catch (error) {
      console.error('切換任務完成狀態時出錯:', error);
      return false;
    }
  }
}

export default WishService; 