import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

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

function WishDetail() {
  const { wishId } = useParams();
  const navigate = useNavigate();
  const { wishService, commentService, stepService, isLoading: dbLoading } = useDatabase();
  const { texts } = useLanguage();
  const { user } = useAuth();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  
  // 評論數據
  const [comments, setComments] = useState([]);
  
  // 進度數據
  const [progress, setProgress] = useState([]);
  
  // 相關願望
  const [relatedWishes, setRelatedWishes] = useState([]);
  
  // 步驟數據
  const [steps, setSteps] = useState([]);
  
  // 目標設定
  const [goals, setGoals] = useState({
    daily: '',
    weekly: '',
    taskName: '',
    taskDueDate: ''
  });
  
  // 隱私設定
  const [privacySettings, setPrivacySettings] = useState({
    isPublic: true,
    friendsOnly: false,
    isAnonymous: false
  });
  
  // 進度記錄
  const [progressLog, setProgressLog] = useState([]);
  
  // 新步驟
  const [newStep, setNewStep] = useState('');
  
  // 階段任務相關狀態
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  
  // 進度追蹤區
  const [dailyProgress, setDailyProgress] = useState({});
  const [weeklyProgress, setWeeklyProgress] = useState({});
  
  // 新增進度相關的狀態
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [progressInput, setProgressInput] = useState('');
  const [progressType, setProgressType] = useState('daily'); // 'daily' or 'weekly'
  
  // 新增是否為創建者的狀態
  const [isCreator, setIsCreator] = useState(false);
  
  // 添加日期相關狀態
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [progressByDate, setProgressByDate] = useState({});
  
  // 從資料庫獲取願望數據
  useEffect(() => {
    const fetchWishData = async () => {
        setLoading(true);
        
      try {
        // 從資料庫取得願望資料
        const wishData = await wishService.getWish(wishId);
        
        if (wishData) {
          console.log('願望數據:', wishData);
          setWish(wishData);
          
          // 確保有有效的目標數據
          if (!wishData.dailyGoals || !wishData.dailyGoals.length) {
            wishData.dailyGoals = ['寫10篇筆記', '練習口說10分鐘'];
          }
          if (!wishData.weeklyGoals || !wishData.weeklyGoals.length) {
            wishData.weeklyGoals = ['上課1小時', '完成一章作業'];
          }
          
          // 加載進度歷史
          if (wishData.progressLog && Array.isArray(wishData.progressLog)) {
            console.log('加載進度歷史:', wishData.progressLog);
            setProgressLog(wishData.progressLog);
          } else {
            console.log('沒有進度歷史數據，初始化空數組');
            setProgressLog([]);
          }
          
          // 檢查用戶權限
          if (user && wishData.userId) {
            const isCreator = user.id && String(user.id) === String(wishData.userId);
            console.log('用戶權限檢查:', { userId: user.id, wishUserId: wishData.userId, isCreator });
            setIsCreator(isCreator);
          }
          
          // 獲取評論
          const comments = await commentService.getComments(wishId, 'wish');
          setComments(comments);
          
          // 獲取步驟
          const steps = await stepService.getSteps(wishId);
          setSteps(steps);
          
          // 加載階段任務
          if (wishData.tasks && Array.isArray(wishData.tasks)) {
            console.log('加載階段任務:', wishData.tasks);
            setTasks(wishData.tasks);
          }
          
          // 計算正確的進度
          calculateCorrectProgress(wishData);
          
        } else {
          console.log('找不到願望，使用示例數據');
          
          // 示例願望數據
          setWish({
            id: wishId,
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
            userId: user ? user.id : 1
          });
          
          setProgressLog([]);
          setIsCreator(true);
        }
      } catch (error) {
        console.error('獲取願望數據失敗:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishData();
  }, [wishId, navigate, wishService, commentService, stepService, user]);
  
  // 計算正確的進度百分比（從創建到預計完成日期之間的進度）
  const calculateCorrectProgress = (wishData) => {
    if (!wishData) return;
    
    try {
      // 獲取創建日期和預計完成日期
      const createdAt = new Date(wishData.createdAt);
      const dueDate = wishData.dueDate ? new Date(wishData.dueDate) : new Date();
      
      // 計算從創建到預計完成日期之間的總天數
      const totalDays = Math.max(1, Math.ceil((dueDate - createdAt) / (1000 * 60 * 60 * 24)));
      
      // 計算需要完成的總進度項目數量
      const dailyItems = (wishData.dailyGoals?.length || 0) * totalDays;
      const weeklyItems = (wishData.weeklyGoals?.length || 0) * Math.ceil(totalDays / 7);
      const taskItems = wishData.tasks?.length || 0;
      
      const totalItems = dailyItems + weeklyItems + taskItems;
      
      // 計算已完成的項目
      const completedDaily = Object.values(dailyProgress).filter(Boolean).length;
      const completedWeekly = Object.values(weeklyProgress).filter(Boolean).length;
      const completedTasks = wishData.tasks?.filter(task => task.completed).length || 0;
      
      const totalCompleted = completedDaily + completedWeekly + completedTasks;
      
      // 計算進度百分比
      let progressPercentage = 0;
      if (totalItems > 0) {
        progressPercentage = Math.round((totalCompleted / totalItems) * 100);
      }
      
      console.log('進度計算:', {
        createdAt,
        dueDate,
        totalDays,
        dailyItems,
        weeklyItems,
        taskItems,
        totalItems,
        completedDaily,
        completedWeekly,
        completedTasks,
        totalCompleted,
        progressPercentage
      });
      
      // 更新願望的進度
      wishService.updateWish(wishId, { progress: progressPercentage });
      
      // 更新本地狀態
      setWish(prev => ({
        ...prev,
        progress: progressPercentage
      }));
      
    } catch (error) {
      console.error('計算進度百分比失敗:', error);
    }
  };
  
  // 從資料庫加載進度資料
  useEffect(() => {
    const loadProgress = async () => {
      try {
        console.log('正在加載願望進度數據:', wishId);
        console.log('當前選定日期:', selectedDate);
        
        // 嘗試從資料庫獲取進度數據
        const progressData = await wishService.getWishProgress(wishId);
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
            progressByDateMap[date].daily[goalId] = timestamp;
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
            progressByDateMap[date].weekly[goalId] = timestamp;
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
  
  const handleToggleProgress = async (goalId, isDaily) => {
    console.log('======= 切換進度狀態 =======');
    console.log('參數:', { goalId, isDaily, selectedDate });
    
    try {
      // 目前進度的狀態集
      const progressMap = isDaily ? dailyProgress : weeklyProgress;
      const setProgressMap = isDaily ? setDailyProgress : setWeeklyProgress;
      
      // 目前的時間戳
      const now = new Date().toISOString();
      
      // 檢查選定日期的進度狀態
      console.log('目前進度狀態:', progressByDate);
      const currentDateProgress = progressByDate[selectedDate] || { daily: {}, weekly: {} };
      const progressType = isDaily ? 'daily' : 'weekly';
      const currentTypeProgress = currentDateProgress[progressType] || {};
      
      // 檢查目標是否已完成
      const isCompleted = currentTypeProgress[goalId];
      console.log('目前完成狀態:', isCompleted ? '已完成' : '未完成');
      
      // 創建進度備份，以防更新失敗時恢復
      const originalProgress = { ...progressMap };
      const originalProgressByDate = { ...progressByDate };
      
      // 1. 更新總體進度狀態 - 這是跨日期的總體狀態
      const newProgress = {
        ...progressMap,
        [goalId]: isCompleted ? null : now
      };
      console.log('新的進度狀態:', newProgress);
      
      // 2. 更新按日期組織的進度資料 - 這是特定日期的狀態
      const updatedProgressByDate = {
        ...progressByDate,
        [selectedDate]: {
          ...progressByDate[selectedDate] || {},
          [progressType]: {
            ...(progressByDate[selectedDate]?.[progressType] || {}),
            [goalId]: isCompleted ? null : now
          }
        }
      };
      console.log('更新後的進度日期數據:', updatedProgressByDate);
      
      // 3. 如果完成一個項目，同時將其添加到進度歷史中
      if (!isCompleted) {  // 只有從未完成變為完成時才添加到歷史
        const taskName = isDaily 
          ? wish.dailyGoals[goalId] 
          : wish.weeklyGoals[goalId];
        
        // 添加到進度歷史
        const newProgressLog = [
          ...progressLog,
          {
            date: now,
            task: taskName,
            type: isDaily ? '每日進度' : '每週進度'
          }
        ];
        console.log('新增進度歷史:', newProgressLog);
        setProgressLog(newProgressLog);
        
        // 更新資料庫中的進度歷史
        try {
          await wishService.updateWish(wishId, { progressLog: newProgressLog });
        } catch (logError) {
          console.error('更新進度歷史失敗:', logError);
        }
      }
      
      // 先更新本地狀態，讓 UI 立即反應
      setProgressMap(newProgress);
      setProgressByDate(updatedProgressByDate);
      
      // 嘗試更新資料庫
      try {
        // 更新資料庫（先將整個進度對象保存）
        const updateResult = await wishService.updateWishProgress(wishId, {
          ...(isDaily 
            ? { dailyProgress: newProgress } 
            : { weeklyProgress: newProgress })
        });
        
        console.log('資料庫更新成功:', updateResult);
        
        // 更新進度計算
        calculateCorrectProgress(wish);
        
      } catch (dbError) {
        // 資料庫更新失敗，恢復本地狀態
        console.error('資料庫更新失敗:', dbError);
        setProgressMap(originalProgress);
        setProgressByDate(originalProgressByDate);
        alert('更新進度失敗，請稍後再試');
        return;
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
      // 創建新評論
      const newComment = {
        id: Date.now(),
        wishId: parseInt(wishId) || wishId,
        userId: user.id,
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
          completed,
          completedDate: completed ? new Date().toISOString().split('T')[0] : null
        };
      }
      return step;
    }));
  };
  
  // 處理添加新步驟
  const handleAddStep = (e) => {
    e.preventDefault();
    
    if (!canEdit() || !newStep.trim()) return;
    
    const newStepObj = {
      id: Date.now(),
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
  const handlePrivacyChange = (e) => {
    if (!canEdit()) return;
    
    const { name, checked } = e.target;
    
    // 特殊處理互斥選項
    if (name === 'isPublic' && checked) {
      setPrivacySettings({
        isPublic: true,
        friendsOnly: false,
        isAnonymous: false
      });
    } else if (name === 'friendsOnly' && checked) {
      setPrivacySettings({
        isPublic: false,
        friendsOnly: true,
        isAnonymous: false
      });
    } else if (name === 'isAnonymous') {
      setPrivacySettings(prev => ({
        ...prev,
        isAnonymous: checked
      }));
    }
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
  
  const handleAddProgressLog = (e) => {
    e.preventDefault();
    
    if (!canEdit() || !newProgressLog.progress || !newProgressLog.note.trim()) return;
    
    const newLog = {
      id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      progress: parseInt(newProgressLog.progress),
      note: newProgressLog.note
    };
    
    setProgressLog([newLog, ...progressLog]);
    setNewProgressLog({ progress: '', note: '' });
    
    // 更新願望的總進度
    if (wish) {
      setWish({
        ...wish,
        progress: parseInt(newProgressLog.progress)
      });
    }
  };
  
  // 計算完成的步驟百分比
  const calculateStepsProgress = () => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };
  
  // 處理添加任務
  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    
    const newTask = {
      name: taskInput.trim(),
      completed: false
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTaskInput('');
    
    // 更新資料庫
    if (wish) {
      wishService.updateWish(wishId, { tasks: updatedTasks });
      
      // 重新計算進度
      calculateCorrectProgress({
        ...wish,
        tasks: updatedTasks
      });
    }
  };
  
  // 處理任務完成狀態切換
  const handleTaskToggle = (index) => {
    if (!canEdit()) return;
    
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    
    // 更新資料庫
    if (wish) {
      wishService.updateWish(wishId, { tasks: newTasks });
      
      // 重新計算進度
      calculateCorrectProgress({
        ...wish,
        tasks: newTasks
      });
    }
  };
  
  // 處理移除任務
  const handleRemoveTask = (index) => {
    if (!canEdit()) return;
    
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    
    // 更新資料庫
    if (wish) {
      wishService.updateWish(wishId, { tasks: newTasks });
      
      // 重新計算進度
      calculateCorrectProgress({
        ...wish,
        tasks: newTasks
      });
    }
  };
  
  // 處理新增進度
  const handleAddProgress = () => {
    if (!canEdit() || !progressInput.trim()) return;
    
    if (progressType === 'daily') {
      // 複製現有的每日目標，並添加新目標
      const updatedDailyGoals = [...(wish.dailyGoals || []), progressInput];
      
      // 更新願望的每日目標
      wishService.updateWish(wishId, {
        dailyGoals: updatedDailyGoals
      }).then(() => {
        // 更新本地狀態
        setWish(prevWish => ({
          ...prevWish,
          dailyGoals: updatedDailyGoals
        }));
        
        // 清空輸入並關閉模態窗
        setProgressInput('');
        setShowAddProgressModal(false);
      }).catch(error => {
        console.error('更新每日目標失敗:', error);
      });
    } else {
      // 複製現有的每週目標，並添加新目標
      const updatedWeeklyGoals = [...(wish.weeklyGoals || []), progressInput];
      
      // 更新願望的每週目標
      wishService.updateWish(wishId, {
        weeklyGoals: updatedWeeklyGoals
      }).then(() => {
        // 更新本地狀態
        setWish(prevWish => ({
          ...prevWish,
          weeklyGoals: updatedWeeklyGoals
        }));
        
        // 清空輸入並關閉模態窗
        setProgressInput('');
        setShowAddProgressModal(false);
      }).catch(error => {
        console.error('更新每週目標失敗:', error);
      });
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
          dailyGoals: prev.dailyGoals || ['寫10篇筆記', '練習口說10分鐘'],
          weeklyGoals: prev.weeklyGoals || ['上課1小時', '完成一章作業']
        }));
      }
    }
  }, [wish, loading]);
  
  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>載入中...</div>
      </div>
    );
  }
  
  if (!wish) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>找不到願望</div>
      </div>
    );
  }
  
  return (
    <div className="content-area">
      {/* 頂部返回與下一個按鈕 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            width: '48%',
            backgroundColor: 'var(--primary-color)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <i className="fas fa-arrow-left"></i>
          返回首頁
        </button>
        {isCreator && (
          <button
            onClick={async () => {
              let currentId = parseInt(wishId);
              if (!isNaN(currentId)) {
                try {
                  // 嘗試獲取下一個願望
                  const nextWish = await wishService.getWish(currentId + 1);
                  
                  if (nextWish) {
                    navigate(`/wish-detail/${currentId + 1}`);
                  } else {
                    // 沒有下一個願望，顯示提示
                    alert('已到最新的願望啦~');
                  }
                } catch (error) {
                  console.error('獲取下一個願望失敗:', error);
                  alert('已到最新的願望啦~');
                }
              } else {
                navigate('/home');
              }
            }}
            style={{
          display: 'flex', 
          alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              width: '48%',
              backgroundColor: 'var(--primary-color)',
              border: 'none',
            borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            下一個願望
            <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>
      
      {/* 標籤列 - 移到頂部 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px',
        padding: '8px 0'
      }}>
        <button 
          style={{ 
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: activeTab === 'details' ? 'var(--primary-color)' : '#F0F2F5',
            color: activeTab === 'details' ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: activeTab === 'details' ? '600' : '500',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'details' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            width: '100%'
          }}
          onClick={() => setActiveTab('details')}
        >
          詳細資訊
        </button>
        
        <button 
          style={{ 
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: activeTab === 'steps' ? 'var(--primary-color)' : '#F0F2F5',
            color: activeTab === 'steps' ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: activeTab === 'steps' ? '600' : '500',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'steps' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            width: '100%'
          }}
          onClick={() => setActiveTab('steps')}
        >
          進度
        </button>
        
        <button 
          style={{ 
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: activeTab === 'goals' ? 'var(--primary-color)' : '#F0F2F5',
            color: activeTab === 'goals' ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: activeTab === 'goals' ? '600' : '500',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'goals' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            width: '100%'
          }}
          onClick={() => setActiveTab('goals')}
        >
          階段任務
        </button>
        
        <button 
          style={{ 
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: activeTab === 'privacy' ? 'var(--primary-color)' : '#F0F2F5',
            color: activeTab === 'privacy' ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: activeTab === 'privacy' ? '600' : '500',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'privacy' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            width: '100%'
          }}
          onClick={() => setActiveTab('privacy')}
        >
          隱私設定
        </button>
      </div>
      
      {/* 願望詳情卡片 */}
      <div className="wish-card" style={{ 
        padding: '24px',
        marginBottom: '24px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        {/* 願望標題和類別 */}
        <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
            gap: '8px',
            marginBottom: '8px'
          }}>
            {getCategoryIcon(wish.category)}
            <span style={{ 
              color: 'var(--text-secondary)',
              fontSize: '14px' 
          }}>
            {wish.category}
            </span>
          </div>
          <h1 style={{ 
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
            {wish.title}
          </h1>
        <p style={{ 
            margin: '0',
          fontSize: '16px',
            color: 'var(--text-secondary)',
          lineHeight: '1.5'
        }}>
          {wish.description}
        </p>
      </div>
      
        {/* 日期資訊 */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '16px',
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <i className="far fa-calendar-plus"></i>
            <span>創建於: {new Date(wish.createdAt).toLocaleDateString('zh-TW')}</span>
          </div>
          {wish.dueDate && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="far fa-calendar-check"></i>
              <span>預計完成: {new Date(wish.dueDate).toLocaleDateString('zh-TW')}</span>
          </div>
          )}
        </div>

        {/* 願望標籤 */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {wish.tags && wish.tags.map((tag, index) => (
            <span key={index} style={{
              padding: '4px 12px',
              backgroundColor: 'var(--background-color)',
              borderRadius: '16px',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              #{tag}
            </span>
          ))}
      </div>
      
        {/* 優先級和進度 */}
        <div style={{ 
        display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: `${getPriorityColor(wish.priority)}20`,
            borderRadius: '8px',
            color: getPriorityColor(wish.priority),
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <i className="fas fa-flag" style={{ marginRight: '8px' }}></i>
            {getPriorityText(wish.priority)}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ 
              width: '100px',
              height: '6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${wish.progress || 0}%`,
                height: '100%',
                backgroundColor: 'var(--primary-color)',
                borderRadius: '3px'
              }} />
            </div>
            <span style={{ 
              color: 'var(--primary-color)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {wish.progress || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* 內容區域 */}
      <div className="tab-content">
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
              <p>{wish.description}</p>
              
              <div style={{ marginTop: '15px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>優先級</h3>
                <div style={{ 
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: `${getPriorityColor(wish.priority)}20`,
                  color: getPriorityColor(wish.priority),
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {getPriorityText(wish.priority)}
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>創建時間</h3>
                <div style={{ 
                  fontSize: '14px',
                  color: 'var(--text-secondary)'
                }}>
                  2023-05-10
              </div>
            </div>
            
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>標籤</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {wish.tags && wish.tags.map((tag, index) => (
                    <div 
                      key={index}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '12px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="wish-card" style={{ 
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>評論</h3>
              
              <form onSubmit={handleCommentSubmit} style={{ 
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="添加評論..."
                  style={{ 
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    resize: 'vertical',
                    minHeight: '80px',
                    maxHeight: '200px',
                    fontSize: '14px',
                    backgroundColor: 'var(--background-color)',
                    boxSizing: 'border-box'
                  }}
                ></textarea>
                
                <button 
                  type="submit" 
                  className="primary-btn"
                  style={{ 
                    marginTop: '12px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  disabled={!comment.trim()}
                >
                  發表評論
                </button>
              </form>
              
              <div>
                {comments.map(comment => (
                  <div 
                    key={comment.id}
                    style={{
                      padding: '15px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--background-color)',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ 
                        width: '32px',
                        height: '32px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                        fontSize: '20px'
                      }}>
                        {comment.user.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>{comment.user.name}</div>
                        <div style={{ 
                          fontSize: '12px',
                          color: 'var(--text-secondary)'
                        }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: 'var(--text-primary)'
                    }}>
                      {comment.content}
                    </div>
                    <div style={{ 
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)'
                    }}>
                      <button 
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          color: 'inherit'
                        }}
                      >
                        <i className="far fa-heart"></i>
                        {comment.likes}
                      </button>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          color: 'inherit'
                        }}
                      >
                        <i className="far fa-comment"></i>
                        回覆
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      )}
      
        {activeTab === 'steps' && (
          <div className="steps-tab">
            <div className="wish-card" style={{ 
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '24px'
            }}>
              <div style={{
                marginBottom: '20px'
              }}>
                <h2 style={{ 
                  margin: '0 0 16px 0',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)'
                }}>
                  進度追蹤
                </h2>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}>
                  {/* 日曆按鈕 */}
                  <button
                    onClick={() => {
                      console.log('Calendar button clicked');
                      setShowCalendar(true);
                    }}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: 'white',
                      color: 'var(--primary-color)',
                      border: '1px solid var(--primary-color)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <i className="fas fa-calendar-alt"></i>
                    {new Date(selectedDate).toLocaleDateString('zh-TW')}
                  </button>
                  
                  {/* 新增進度按鈕 */}
                  {canEdit() && (
                    <button
                      onClick={() => setShowAddProgressModal(true)}
                      style={{ 
                        padding: '10px 18px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <i className="fas fa-plus"></i>
                      新增進度
                    </button>
                  )}
                </div>
              </div>

              {/* 每日進度區域 */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  每日進度 - {new Date(selectedDate).toLocaleDateString('zh-TW')}
                </h3>
                {wish?.dailyGoals?.length > 0 ? (
                  <div>
                    {wish.dailyGoals.map((goal, index) => {
                      // 檢查選定日期的進度狀態
                      const dateProgress = progressByDate[selectedDate];
                      const isCompleted = dateProgress && dateProgress.daily && dateProgress.daily[index];
                      
                      return (
                        <div 
                          key={index}
                          onClick={canEdit() ? () => handleToggleProgress(index, true) : undefined}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: isCompleted ? 'var(--primary-light)' : 'white',
                            marginBottom: '8px',
                            border: '1px solid #eee',
                            transition: 'all 0.2s ease',
                            cursor: canEdit() ? 'pointer' : 'default'
                          }}
                        >
                          <div style={{ 
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${isCompleted ? 'var(--primary-color)' : '#ddd'}`,
                            marginRight: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isCompleted ? 'var(--primary-color)' : 'white',
                            transition: 'all 0.2s ease'
                          }}>
                            {isCompleted && (
                              <i className="fas fa-check" style={{ color: 'white', fontSize: '12px' }} />
                            )}
                          </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                              color: isCompleted ? 'var(--primary-color)' : 'var(--text-primary)',
                              marginRight: '8px',
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              transition: 'all 0.2s ease'
                            }}>
                              {goal}
                      </div>
                            {isCompleted && (
                              <div style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                marginTop: '4px'
                              }}>
                                完成於 {new Date(isCompleted).toLocaleString('zh-TW')}
                        </div>
                      )}
                    </div>
                  </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center',
                    padding: '20px',
                    color: 'var(--text-secondary)',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    尚未設定每日進度目標
                  </div>
                )}
              </div>
              
              {/* 每週進度區域 */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  每週進度 - {new Date(selectedDate).toLocaleDateString('zh-TW')}
                </h3>
                {wish?.weeklyGoals?.length > 0 ? (
                  <div>
                    {wish.weeklyGoals.map((goal, index) => {
                      // 檢查選定日期的進度狀態
                      const dateProgress = progressByDate[selectedDate];
                      const isCompleted = dateProgress && dateProgress.weekly && dateProgress.weekly[index];
                      
                      return (
                        <div 
                          key={index}
                          onClick={canEdit() ? () => handleToggleProgress(index, false) : undefined}
                style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                      borderRadius: '8px',
                            backgroundColor: isCompleted ? 'var(--primary-light)' : 'white',
                            marginBottom: '8px',
                            border: '1px solid #eee',
                            transition: 'all 0.2s ease',
                            cursor: canEdit() ? 'pointer' : 'default'
                          }}
                        >
                          <div style={{ 
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${isCompleted ? 'var(--primary-color)' : '#ddd'}`,
                            marginRight: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isCompleted ? 'var(--primary-color)' : 'white',
                            transition: 'all 0.2s ease'
                          }}>
                            {isCompleted && (
                              <i className="fas fa-check" style={{ color: 'white', fontSize: '12px' }} />
                            )}
            </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              color: isCompleted ? 'var(--primary-color)' : 'var(--text-primary)',
                              marginRight: '8px',
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              transition: 'all 0.2s ease'
                            }}>
                              {goal}
            </div>
                            {isCompleted && (
                              <div style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                marginTop: '4px'
                              }}>
                                完成於 {new Date(isCompleted).toLocaleString('zh-TW')}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center',
                    padding: '20px',
                    color: 'var(--text-secondary)',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    尚未設定每週進度目標
                  </div>
                )}
              </div>
            </div>
              
            <div className="wish-card" style={{ 
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                marginBottom: '20px',
                color: 'var(--text-primary)',
                fontWeight: 'bold'
              }}>進度歷史</h3>
              
              {/* 移除現有的進度輸入區域，替換為進度完成歷史 */}
              {Object.entries({...dailyProgress, ...weeklyProgress}).length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {Object.entries({...dailyProgress, ...weeklyProgress})
                    .filter(([_, timestamp]) => timestamp) // 只顯示已完成的項目
                    .sort((a, b) => new Date(b[1]) - new Date(a[1])) // 按完成時間降序排序
                    .map(([goalId, timestamp]) => {
                      // 判斷是每日還是每週目標
                      const isDailyGoal = Object.keys(dailyProgress).includes(goalId);
                      const goalIndex = parseInt(goalId);
                      const goalText = isDailyGoal 
                        ? wish.dailyGoals[goalIndex] 
                        : wish.weeklyGoals[goalIndex];
                      
                      return (
                        <div 
                          key={`${isDailyGoal ? 'daily' : 'weekly'}-${goalId}`} 
                          style={{ 
                            padding: '16px',
                            backgroundColor: 'var(--background-color)',
                            borderRadius: '12px',
                            borderLeft: `4px solid ${isDailyGoal ? 'var(--primary-color)' : '#ff9500'}`
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <span style={{ 
                              fontSize: '14px',
                              color: 'var(--text-secondary)'
                            }}>
                              完成於 {new Date(timestamp).toLocaleString('zh-TW')}
                            </span>
                            <span style={{ 
                              backgroundColor: isDailyGoal ? 'var(--primary-color)' : '#ff9500',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>
                              {isDailyGoal ? '每日' : '每週'}進度
                            </span>
                          </div>
                          <p style={{ 
                            margin: '0',
                            fontSize: '15px',
                            color: 'var(--text-primary)',
                            lineHeight: '1.5',
                            fontWeight: '500'
                          }}>
                            {goalText}
                          </p>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ 
                    fontSize: '48px', 
                    marginBottom: '16px',
                    color: 'var(--text-tertiary)'
                  }}>
                    📊
                  </div>
                  <div style={{ 
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    暫無完成進度記錄
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: 'var(--text-tertiary)'
                  }}>
                    在進度列表中完成項目後，將會顯示在這裡
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'goals' && (
          <div className="goals-tab">
            {isCreator ? (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-tasks" style={{ color: 'var(--primary-color)' }}></i>
                    階段任務
                  </h3>
                </div>

                {/* 新增任務表單 */}
                <div style={{ 
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '16px'
                }}>
                <input
                  type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="輸入新的階段任務..."
              style={{ 
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      fontSize: '15px',
                      backgroundColor: 'var(--background-color)'
                    }}
                  />
                  <button
                    onClick={handleAddTask}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500'
                    }}
                  >
                    新增任務
                  </button>
              </div>
              
                {/* 任務列表 */}
                {tasks.length > 0 ? (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 16px',
                          backgroundColor: 'var(--background-color)',
                          borderRadius: '12px',
                          gap: '12px'
                        }}
                      >
                <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskToggle(index)}
                  style={{ 
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{
                            flex: 1,
                            fontSize: '15px',
                            color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            transition: 'all 0.2s ease'
                          }}>
                            {task.name}
                          </span>
              <button 
                              onClick={() => handleRemoveTask(index)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-tertiary)',
                                cursor: 'pointer',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                  backgroundColor: 'rgba(0,0,0,0.05)'
                                }
                              }}
                            >
                              <i className="fas fa-times"></i>
              </button>
            </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: 'var(--background-color)',
                    borderRadius: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ 
                      fontSize: '48px', 
                      marginBottom: '16px',
                      color: 'var(--text-tertiary)'
                    }}>
                      📋
                    </div>
                    <div style={{ 
                      fontSize: '16px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      尚未設定階段任務
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      color: 'var(--text-tertiary)'
                    }}>
                      新增一些階段任務來追蹤你的願望進度
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: '12px',
                        gap: '12px'
                      }}
                    >
                      <span style={{
                        flex: 1,
                        fontSize: '15px',
                        color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}>
                        {task.name}
                      </span>
                      {task.completed && (
                        <span style={{
                          color: 'var(--primary-color)',
                          fontSize: '14px'
                        }}>
                          已完成
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'privacy' && (
          <div className="privacy-tab">
            {isCreator ? (
            <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
              <h3>隱私設定</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="isPublic"
                    checked={privacySettings.isPublic}
                    onChange={handlePrivacyChange}
                    style={{ marginRight: '10px' }}
                  />
                  <span>公開 - 所有人可見</span>
                </label>
                
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="friendsOnly"
                    checked={privacySettings.friendsOnly}
                    onChange={handlePrivacyChange}
                    style={{ marginRight: '10px' }}
                  />
                  <span>僅好友可見</span>
                </label>
                
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={privacySettings.isAnonymous}
                    onChange={handlePrivacyChange}
                    style={{ marginRight: '10px' }}
                  />
                  <span>匿名模式 - 不顯示您的個人資訊</span>
                </label>
              </div>
              
              <button 
                className="primary-btn"
                style={{ width: '100%' }}
              >
                保存隱私設定
              </button>
              </div>
            ) : (
              <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: 'var(--text-secondary)'
                }}>
                  只有願望創建者可以修改隱私設定
            </div>
        </div>
      )}
          </div>
        )}
      </div>
      
      {/* 添加進度模態窗 */}
      {showAddProgressModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>新增進度</h3>
              <button
                onClick={() => setShowAddProgressModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                ×
              </button>
            </div>
            
            {/* 選擇進度類型 */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginBottom: '16px',
              backgroundColor: 'var(--background-color)',
              padding: '4px',
              borderRadius: 'var(--radius-md)'
            }}>
              <button
                type="button"
                onClick={() => setProgressType('daily')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: progressType === 'daily' ? 'white' : 'transparent',
                  color: progressType === 'daily' ? 'var(--primary-color)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: progressType === 'daily' ? '600' : '400',
                  boxShadow: progressType === 'daily' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                每日進度
              </button>
              <button
                type="button"
                onClick={() => setProgressType('weekly')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: progressType === 'weekly' ? 'white' : 'transparent',
                  color: progressType === 'weekly' ? 'var(--primary-color)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: progressType === 'weekly' ? '600' : '400',
                  boxShadow: progressType === 'weekly' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                每週進度
              </button>
            </div>
            
            {/* 進度內容輸入 */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="progressInput"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {progressType === 'daily' ? '每日進度內容' : '每週進度內容'}
                  </label>
                  <input
                id="progressInput"
                type="text"
                value={progressInput}
                onChange={(e) => setProgressInput(e.target.value)}
                placeholder={progressType === 'daily' ? "例如：閱讀30分鐘" : "例如：完成一章書"}
              style={{ 
                      width: '100%',
                  padding: '12px',
                      borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                    }}
                  />
              </div>
              
            {/* 按鈕區域 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowAddProgressModal(false)}
                    style={{ 
                  flex: 1,
                  padding: '12px',
                      borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'white',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                      fontSize: '14px'
                    }}
              >
                取消
                </button>
              <button
                onClick={handleAddProgress}
                disabled={!progressInput.trim()}
                    style={{ 
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                  cursor: progressInput.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  opacity: progressInput.trim() ? 1 : 0.7
                }}
              >
                新增
              </button>
                </div>
            </div>
        </div>
      )}

      {/* 添加日曆模態窗 */}
      {showCalendar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>選擇日期</h3>
                <button 
                onClick={() => {
                  console.log('Closing calendar modal');
                  setShowCalendar(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                ×
                </button>
            </div>
            
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const newDate = e.target.value;
                console.log('Date selected:', newDate);
                setSelectedDate(newDate);
                setShowCalendar(false);
              }}
                    style={{ 
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '16px',
                marginBottom: '16px'
              }}
            />

            <button
              onClick={() => {
                console.log('Confirm date button clicked');
                setShowCalendar(false);
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              確認
            </button>
                </div>
              </div>
              )}
    </div>
  );
}

export default WishDetail; 