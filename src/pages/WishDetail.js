import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServicesContext';
import Dialog from '@mui/material/Dialog';

// 獲取類別圖標
const getCategoryIcon = (category) => {
  const icons = {
    '學習': '📚',
    '健身': '💪',
    '閱讀': '📖',
    '旅行': '✈️',
    '職業發展': '💼',
    '理財': '💰',
    '興趣愛好': '🎨',
    '人際關係': '👥',
    '生活品質': '🏠',
    '其他': '📌'
  };
  return icons[category] || '📌';
};

// 獲取優先級顏色
const getPriorityColor = (priority) => {
  const colors = {
    'high': '#ff3b30',
    'medium': '#ff9500',
    'low': '#34c759'
  };
  return colors[priority] || '#34c759';
};

// 獲取優先級文字
const getPriorityText = (priority) => {
  const texts = {
    'high': '高優先級',
    'medium': '中優先級',
    'low': '低優先級'
  };
  return texts[priority] || '一般優先級';
};

// 計算日常目標進度
const calculateDailyProgress = (goals, progress) => {
  if (!goals || !progress || !Array.isArray(goals) || goals.length === 0) return 0;
  
  let completedCount = 0;
  
  // 使用索引遍歷 goals 陣列
  for (let i = 0; i < goals.length; i++) {
    const strIndex = String(i);
    // 檢查 progress 物件中是否有對應的進度項目，且不為 null 或 undefined
    if (progress[strIndex] !== undefined && progress[strIndex] !== null) {
      completedCount++;
    }
  }
  
  // 計算完成百分比
  return (completedCount / goals.length) * 100;
};

// 計算每週目標進度
const calculateWeeklyProgress = (goals, progress) => {
  if (!goals || !progress || !Array.isArray(goals) || goals.length === 0) return 0;
  
  let completedCount = 0;
  
  // 使用索引遍歷 goals 陣列
  for (let i = 0; i < goals.length; i++) {
    const strIndex = String(i);
    // 檢查 progress 物件中是否有對應的進度項目，且不為 null 或 undefined
    if (progress[strIndex] !== undefined && progress[strIndex] !== null) {
      completedCount++;
    }
  }
  
  // 計算完成百分比
  return (completedCount / goals.length) * 100;
};

function WishDetail() {
  const { user, authLoading } = useAuth();
  const { texts } = useLanguage();
  const { commentService, wishService, userService, stepService } = useServices();
  const { wishId } = useParams();
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);
  
  // 添加強制更新機制
  const [forceUpdate, setForceUpdate] = useState(0);
  const triggerRender = () => setForceUpdate(prev => prev + 1);
  
  // 是否為創建者
  const [isCreator, setIsCreator] = useState(false);
  
  // 創建者信息
  const [creatorInfo, setCreatorInfo] = useState({
    name: '載入中...',
    avatar: '👤'
  });
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [progressByDate, setProgressByDate] = useState({});
  
  const [wish, setWish] = useState({
    title: '載入中...',
    description: '',
    category: '',
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: 0,
    visibility: 'public',
    isAnonymous: false,
    // 移除 tasks 相關狀態
    steps: [],
    comments: [],
    dailyGoals: [],
    weeklyGoals: []
  });
  const [loading, setLoading] = useState(true);
  
  // 修改為三個頁籤的 activeTab
  const [activeTab, setActiveTab] = useState('basicInfo');
  
  const [comment, setComment] = useState('');
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  
  // 評論數據
  const [comments, setComments] = useState([]);
  
  // 進度數據
  const [progress, setProgress] = useState([]);
  
  // 相關願望
  const [relatedWishes, setRelatedWishes] = useState([]);
  
  // 目標設定
  const [goals, setGoals] = useState({
    daily: '',
    weekly: '',
    taskName: '',
    taskDueDate: ''
  });
  
  // 隱私設定
  const [privacySettings, setPrivacySettings] = useState({
    visibility: 'public', // 'public', 'friends', 'private'
    isAnonymous: false
  });
  
  // 進度記錄
  const [progressLog, setProgressLog] = useState([]);
  
  // 新步驟
  const [newStep, setNewStep] = useState('');
  
  // 階段任務相關狀態
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  
  // 進度追蹤區
  const [dailyProgress, setDailyProgress] = useState({});
  const [weeklyProgress, setWeeklyProgress] = useState({});
  
  // 新增進度相關的狀態
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [progressInput, setProgressInput] = useState('');
  const [progressType, setProgressType] = useState('daily'); // 'daily' or 'weekly'
  
  // 添加日曆相關狀態
  const [showCalendar, setShowCalendar] = useState(false);
  
  // 導航到前一天
  const goToPreviousDay = () => {
    // 解析當前日期
    const currentDate = new Date(selectedDate);
    // 減去一天
    currentDate.setDate(currentDate.getDate() - 1);
    // 更新選定日期
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  // 導航到後一天
  const goToNextDay = () => {
    // 解析當前日期
    const currentDate = new Date(selectedDate);
    // 加上一天
    currentDate.setDate(currentDate.getDate() + 1);
    // 更新選定日期
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };
  
  // 從資料庫獲取願望數據
    const fetchWishData = async () => {
        setLoading(true);
        
      try {
      console.log('開始獲取願望數據，ID:', wishId);
      
      if (!wishService) {
        console.error('願望服務未初始化');
        throw new Error('願望服務未初始化');
      }
      
      // 從資料庫取得願望資料，確保 wishId 是字串類型
      console.log('調用 wishService.getWish 方法，參數:', String(wishId));
      const wishData = await wishService.getWish(String(wishId));
      
      console.log('wishService.getWish 返回結果:', wishData);
        
        if (wishData) {
        console.log('成功獲取願望數據:', JSON.stringify(wishData));
        // 確保所有 ID 都是字串類型
        const normalizedWishData = {
          ...wishData,
          id: String(wishData.id),
          userId: String(wishData.userId)
        };
        
        setWish(normalizedWishData);
          
          // 確保有有效的目標數據
        if (!normalizedWishData.dailyGoals || !normalizedWishData.dailyGoals.length) {
          normalizedWishData.dailyGoals = ['寫10篇筆記', '練習口說10分鐘'];
          }
        if (!normalizedWishData.weeklyGoals || !normalizedWishData.weeklyGoals.length) {
          normalizedWishData.weeklyGoals = ['上課1小時', '完成一章作業'];
          }
          
          // 加載進度歷史
        if (normalizedWishData.progressLog && Array.isArray(normalizedWishData.progressLog)) {
          setProgressLog(normalizedWishData.progressLog.map(log => ({
            ...log,
            id: String(log.id)
          })));
          } else {
            setProgressLog([]);
          }
          
          // 檢查用戶權限
        if (user && normalizedWishData.userId) {
          console.log('Current user:', user);
          console.log('Wish creator ID:', normalizedWishData.userId);
          
          const isCreator = user.id !== undefined && normalizedWishData.userId !== undefined && 
                          String(user.id) === String(normalizedWishData.userId);
          console.log('Is creator?', isCreator);
            setIsCreator(isCreator);
          
          // 獲取創建者信息
          try {
            const creatorData = await userService.getUser(String(normalizedWishData.userId));
            if (creatorData) {
              setCreatorInfo({
                name: creatorData.name || '未知用戶',
                avatar: creatorData.avatar || '👤'
              });
            }
          } catch (error) {
            console.error('獲取創建者數據失敗:', error);
            setCreatorInfo({
              name: '未知用戶',
              avatar: '👤'
            });
          }
          }
          
          // 獲取評論
        const comments = await commentService.getComments(String(wishId), 'wish');
        setComments(comments.map(comment => ({
          ...comment,
          id: String(comment.id),
          userId: String(comment.userId)
        })));
          
          // 獲取步驟
        const steps = await stepService.getSteps(String(wishId));
        setSteps(steps.map(step => ({
          ...step,
          id: String(step.id)
        })));
          
        } else {
          console.log('找不到願望，使用示例數據');
          
          // 示例願望數據
        const demoWish = {
          id: String(wishId),
            title: '學習英文',
            description: '每天學習英文，提高英語能力',
              category: '學習',
            createdAt: new Date().toISOString(),
              priority: 'high',
            status: 'in-progress',
              progress: 30,
            dailyGoals: ['寫10篇筆記', '練習口說10分鐘'],
            weeklyGoals: ['上課1小時', '完成一章作業'],
            progressLog: [],
            tasks: [],
            visibility: 'public',
          userId: user ? String(user.id) : '1'
        };
          
        setWish(demoWish);
          setProgressLog([]);
        setTasks([]);
          setIsCreator(true);
        }
      } catch (error) {
        console.error('獲取願望數據失敗:', error);
      console.error('錯誤詳情:', error.message);
      console.error('錯誤堆疊:', error.stack);
      setError('獲取願望數據時發生錯誤: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
  // 處理頁面離開前的保存
  const handleBeforeUnload = async () => {
      console.log('頁面即將離開，確保任務保存...');
      if (tasks && tasks.length > 0 && wishId) {
        console.log('保存任務數據:', tasks);
      try {
        const normalizedTasks = tasks.map(task => ({
          ...task,
          id: String(task.id)
        }));
        
        await wishService.updateWish(String(wishId), { 
          tasks: normalizedTasks 
        });
      } catch (err) {
        console.error('離開前保存失敗:', err);
      }
    }
  };
  
  // 修改 useEffect 中的資料庫操作
  useEffect(() => {
    if (wishId) {
      console.log('初始化加載 wishId:', wishId);
      fetchWishData();
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (tasks && tasks.length > 0 && wishId) {
        console.log('組件卸載，保存任務數據...');
        const normalizedTasks = tasks.map(task => ({
          ...task,
          id: String(task.id)
        }));
        
        wishService.updateWish(String(wishId), { 
          tasks: normalizedTasks 
        }).catch(err => console.error('組件卸載保存失敗:', err));
      }
    };
  }, [wishId, tasks]);
  
  // 處理頁面重新獲得焦點時刷新數據
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('頁面重新獲得焦點，刷新願望數據');
        // 重新獲取最新的數據
        fetchWishData();
      }
    };
    
    // 添加頁面可見性變化事件監聽器
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 額外添加窗口獲得焦點事件
    window.addEventListener('focus', () => {
      console.log('窗口獲得焦點，刷新願望數據');
      fetchWishData();
    });
    
    // 清理函數
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchWishData);
    };
  }, [wishId, wishService, userService, commentService, stepService, user]);
  
  // 計算正確的進度百分比（從創建到預計完成日期之間的進度）
  const calculateCorrectProgress = async (currentWish) => {
    console.log('計算正確進度', currentWish);
    
    try {
      const normalizedWish = {
        ...currentWish,
        id: String(currentWish.id),
        userId: String(currentWish.userId),
        steps: currentWish.steps?.map(step => ({
          ...step,
          id: String(step.id)
        })) || []
      };
      
      let stepsProgress = 0;
      if (normalizedWish.steps && normalizedWish.steps.length > 0) {
        const completedSteps = normalizedWish.steps.filter(step => step.completed).length;
        stepsProgress = (completedSteps / normalizedWish.steps.length) * 100;
      }
      
      const dailyGoalsProgress = normalizedWish.dailyGoals
        ? calculateDailyProgress(normalizedWish.dailyGoals, dailyProgress)
        : 0;
      
      const weeklyGoalsProgress = normalizedWish.weeklyGoals
        ? calculateWeeklyProgress(normalizedWish.weeklyGoals, weeklyProgress)
        : 0;
      
      let totalWeight = 0;
      let weightedSum = 0;
      
      if (normalizedWish.steps && normalizedWish.steps.length > 0) {
        totalWeight += 33.33;
        weightedSum += stepsProgress * 0.3333;
      }
      
      if (normalizedWish.dailyGoals && normalizedWish.dailyGoals.length > 0) {
        totalWeight += 33.33;
        weightedSum += dailyGoalsProgress * 0.3333;
      }
      
      if (normalizedWish.weeklyGoals && normalizedWish.weeklyGoals.length > 0) {
        totalWeight += 33.33;
        weightedSum += weeklyGoalsProgress * 0.3333;
      }
      
      const finalProgress = totalWeight > 0 ? weightedSum / (totalWeight / 100) : 0;
      const updatedProgress = Math.round(finalProgress);
      
      setProgress(updatedProgress);
      
      await wishService.updateWish(String(wishId), { 
        progress: updatedProgress 
      });
      
      return updatedProgress;
    } catch (error) {
      console.error('計算進度時出錯:', error);
      return progress;
    }
  };
  
  // 從資料庫加載進度資料
  useEffect(() => {
    const loadProgress = async () => {
      try {
        console.log('正在加載願望進度數據:', wishId);
        console.log('當前選定日期:', selectedDate);
        
        // 嘗試從資料庫獲取進度數據
        const progressData = await wishService.getWishProgress(String(wishId));
        console.log('從資料庫獲取的數據:', progressData);
        
        // 如果沒有數據，初始化空對象
        if (!progressData) {
          console.log('在資料庫中找不到數據，初始化空對象');
          setDailyProgress({});
          setWeeklyProgress({});
          setProgressByDate({});
          return;
        }
        
        // 設置總體進度狀態（跨所有日期）
        setDailyProgress(progressData.dailyProgress || {});
        setWeeklyProgress(progressData.weeklyProgress || {});
        
        // 按日期組織進度數據
        const progressByDateMap = {};
        
        // 確保今天和所選日期有初始化的結構
        const today = new Date().toISOString().split('T')[0];
        progressByDateMap[today] = { daily: {}, weekly: {} };
        progressByDateMap[selectedDate] = { daily: {}, weekly: {} };
        
        // 處理每日進度
        if (progressData.dailyProgress) {
          Object.entries(progressData.dailyProgress).forEach(([goalId, timestamp]) => {
            if (!timestamp) return;
            
            // 獲取完成日期
            const date = new Date(timestamp).toISOString().split('T')[0];
            
            // 確保該日期的數據結構存在
            if (!progressByDateMap[date]) {
              progressByDateMap[date] = { daily: {}, weekly: {} };
            }
            
            // 將此目標標記為在完成日期已完成
            progressByDateMap[date].daily[String(goalId)] = timestamp;
          });
        }
        
        // 處理每週進度
        if (progressData.weeklyProgress) {
          Object.entries(progressData.weeklyProgress).forEach(([goalId, timestamp]) => {
            if (!timestamp) return;
            
            // 獲取完成日期
            const date = new Date(timestamp).toISOString().split('T')[0];
            
            // 確保該日期的數據結構存在
            if (!progressByDateMap[date]) {
              progressByDateMap[date] = { daily: {}, weekly: {} };
            }
            
            // 將此目標標記為在完成日期已完成
            progressByDateMap[date].weekly[String(goalId)] = timestamp;
          });
        }
        
        console.log('按日期組織的進度數據:', progressByDateMap);
        setProgressByDate(progressByDateMap);
        
        // 當進度數據加載時重新計算總進度
        if (wish) {
          calculateCorrectProgress(wish);
        }
        
      } catch (error) {
        console.error('加載進度數據失敗:', error);
      }
    };
    
    if (wishId) {
      loadProgress();
    }
  }, [wishId, selectedDate, wishService, wish]);
  
  // 修正問題1: 處理同時勾選每日和每周TDL項目的衝突問題
  const handleToggleProgress = async (goalIdParam, isDaily) => {
    console.log('======= 切換進度狀態 =======');
    
    // 確保 goalId 是字串類型
    const goalId = String(goalIdParam);
    console.log('參數:', { goalId, isDaily, selectedDate });
    
    try {
      // 目前進度的狀態集
      const progressMap = isDaily ? dailyProgress : weeklyProgress;
      const setProgressMap = isDaily ? setDailyProgress : setWeeklyProgress;
      
      // 檢查選定日期的進度狀態
      console.log('目前進度狀態:', progressByDate);
      const currentDateProgress = progressByDate[selectedDate] || { daily: {}, weekly: {} };
      const progressType = isDaily ? 'daily' : 'weekly';
      const currentTypeProgress = currentDateProgress[progressType] || {};
      
      // 檢查目標是否已完成
      const isCompleted = Boolean(currentTypeProgress[goalId]);
      console.log('目前完成狀態:', isCompleted ? '已完成' : '未完成');
      
      // 創建進度備份，以防更新失敗時恢復
      const originalProgress = { ...progressMap };
      const originalProgressByDate = { ...progressByDate };
      
      // 1. 更新總體進度狀態 - 這是跨日期的總體狀態
      const newProgress = {
        ...progressMap,
        [goalId]: isCompleted ? null : new Date().toISOString()
      };
      
      console.log('新的進度狀態:', newProgress);
      
      // 2. 更新按日期組織的進度資料 - 這是特定日期的狀態
      const updatedProgressByDate = {
        ...progressByDate,
        [selectedDate]: {
          ...progressByDate[selectedDate] || {},
          [progressType]: {
            ...(progressByDate[selectedDate]?.[progressType] || {}),
            [goalId]: isCompleted ? null : new Date().toISOString()
          }
        }
      };
      
      console.log('更新後的進度日期數據:', updatedProgressByDate);
      
      // 3. 如果完成一個項目，同時將其添加到進度歷史中
      if (!isCompleted) {
        const goals = isDaily ? wish.dailyGoals : wish.weeklyGoals;
        if (goals && goals[parseInt(goalId)]) {
          const taskName = goals[parseInt(goalId)];
        
        // 添加到進度歷史
        const newProgressLog = [
          ...progressLog,
          {
              id: String(Date.now()),
            date: new Date().toISOString(),
            task: taskName,
            type: isDaily ? '每日進度' : '每週進度'
          }
        ];
        
        console.log('新增進度歷史:', newProgressLog);
        setProgressLog(newProgressLog);
        
        // 更新資料庫中的進度歷史
        try {
            await wishService.updateWish(String(wishId), { progressLog: newProgressLog });
        } catch (logError) {
          console.error('更新進度歷史失敗:', logError);
          }
        }
      }
      
      // 先更新本地狀態，讓 UI 立即反應
      setProgressMap(newProgress);
      setProgressByDate(updatedProgressByDate);
      
      // 嘗試更新資料庫
      try {
        // 修正: 使用簡化且明確的參數結構
        const progressDataToUpdate = {};
        
        // 確保 dailyProgress 物件中的所有鍵都是字串
        if (isDaily) {
          const normalized = {};
          Object.entries(newProgress).forEach(([key, value]) => {
            // 再次確保鍵是字串，值不是 undefined
            if (value !== undefined) {
              normalized[String(key)] = value;
            }
          });
          progressDataToUpdate.dailyProgress = normalized;
        } else {
          // 確保 weeklyProgress 物件中的所有鍵都是字串
          const normalized = {};
          Object.entries(newProgress).forEach(([key, value]) => {
            // 再次確保鍵是字串，值不是 undefined
            if (value !== undefined) {
              normalized[String(key)] = value;
            }
          });
          progressDataToUpdate.weeklyProgress = normalized;
        }
        
        // 確保 progressByDate 物件中的所有日期和進度索引都是有效的格式
        const normalizedByDate = {};
        Object.entries(updatedProgressByDate).forEach(([date, dateProgress]) => {
          if (dateProgress && typeof dateProgress === 'object') {
            normalizedByDate[date] = {
              daily: {},
              weekly: {}
            };
            
            if (dateProgress.daily && typeof dateProgress.daily === 'object') {
              Object.entries(dateProgress.daily).forEach(([key, value]) => {
                if (value !== undefined) {
                  normalizedByDate[date].daily[String(key)] = value;
                }
              });
            }
            
            if (dateProgress.weekly && typeof dateProgress.weekly === 'object') {
              Object.entries(dateProgress.weekly).forEach(([key, value]) => {
                if (value !== undefined) {
                  normalizedByDate[date].weekly[String(key)] = value;
                }
              });
            }
          }
        });
        progressDataToUpdate.progressByDate = normalizedByDate;
        
        console.log('調用 updateWishProgress 的參數:', progressDataToUpdate);
        
        // 更新資料庫 - 使用 updateWishProgress 方法
        const updateResult = await wishService.updateWishProgress(String(wishId), progressDataToUpdate);
        
        console.log('資料庫更新成功:', updateResult);
        
        // 更新進度計算
        await calculateCorrectProgress(wish);
        
      } catch (dbError) {
        // 資料庫更新失敗，恢復本地狀態
        console.error('資料庫更新失敗:', dbError);
        setProgressMap(originalProgress);
        setProgressByDate(originalProgressByDate);
        alert('更新進度失敗，請稍後再試');
      }
      
      } catch (error) {
      console.error('切換進度發生錯誤:', error);
      alert('處理進度時發生錯誤');
      }
    };
  
  // 處理評論提交
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim() || !user) return;
    
    try {
      // 創建新評論，確保 ID 是字串類型
      const newComment = {
        id: String(Date.now()),
        wishId: String(wishId),
        userId: String(user.id),
        username: user.name || '訪客用戶',
        avatar: user.avatar || '👤',
        content: comment,
        createdAt: new Date().toISOString()
      };
      
      // 添加到評論列表
      setComments([newComment, ...comments]);
      
      // 清空評論輸入框
      setComment('');
      
      // 在實際應用中，這裡應該調用API保存評論
      await commentService.addComment(newComment);
    } catch (error) {
      console.error('提交評論時出錯:', error);
    }
  };
  
  // 處理步驟完成狀態切換
  const handleStepToggle = (stepId) => {
    if (!canEdit()) return;
    
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        const completed = !step.completed;
        return {
          ...step,
          id: String(step.id),
          completed,
          completedDate: completed ? new Date().toISOString().split('T')[0] : null
        };
      }
      return {
        ...step,
        id: String(step.id)
      };
    }));
  };
  
  // 處理添加新步驟
  const handleAddStep = (e) => {
    e.preventDefault();
    
    if (!canEdit() || !newStep.trim()) return;
    
    const newStepObj = {
      id: String(Date.now()),
      content: newStep,
      completed: false,
      completedDate: null
    };
    
    setSteps([...steps, newStepObj]);
    setNewStep('');
  };
  
  // 處理目標更新
  const handleGoalChange = (e) => {
    if (!canEdit()) return;
    
    const { name, value } = e.target;
    setGoals(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 處理隱私設定更新
  const handlePrivacyChange = (newVisibility, newIsAnonymous) => {
    if (!canEdit()) return;
    
      setPrivacySettings({
      visibility: newVisibility,
      isAnonymous: newIsAnonymous
    });
  };
  
  // 處理添加進度記錄
  const [newProgressLog, setNewProgressLog] = useState({
    progress: '',
    note: ''
  });
  
  const handleProgressLogChange = (e) => {
    const { name, value } = e.target;
    setNewProgressLog(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddProgressLog = async (e) => {
    e.preventDefault();
    
    if (!canEdit() || !newProgressLog.progress || !newProgressLog.note.trim()) return;
    
    const newLog = {
      id: String(Date.now()),
        date: new Date().toISOString().split('T')[0],
      progress: parseInt(newProgressLog.progress),
      note: newProgressLog.note
    };
    
    setProgressLog([newLog, ...progressLog]);
    setNewProgressLog({ progress: '', note: '' });
    
    // 更新願望的總進度
    if (wish) {
      const updatedWish = {
        ...wish,
        id: String(wish.id),
        progress: parseInt(newProgressLog.progress)
      };
      
      setWish(updatedWish);
      
      // 更新數據庫中的進度
      try {
        await wishService.updateWish(String(wishId), { 
          progress: parseInt(newProgressLog.progress) 
        });
        await calculateCorrectProgress(updatedWish);
      } catch (error) {
        console.error('更新進度失敗:', error);
      }
    }
  };
  
  // 計算完成的步驟百分比
  const calculateStepsProgress = () => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };
  
  // 處理添加任務
  const handleAddTask = async () => {
    if (!taskInput.trim() || !canEdit()) return;
    
    const newTask = {
      id: String(Date.now()),
      name: taskInput.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    console.log('添加新任務:', newTask);
    
    // 更新本地狀態
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTaskInput('');
    
    try {
      // 更新資料庫，確保所有任務的 ID 都是字串類型
      const tasksToUpdate = updatedTasks.map(task => ({
        ...task,
        id: String(task.id)
      }));
      
    // 更新資料庫
      const result = await wishService.updateWish(String(wishId), {
        tasks: tasksToUpdate
      });
      
      if (!result) {
        throw new Error('更新任務失敗');
      }
      
      // 更新總進度
      await calculateCorrectProgress({
        ...wish,
        tasks: tasksToUpdate
      });
      
    } catch (error) {
      console.error('保存任務時出錯:', error);
      alert('無法保存任務，請稍後再試');
      // 恢復原始任務
      setTasks(tasks);
    }
  };
  
  // 處理任務完成狀態切換
  const handleTaskToggle = async (index) => {
    if (!canEdit() || index < 0 || index >= tasks.length) return;
    
    const updatedTasks = tasks.map(task => ({
      ...task,
      id: String(task.id),
      completed: Boolean(task.completed),
      completedDate: task.completed ? new Date().toISOString() : null
    }));
    
    const taskToUpdate = { ...updatedTasks[index] };
    taskToUpdate.completed = !taskToUpdate.completed;
    taskToUpdate.completedDate = taskToUpdate.completed ? new Date().toISOString() : null;
    updatedTasks[index] = taskToUpdate;
    
    setTasks(updatedTasks);
    
    try {
      const result = await wishService.updateWish(String(wishId), {
        tasks: updatedTasks
      });
      
      if (!result) {
        throw new Error('更新任務狀態失敗');
      }
      
      await calculateCorrectProgress({
        ...wish,
        id: String(wish.id),
        tasks: updatedTasks
      });
      
    } catch (error) {
      console.error('更新任務狀態時出錯:', error);
      alert('無法更新任務狀態，請稍後再試');
      setTasks(tasks);
    }
  };
  
  // 處理移除任務
  const handleRemoveTask = async (index) => {
    if (!canEdit() || index < 0 || index >= tasks.length) return;
    
    if (!window.confirm('確定要刪除這個任務嗎？')) {
      return;
    }
    
    const updatedTasks = tasks.filter((_, i) => i !== index).map(task => ({
      ...task,
      id: String(task.id)
    }));
    
    setTasks(updatedTasks);
    
    try {
      const result = await wishService.updateWish(String(wishId), {
        tasks: updatedTasks
      });
      
      if (!result) {
        throw new Error('刪除任務失敗');
      }
      
      await calculateCorrectProgress({
        ...wish,
        id: String(wish.id),
        tasks: updatedTasks
      });
      
    } catch (error) {
      console.error('刪除任務時出錯:', error);
      alert('無法刪除任務，請稍後再試');
      setTasks(tasks);
    }
  };
  
  // 修改進度追蹤區域的按鈕顯示邏輯
  const canEdit = () => {
    return isCreator;
  };
  
  // 添加 useEffect 來監視 selectedDate 和 progressByDate 的變化
  useEffect(() => {
    console.log('Selected date changed:', selectedDate);
    console.log('Current progress by date:', progressByDate);
    
    // 檢查選擇日期的進度數據是否存在
    const dateProgress = progressByDate[selectedDate];
    if (dateProgress) {
      console.log('Progress for selected date:', dateProgress);
    } else {
      console.log('No progress data for selected date');
    }
  }, [selectedDate, progressByDate]);
  
  // 確保 wish 有 dailyGoals 和 weeklyGoals
  useEffect(() => {
    if (wish && !loading) {
      // 如果願望對象存在但缺少 dailyGoals 或 weeklyGoals，添加默認值
      if (!wish.dailyGoals || !wish.weeklyGoals) {
        console.log('Adding default goals to wish object', wish);
        setWish(prev => ({
          ...prev,
          id: String(prev.id),
          userId: String(prev.userId),
          dailyGoals: prev.dailyGoals || ['寫10篇筆記', '練習口說10分鐘'],
          weeklyGoals: prev.weeklyGoals || ['上課1小時', '完成一章作業']
        }));
      }
    }
  }, [wish, loading]);

  // 監聽 wish 對象變化，確保 tasks 狀態同步
  useEffect(() => {
    if (wish && !loading) {
      console.log('監聽願望對象變化，ID:', String(wish.id));
      // 這裡不再自動同步 wish.tasks 到 tasks 狀態
      // 因為我們在 fetchWishData 中已經處理了任務數據的解析和設置
    }
  }, [String(wish?.id), loading]);

  // 添加新的 useEffect 以確保在頁面刷新或重新訪問時能加載正確的任務數據
  useEffect(() => {
    // 當 wishId 改變時，重新獲取數據
    if (wishId) {
      console.log('願望ID變更，重新獲取數據:', wishId);
      fetchWishData();
    }
  }, [wishId]);
  
  // 修正問題2和3: 確保TDL項目新增功能正常工作並持久化
  const handleAddTdlItem = async () => {
    if (!canEdit() || !progressInput.trim()) {
      console.warn('無法添加TDL項目: 用戶無法編輯或輸入為空');
      return;
    }
    
    try {
      // 直接獲取最新的wish資料
      const wishDoc = await wishService.getWish(String(wishId));
      if (!wishDoc) {
        console.error('無法獲取願望資料');
        throw new Error('無法獲取願望資料');
      }
      
      // 使用服務器上的最新資料，確保 ID 是字串類型
      const currentWish = {
        ...wishDoc,
        id: String(wishDoc.id)
      };
      
      // 確保數組存在
      if (!currentWish.dailyGoals) currentWish.dailyGoals = [];
      if (!currentWish.weeklyGoals) currentWish.weeklyGoals = [];
      
      // 將新的TDL項目添加到適當的數組中
      const trimmedInput = progressInput.trim();
      if (progressType === 'daily') {
        currentWish.dailyGoals.push(trimmedInput);
      } else {
        currentWish.weeklyGoals.push(trimmedInput);
      }
      
      console.log('正在保存更新的願望資料:', currentWish);
      
      // 保存完整的願望對象到資料庫
      const updateResult = await wishService.updateWish(String(wishId), {
        dailyGoals: currentWish.dailyGoals,
        weeklyGoals: currentWish.weeklyGoals
      });
      
      if (!updateResult) {
        throw new Error('保存TDL項目失敗');
      }
      
      console.log('TDL項目添加成功');
      
      // 更新本地狀態
      setWish(currentWish);
      
      // 關閉模態窗口並清除輸入
      setProgressInput('');
      setShowAddProgressModal(false);
      
      // 顯示成功消息
      alert(`${progressType === 'daily' ? '每日' : '每週'}TDL項目已成功新增`);
      
      // 強制重新載入頁面資料
      await fetchWishData();
      
    } catch (error) {
      console.error('新增TDL項目失敗:', error);
      alert('新增TDL項目失敗，請稍後再試');
    }
  };
  
  return (
    <div className="content-area" style={{ paddingBottom: '150px' }}>
      {/* 頂部功能區及加載狀態 */}
      {loading || authLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">載入願望中...</div>
        </div>
      ) : authLoading ? (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">加載用戶信息時出現錯誤</div>
          <button onClick={() => navigate(-1)} className="error-button">返回</button>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{error}</div>
          <button onClick={() => navigate(-1)} className="error-button">返回</button>
        </div>
      ) : (
        <>
          {/* 新增頁籤切換按鈕 */}
          <div className="tabs-container" style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            gap: '10px'
          }}>
            <button 
              className={`tab-btn ${activeTab === 'basicInfo' ? 'active' : ''}`}
              onClick={() => setActiveTab('basicInfo')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'basicInfo' ? 'var(--primary-color)' : '#f5f5f5',
                color: activeTab === 'basicInfo' ? 'white' : 'var(--text-primary)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-info-circle"></i>
              基本資訊
            </button>
            <button 
              className={`tab-btn ${activeTab === 'todoList' ? 'active' : ''}`}
              onClick={() => setActiveTab('todoList')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'todoList' ? 'var(--primary-color)' : '#f5f5f5',
                color: activeTab === 'todoList' ? 'white' : 'var(--text-primary)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-list-check"></i>
              To-Do List
            </button>
            <button 
              className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'privacy' ? 'var(--primary-color)' : '#f5f5f5',
                color: activeTab === 'privacy' ? 'white' : 'var(--text-primary)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-lock"></i>
              隱私設定
            </button>
          </div>
          
          {/* 基本資訊區域 - 只在對應頁籤激活時顯示 */}
          {activeTab === 'basicInfo' && (
            <>
              {/* 第一區: 願望基本內容 */}
          <div className="wish-card" style={{ 
            padding: '30px',
            marginBottom: '20px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            maxWidth: '800px',
            margin: '0 auto 20px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ 
              margin: '0 0 25px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingBottom: '15px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <i className="fas fa-star" style={{ color: 'var(--primary-color)' }}></i>
                  願望資訊
            </h3>

                {/* 願望標題 */}
                <div className="wish-title-section" style={{
                  marginBottom: '20px'
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '10px'
                  }}>
                    {wish.title || '載入中...'}
                  </h2>
            </div>

            {/* 願望描述 */}
                <div className="wish-description" style={{
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}>
                  <p>{wish.description || '這個願望還沒有描述...'}</p>
            </div>

                {/* 願望詳細信息 */}
                <div className="wish-details-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  {/* 類別 */}
                  <div className="wish-detail-item">
                    <span className="detail-label" style={{
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: '5px'
                    }}>類別</span>
                    <span className="detail-value" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span className="category-icon">{getCategoryIcon(wish.category)}</span>
                      {wish.category || '未分類'}
                    </span>
                  </div>
                  
                  {/* 優先級 */}
                  <div className="wish-detail-item">
                    <span className="detail-label" style={{
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: '5px'
                    }}>優先級</span>
                    <span className="detail-value" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span className="priority-dot" style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getPriorityColor(wish.priority)
                      }}></span>
                      {getPriorityText(wish.priority)}
                    </span>
                  </div>
                  
                  {/* 創立時間 */}
                  <div className="wish-detail-item">
                    <span className="detail-label" style={{
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: '5px'
                    }}>創立時間</span>
                    <span className="detail-value">
                      {wish.createdAt ? new Date(wish.createdAt).toLocaleDateString() : '未知'}
                    </span>
                  </div>
                  
                  {/* 結束時間 */}
                  <div className="wish-detail-item">
                    <span className="detail-label" style={{
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: '5px'
                    }}>預計結束時間</span>
                    <span className="detail-value">
                      {wish.endDate ? new Date(wish.endDate).toLocaleDateString() : '未設定'}
                    </span>
                  </div>
            </div>

            {/* 進度條 */}
            <div className="wish-card" style={{ 
              padding: '25px',
              marginBottom: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              maxWidth: '800px',
              margin: '0 auto 20px',
              boxSizing: 'border-box',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <div className="progress-title" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-chart-line" style={{ color: 'var(--primary-color)', fontSize: '18px' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    總體進度
                  </h2>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--primary-color)'
                }}>
                  {Math.round(wish.progress || 100)}%
                </div>
              </div>
              <div className="progress-bar-container" style={{
                marginTop: '20px'
              }}>
                <div className="progress-bar-bg" style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div className="progress-bar-fill" style={{
                    width: `${Math.round(wish.progress || 100)}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: '6px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

              {/* 第二區: 願望指數與評論 */}
              <div className="wish-card" style={{ 
                padding: '30px',
                marginBottom: '20px',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                maxWidth: '800px',
                margin: '0 auto 20px',
                boxSizing: 'border-box'
              }}>
                <h3 style={{ 
                  margin: '0 0 25px 0',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <i className="fas fa-chart-line" style={{ color: 'var(--primary-color)' }}></i>
                  願望指數與互動
                </h3>

                {/* 願望指數統計 */}
                <div className="wish-stats-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '15px',
                  marginBottom: '30px',
                  textAlign: 'center'
                }}>
                  {/* 人氣 */}
                  <div className="wish-stat-item" style={{
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px'
                  }}>
                    <div className="stat-icon" style={{
                      fontSize: '24px',
                      marginBottom: '5px',
                      color: '#6c5ce7'
                    }}>
                      <i className="fas fa-eye"></i>
                    </div>
                    <div className="stat-value" style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      marginBottom: '5px'
                    }}>
                      {wish.viewCount || 0}
                    </div>
                    <div className="stat-label" style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      人氣
                    </div>
                  </div>

                  {/* 愛心 */}
                  <div className="wish-stat-item" style={{
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px'
                  }}>
                    <div className="stat-icon" style={{
                      fontSize: '24px',
                      marginBottom: '5px',
                      color: '#e84393'
                    }}>
                      <i className="fas fa-heart"></i>
                    </div>
                    <div className="stat-value" style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      marginBottom: '5px'
                    }}>
                      {wish.likeCount || 0}
                    </div>
                    <div className="stat-label" style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      愛心
                    </div>
                  </div>

                  {/* 被轉用 */}
                  <div className="wish-stat-item" style={{
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px'
                  }}>
                    <div className="stat-icon" style={{
                      fontSize: '24px',
                      marginBottom: '5px',
                      color: '#00b894'
                    }}>
                      <i className="fas fa-copy"></i>
                    </div>
                    <div className="stat-value" style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      marginBottom: '5px'
                    }}>
                      {wish.cloneCount || 0}
                    </div>
                    <div className="stat-label" style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      被轉用
                    </div>
                  </div>

                  {/* 評論數 */}
                  <div className="wish-stat-item" style={{
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px'
                  }}>
                    <div className="stat-icon" style={{
                      fontSize: '24px',
                      marginBottom: '5px',
                      color: '#fdcb6e'
                    }}>
                      <i className="fas fa-comment"></i>
                    </div>
                    <div className="stat-value" style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      marginBottom: '5px'
                    }}>
                      {comments.length || 0}
                    </div>
                    <div className="stat-label" style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      評論數
                    </div>
                  </div>
                </div>

                {/* 評論區 */}
                <div className="comments-section">
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '15px'
                  }}>
                    <i className="fas fa-comments" style={{ marginRight: '8px' }}></i>
                    評論區
                  </h4>

                  {/* 添加評論 */}
                  {user && (
                    <div className="add-comment" style={{
                      marginBottom: '20px'
                    }}>
                      <form onSubmit={handleCommentSubmit} style={{
                        display: 'flex',
                        gap: '10px'
                      }}>
                        <input 
                          type="text" 
                          value={comment} 
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="添加評論..."
                          style={{
                            flex: 1,
                            padding: '10px 15px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            fontSize: '14px'
                          }}
                        />
                        <button 
                          type="submit"
                          disabled={!comment.trim()}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            opacity: comment.trim() ? 1 : 0.6
                          }}
                        >
                          發送
                        </button>
                      </form>
                    </div>
                  )}

                  {/* 評論列表 */}
                  <div className="comments-list">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div 
                          key={comment.id} 
                          className="comment-item"
                          style={{
                            padding: '15px',
                            borderBottom: '1px solid var(--border-color)',
                            marginBottom: '15px'
                          }}
                        >
                          <div className="comment-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <span className="comment-avatar" style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f2f2f2',
                              marginRight: '10px',
                              fontSize: '16px'
                            }}>
                              {comment.avatar || '👤'}
                            </span>
                            <span className="comment-username" style={{
                              fontWeight: '600',
                              marginRight: '10px'
                            }}>
                              {comment.username || '未知用戶'}
                            </span>
                            <span className="comment-date" style={{
                              fontSize: '12px',
                              color: 'var(--text-secondary)'
                            }}>
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="comment-content">
                            {comment.content}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-comments" style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: 'var(--text-secondary)'
                      }}>
                        還沒有評論，來添加第一條評論吧！
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* To-Do List 區域 - 只在對應頁籤激活時顯示 */}
          {activeTab === 'todoList' && (
          <div className="wish-card" style={{ 
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            maxWidth: '800px',
            margin: '0 auto 20px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-list-check"></i>
              願望To-Do List (TDL)
            </h3>

            {/* 步驟列表 */}
            <div className="steps-section">
              {/* ... existing code ... */}
            </div>

            {/* 日常目標與每週目標 */}
            <div className="goals-section">
                {/* 日常目標 */}
                {wish.dailyGoals && wish.dailyGoals.length > 0 && (
                  <div className="progress-items">
                    <h5>每日進度項目</h5>
                    <ul>
                      {wish.dailyGoals.map((goal, index) => {
                        // 使用字串索引
                        const indexStr = String(index);
                        // 獲取選定日期的進度
                        const dateProgress = progressByDate[selectedDate];
                        // 檢查該日期是否有此目標的進度記錄，使用字串索引
                        const completed = dateProgress && 
                                         dateProgress.daily && 
                                         dateProgress.daily[indexStr];
                        
                        return (
                          <li key={`daily-${indexStr}`} className={completed ? 'completed' : ''}>
                            <span className="goal-text">{goal}</span>
                            {canEdit() && (
                              <button 
                                className={`toggle-btn ${completed ? 'completed' : ''}`}
                                onClick={() => handleToggleProgress(indexStr, true)}
                                aria-label={`Toggle completion for ${goal}`}
                              >
                                {completed ? '✓' : '○'}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* 每週目標 */}
                {wish.weeklyGoals && wish.weeklyGoals.length > 0 && (
                  <div className="progress-items">
                    <h5>每週進度項目</h5>
                    <ul>
                      {wish.weeklyGoals.map((goal, index) => {
                        // 使用字串索引
                        const indexStr = String(index);
                        // 獲取選定日期的進度
                        const dateProgress = progressByDate[selectedDate];
                        // 檢查該日期是否有此目標的進度記錄，使用字串索引
                        const completed = dateProgress && 
                                         dateProgress.weekly && 
                                         dateProgress.weekly[indexStr];
                        
                        return (
                          <li key={`weekly-${indexStr}`} className={completed ? 'completed' : ''}>
                            <span className="goal-text">{goal}</span>
                            {canEdit() && (
                              <button 
                                className={`toggle-btn ${completed ? 'completed' : ''}`}
                                onClick={() => handleToggleProgress(indexStr, false)}
                                aria-label={`Toggle completion for ${goal}`}
                              >
                                {completed ? '✓' : '○'}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
            </div>

            {/* 日曆視圖或進度日誌 */}
            <div className="calendar-section">
              {/* ... existing code ... */}
            </div>
          </div>
          )}

          {/* 隱私設定區域 - 只在對應頁籤激活時顯示 */}
          {activeTab === 'privacy' && (
          <div className="wish-card" style={{ 
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            maxWidth: '800px',
            margin: '0 auto 20px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                <i className="fas fa-lock"></i>
                隱私設定
            </h3>

            {/* 優先級設定 */}
            <div className="priority-section">
              {/* ... existing code ... */}
            </div>

            {/* 公開設定 */}
            <div className="visibility-section">
              {/* ... existing code ... */}
            </div>

            {/* 留言區域 */}
            <div className="comments-section">
              {/* ... existing code ... */}
            </div>
          </div>
          )}
        </>
      )}
    </div>
  );
}

export default WishDetail; 