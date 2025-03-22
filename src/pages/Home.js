import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { wishService, isLoading: dbLoading } = useDatabase();
  const { texts } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [todayTasks, setTodayTasks] = useState([]);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickWishTitle, setQuickWishTitle] = useState('');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [greeting, setGreeting] = useState('');
  const [memberLevel, setMemberLevel] = useState('regular');
  
  // 添加調試日誌
  console.log('Language texts:', texts);
  console.log('Home texts:', texts.home);
  
  // 通知相關文字
  const notificationTexts = {
    title: texts.notifications?.title || '通知',
    markAllAsRead: texts.notifications?.markAllAsRead || '標記全部為已讀',
    noNotifications: texts.notifications?.noNotifications || '目前沒有通知',
    noNotificationsDesc: texts.notifications?.noNotificationsDesc || '當有新的通知時，將會顯示在這裡',
    tabs: {
      all: texts.home?.tabs?.all || '全部',
      unread: texts.notifications?.tabs?.unread || '未讀',
      social: texts.notifications?.tabs?.social || '社交',
      system: texts.notifications?.tabs?.system || '系統'
    }
  };
  
  // 通知相關狀態
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [notificationActiveTab, setNotificationActiveTab] = useState('all');
  
  // 狀態篩選按鈕樣式
  const tabButtonStyle = (isActive) => ({
    padding: '8px 16px',
    marginRight: '8px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: isActive ? '#4A90E2' : '#F0F2F5',
    color: isActive ? 'white' : '#666',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.3s ease',
    outline: 'none',
    ':hover': {
      backgroundColor: isActive ? '#357ABD' : '#E4E6E9'
    }
  });

  // 狀態下拉選單樣式
  const statusDropdownStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E4E6E9',
    backgroundColor: 'white',
    color: '#333',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px'
  };

  // 查看詳情按鈕樣式
  const detailButtonStyle = {
    padding: '6px 12px',
    borderRadius: '16px',
    border: '1px solid #4A90E2',
    backgroundColor: 'transparent',
    color: '#4A90E2',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    ':hover': {
      backgroundColor: '#4A90E2',
      color: 'white'
    }
  };
  
  // 願望狀態文字
  const wishStatusTexts = {
    notStarted: '未開始',
    inProgress: '進行中',
    completed: '已完成'
  };
  
  // 每日待辦進度相關狀態
  const [dailyTasks, setDailyTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  
  // 獲取用戶資料和設置問候語
  useEffect(() => {
    // 從 localStorage 獲取用戶資料
    const storedUserName = localStorage.getItem('userName') || '用戶';
    const storedUserAvatar = localStorage.getItem('userAvatar') || 'https://randomuser.me/api/portraits/men/1.jpg';
    const storedMemberLevel = localStorage.getItem('memberLevel') || 'regular';
    
    setUserName(storedUserName);
    setUserAvatar(storedUserAvatar);
    setMemberLevel(storedMemberLevel);
    
    // 根據當前時間設置問候語
    const currentHour = new Date().getHours();
    let greetingText = '';
    
    if (currentHour >= 5 && currentHour < 12) {
      greetingText = texts.home.greeting.morning;
    } else if (currentHour >= 12 && currentHour < 18) {
      greetingText = texts.home.greeting.afternoon;
    } else {
      greetingText = texts.home.greeting.evening;
    }
    
    setGreeting(greetingText);
  }, []);
  
  // 從資料庫獲取願望數據
  useEffect(() => {
    const fetchWishes = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }
        
        setLoading(true);
        setError(null);
        
        // 檢查 wishService 是否存在
        if (!wishService) {
          throw new Error('願望服務未初始化');
        }
        
        // 從資料庫獲取願望
        const wishesData = await wishService.getWishes({ userId: user.id });
        
        // 檢查返回的數據
        if (!Array.isArray(wishesData)) {
          throw new Error('獲取的願望數據格式不正確');
        }
        
        setWishes(wishesData);
      } catch (error) {
        console.error('獲取願望數據時出錯:', error);
        setError(error.message || '獲取願望數據時出錯，請稍後再試');
      } finally {
        setLoading(false);
      }
    };
    
    // 當資料庫初始化完成且用戶已登入後獲取數據
    if (!dbLoading && user) {
      fetchWishes();
    }
  }, [wishService, dbLoading, user, navigate]);
  
  // 當願望數據更新時，刷新To-Do Lists
  useEffect(() => {
    if (wishes && wishes.length > 0) {
      fetchTodayTasks();
    }
  }, [wishes]);
  
  // 獲取進行中的願望To-Do Lists
  const fetchTodayTasks = () => {
    setIsLoadingTasks(true);
    
    // 獲取當前用戶的所有進行中的願望
    try {
      // 過濾出進行中的願望
      const activeWishes = wishes.filter(wish => wish.status === 'inProgress');
      
      // 為每個願望整理To-Do Lists，確保兼容舊數據模型
      const wishesWithTasks = activeWishes.map(wish => {
        // 確保dailyGoals和weeklyGoals存在
        const dailyGoals = Array.isArray(wish.dailyGoals) ? wish.dailyGoals : [];
        const weeklyGoals = Array.isArray(wish.weeklyGoals) ? wish.weeklyGoals : [];
        
        return {
          id: wish.id,
          title: wish.title,
          category: wish.category || '未分類',
          dailyTasks: dailyGoals.map((goal, index) => ({
            id: `${wish.id}-daily-${index}`,
            title: goal,
            type: 'daily',
          completed: false,
            wishId: wish.id
          })),
          weeklyTasks: weeklyGoals.map((goal, index) => ({
            id: `${wish.id}-weekly-${index}`,
            title: goal,
            type: 'weekly',
          completed: false,
            wishId: wish.id
          }))
        };
      });
      
      // 過濾出至少有一個 To-Do List 項目的願望
      const wishesWithTasksFiltered = wishesWithTasks.filter(
        wish => wish.dailyTasks.length > 0 || wish.weeklyTasks.length > 0
      );
      
      setDailyTasks(wishesWithTasksFiltered);
    } catch (error) {
      console.error('獲取願望To-Do List時出錯:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };
  
  // 獲取通知數據
  const fetchNotifications = () => {
    // 模擬API請求延遲
    setTimeout(() => {
      // 模擬通知數據
      const notificationsData = [
        {
          id: 1,
          type: 'like',
          read: false,
          timestamp: '2023-03-20 14:30',
          user: {
            name: '李小華',
            username: 'xiaohua',
            avatar: '👩‍🎓'
          },
          content: '喜歡了你的願望',
          targetId: 101,
          targetType: 'wish',
          targetTitle: '學習日文 N3 程度'
        },
        {
          id: 2,
          type: 'comment',
          read: false,
          timestamp: '2023-03-19 09:45',
          user: {
            name: '張大明',
            username: 'daming',
            avatar: '👨‍🚀'
          },
          content: '評論了你的願望',
          targetId: 101,
          targetType: 'wish',
          targetTitle: '學習日文 N3 程度',
          comment: '推薦你使用「大家的日語」這本教材，我覺得很適合初學者！'
        },
        {
          id: 3,
          type: 'follow',
          read: true,
          timestamp: '2023-03-18 16:20',
          user: {
            name: '王文靜',
            username: 'wenjing',
            avatar: '👩‍💼'
          },
          content: '關注了你'
        },
        {
          id: 4,
          type: 'system',
          read: true,
          timestamp: '2023-03-17 10:00',
          content: '恭喜你獲得「初學者」徽章！',
          targetId: 1,
          targetType: 'badge'
        },
        {
          id: 5,
          type: 'progress',
          read: true,
          timestamp: '2023-03-16 08:30',
          content: '你的願望進度已達到 50%',
          targetId: 101,
          targetType: 'wish',
          targetTitle: '學習日文 N3 程度'
        },
        {
          id: 6,
          type: 'system',
          read: true,
          timestamp: '2023-03-15 12:15',
          content: '歡迎加入願望中心！開始創建你的第一個願望吧。'
        }
      ];
      
      setNotifications(notificationsData);
      setNotificationLoading(false);
    }, 500);
  };
  
  // 處理標籤切換
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 處理願望點擊
  const handleWishClick = (wishId) => {
    console.log('正在跳轉到願望詳情頁:', wishId);
    
    // 添加一個小延遲以確保之前的數據操作完成
    setTimeout(() => {
    navigate(`/wish-detail/${wishId}`);
    }, 100);
  };
  
  // 處理添加願望
  const handleAddWish = () => {
    navigate('/add-wish');
  };
  
  // 處理查看計劃
  const handleViewPlan = (wishId) => {
    navigate(`/plan/${wishId}`);
  };
  
  // 處理快速添加願望
  const handleQuickAddWish = async () => {
    if (!quickWishTitle.trim()) {
      return;
    }
    
    try {
      const wishData = {
        userId: user.id,
        title: quickWishTitle,
        description: '',
        category: 'other',
        visibility: 'private',
        status: 'notStarted',
        priority: 'medium',
        progress: 0,
        createdAt: new Date().toISOString()
      };
      
      await wishService.createWish(wishData);
      setQuickWishTitle('');
      setShowQuickAddModal(false);
      
      // 重新獲取願望列表
      const updatedWishes = await wishService.getWishes(user.id);
      setWishes(updatedWishes);
    } catch (error) {
      console.error('添加願望時出錯:', error);
      setError('添加願望時出錯，請稍後再試');
    }
  };
  
  // 處理願望狀態更新
  const handleWishStatusChange = async (wishId, newStatus) => {
    try {
      await wishService.updateWish(wishId, { status: newStatus });
      
      // 重新獲取願望列表
      const updatedWishes = await wishService.getWishes(user.id);
      setWishes(updatedWishes);
    } catch (error) {
      console.error('更新願望狀態時出錯:', error);
      setError('更新願望狀態時出錯，請稍後再試');
    }
  };
  
  // 處理通知標籤切換
  const handleNotificationTabChange = (tab) => {
    setNotificationActiveTab(tab);
  };
  
  // 處理通知點擊
  const handleNotificationClick = (notification) => {
    // 標記為已讀
    setNotifications(notifications.map(n => 
      n.id === notification.id ? {...n, read: true} : n
    ));
    
    // 根據通知類型導航到相應頁面
    if (notification.targetType === 'wish') {
      navigate(`/wish/${notification.targetId}`);
    } else if (notification.targetType === 'badge') {
      navigate('/rewards');
    } else if (notification.type === 'follow') {
      // 導航到用戶資料頁面
      console.log(`導航到用戶資料頁面: ${notification.user.username}`);
    }
  };
  
  // 標記所有通知為已讀
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };
  
  // 渲染通知圖標
  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <div style={{ fontSize: '20px' }}>❤️</div>;
      case 'comment':
        return <div style={{ fontSize: '20px' }}>💬</div>;
      case 'follow':
        return <div style={{ fontSize: '20px' }}>👥</div>;
      case 'system':
        return <div style={{ fontSize: '20px' }}>🔔</div>;
      case 'progress':
        return <div style={{ fontSize: '20px' }}>📈</div>;
      default:
        return <div style={{ fontSize: '20px' }}>📩</div>;
    }
  };
  
  // 過濾通知
  const filteredNotifications = notifications.filter(notification => {
    if (notificationActiveTab === 'all') return true;
    if (notificationActiveTab === 'unread') return !notification.read;
    if (notificationActiveTab === 'social') return ['like', 'comment', 'follow'].includes(notification.type);
    if (notificationActiveTab === 'system') return ['system', 'progress'].includes(notification.type);
    return true;
  });
  
  // 計算未讀通知數量
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // 過濾願望
  const filteredWishes = wishes.filter(wish => {
    if (activeTab === 'all') return true;
    return wish.status === activeTab;
  });
  
  // 獲取優先級顏色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'var(--danger-color)';
      case 'medium':
        return 'var(--warning-color)';
      case 'low':
        return 'var(--success-color)';
      default:
        return 'var(--text-secondary)';
    }
  };
  
  // 獲取優先級文字
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '無';
    }
  };

  // 獲取分類圖標
  const getCategoryIcon = (category) => {
    switch (category) {
      case '學習':
        return '📚';
      case '健身':
        return '💪';
      case '旅行':
        return '✈️';
      case '職業':
        return '💼';
      case '財務':
        return '💰';
      case '興趣':
        return '🎨';
      case '閱讀':
        return '📖';
      default:
        return '🎯';
    }
  };
  
  // 獲取會員等級圖示和顏色
  const getMemberLevelInfo = (level) => {
    switch (level) {
      case 'gold':
        return { icon: '🏅', color: '#FFD700', name: '金牌會員' };
      case 'diamond':
        return { icon: '💎', color: '#B9F2FF', name: '鑽石會員' };
      case 'regular':
      default:
        return { icon: '👤', color: '#AAAAAA', name: '一般會員' };
    }
  };
  
  // 處理待辦任務狀態變更
  const handleTaskStatusChange = (taskId) => {
    setTodayTasks(todayTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // 處理任務完成狀態切換
  const handleTaskComplete = async (taskId) => {
    try {
      // 檢查 taskId 格式，解析出願望 ID 和任務類型
      const [wishId, taskType, taskIndex] = taskId.split('-');
      
      // 首先更新本地狀態
      setDailyTasks(prevTasks => {
        // 創建一個新的陣列，避免直接修改原始狀態
        return prevTasks.map(wish => {
          // 找到包含此任務的願望
          if (wish.id === wishId) {
            // 根據任務類型（每日或每週）更新相應的任務陣列
            if (taskType === 'daily') {
              const updatedDailyTasks = wish.dailyTasks.map((task, idx) => {
                if (task.id === taskId) {
                  return { ...task, completed: !task.completed };
                }
                return task;
              });
              
              return { ...wish, dailyTasks: updatedDailyTasks };
            } else if (taskType === 'weekly') {
              const updatedWeeklyTasks = wish.weeklyTasks.map((task, idx) => {
                if (task.id === taskId) {
                  return { ...task, completed: !task.completed };
                }
                return task;
              });
              
              return { ...wish, weeklyTasks: updatedWeeklyTasks };
            }
          }
          
          // 如果不是目標願望，直接返回原始願望物件
          return wish;
        });
      });
      
      // 同時更新 todayTasks 保持一致性
      setTodayTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: !task.completed }
            : task
        )
      );

      // 然後嘗試通過 API 更新資料庫
      await wishService.toggleTaskComplete(taskId);
      
      console.log(`任務 ${taskId} 狀態已更新`);
    } catch (error) {
      console.error('更新任務狀態失敗:', error);
      // 如果 API 調用失敗，可以在這裡添加錯誤提示
      alert('更新任務狀態失敗，請稍後再試');
    }
  };
  
  // 渲染願望卡片
  const renderWishCard = (wish) => (
    <div 
      key={wish.id} 
      className="wish-card" 
      style={{ 
        padding: '20px',
        marginBottom: '20px',
        cursor: 'pointer',
        position: 'relative',
        borderLeft: `4px solid ${getPriorityColor(wish.priority)}`
      }}
      onClick={() => handleWishClick(wish.id)}
    >
      {/* 優先級標記 */}
      <div style={{ 
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: getPriorityColor(wish.priority),
        backgroundColor: `${getPriorityColor(wish.priority)}10`,
        padding: '4px 10px',
        borderRadius: 'var(--radius-lg)',
      }}>
        <span style={{ marginRight: '5px' }}>優先級:</span>
        <span style={{ fontWeight: 'bold' }}>{getPriorityText(wish.priority)}</span>
      </div>
      
      <h3 style={{ margin: '0 0 15px 0', paddingRight: '100px' }}>{wish.title}</h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '15px',
        fontSize: '14px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ 
          backgroundColor: 'var(--background-color)', 
          padding: '6px 12px', 
          borderRadius: 'var(--radius-lg)',
          marginRight: '15px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '6px' }}>{getCategoryIcon(wish.category)}</span>
          {wish.category}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
          {wish.dueDate ? new Date(wish.dueDate).toLocaleDateString() : '無截止日期'}
        </div>
      </div>
      
      <p style={{ 
        margin: '0 0 15px 0',
        fontSize: '14px',
        color: 'var(--text-primary)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.5'
      }}>
        {wish.description}
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
        {wish.tags && wish.tags.map((tag, index) => (
          <span key={index} style={{
            backgroundColor: '#F0F2F5',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#666'
          }}>
            {tag}
          </span>
        ))}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <span>進度 {wish.progress}%</span>
          <span style={{ 
            color: wish.status === 'completed' ? 'var(--success-color)' : 
                  wish.status === 'inProgress' ? 'var(--primary-color)' : 
                  'var(--text-secondary)'
          }}>
            {wish.status === 'completed' ? texts.home.tabs.completed : 
             wish.status === 'inProgress' ? texts.home.tabs.inProgress : 
             texts.home.tabs.notStarted}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-bar-fill ${wish.status === 'completed' ? 'completed' : ''}`}
            style={{ 
              width: `${wish.progress}%`
            }}
          ></div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '15px'
      }}>
        <button 
          className="primary-btn" 
          onClick={(e) => {
            e.stopPropagation();
            handleViewPlan(wish.id);
          }}
        >
          <i className="fas fa-tasks" style={{ marginRight: '8px' }}></i>
          查看計劃
        </button>
      </div>
    </div>
  );
  
  // 渲染待辦任務項
  const renderTaskItem = (task) => (
    <div 
      key={task.id} 
      className="wish-card" 
      style={{ 
        padding: '15px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: task.completed ? 0.7 : 1
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div 
          style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            border: '2px solid var(--primary-color)',
            backgroundColor: task.completed ? 'var(--primary-color)' : 'transparent',
            marginRight: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px'
          }}
          onClick={() => handleTaskStatusChange(task.id)}
        >
          {task.completed && <i className="fas fa-check"></i>}
        </div>
        
        <div>
          <div style={{ 
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
          }}>
            {task.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {task.time}
          </div>
        </div>
      </div>
      
      <div 
        style={{ 
          width: '30px', 
          height: '30px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--background-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={() => handleWishClick(task.wishId)}
      >
        <i className="fas fa-arrow-right" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}></i>
      </div>
    </div>
  );
  
  if (loading) {
    return <div>載入中...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="content-area">
      {/* 用戶問候區域 */}
      <div className="wish-card" style={{ 
        padding: '20px', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%)',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '30px', 
          overflow: 'hidden',
          marginRight: '15px',
          border: '2px solid white',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}>
          <img 
            src={userAvatar} 
            alt="用戶頭像" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
            {greeting}，{userName}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {texts.home.welcomeMessage}
          </div>
        </div>
      </div>
      
      {/* 今日To-Do List區 */}
      <div className="wish-card" style={{ 
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
          marginBottom: '15px'
        }}>
          <h2 style={{ 
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
            今日To-Do List
          </h2>
          <div style={{
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}>
            {new Date().toLocaleDateString('zh-TW', { 
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
      </div>
      
        {isLoadingTasks ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            載入中...
          </div>
        ) : dailyTasks.length === 0 ? (
      <div style={{ 
            textAlign: 'center',
            padding: '30px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
            <p>目前沒有進行中的願望To-Do List</p>
            <p style={{ fontSize: '14px' }}>開始新增你的願望To-Do List吧！</p>
          </div>
        ) : (
          <div>
            {dailyTasks.map((wish) => (
              <div 
                key={wish.id}
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #eee'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)'
                  }}>
                    {wish.title}
                  </h3>
                </div>
                
                {/* 每日To-Do List */}
                {wish.dailyTasks.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--text-secondary)'
                    }}>
                      每日TDL項目
                    </h4>
                    {wish.dailyTasks.map((task) => (
                      <div 
                        key={task.id}
                        style={{
                          display: 'flex', 
                          alignItems: 'center',
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          marginBottom: '6px',
                          border: '1px solid #eee'
                        }}
                      >
                        <div 
                          style={{ 
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `2px solid ${task.completed ? 'var(--success-color)' : 'var(--primary-color)'}`,
                            backgroundColor: task.completed ? 'var(--success-color)' : 'white',
                            marginRight: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px'
                          }}
                          onClick={() => handleTaskComplete(task.id)}
                        >
                          {task.completed && '✓'}
                        </div>
                        <div style={{ 
                          fontSize: '14px',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                          transition: 'all 0.3s ease'
                        }}>
                          {task.title}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 每週To-Do List */}
                {wish.weeklyTasks.length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--text-secondary)'
                    }}>
                      每周TDL項目
                    </h4>
                    {wish.weeklyTasks.map((task) => (
                      <div 
                        key={task.id}
                        style={{
                          display: 'flex', 
                          alignItems: 'center',
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          marginBottom: '6px',
                          border: '1px solid #eee'
                        }}
                      >
                        <div 
                          style={{ 
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `2px solid ${task.completed ? 'var(--success-color)' : 'var(--primary-color)'}`,
                            backgroundColor: task.completed ? 'var(--success-color)' : 'white',
                            marginRight: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px'
                          }}
                          onClick={() => handleTaskComplete(task.id)}
                        >
                          {task.completed && '✓'}
                        </div>
                        <div style={{ 
                          fontSize: '14px',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                          transition: 'all 0.3s ease'
                        }}>
                          {task.title}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {wish.dailyTasks.length === 0 && wish.weeklyTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    尚未設定To-Do List項目
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Add New Wish 按鈕 */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={handleAddWish}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fas fa-plus"></i>
            新增願望
          </button>
        </div>
      </div>
      
      {/* 快速操作按鈕區 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '15px', 
        marginBottom: '20px'
      }}>
        {/* 添加新願望按鈕 */}
        <div 
          className="wish-card" 
          style={{ 
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            borderRadius: 'var(--radius-md)'
          }}
          onClick={handleAddWish}
        >
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <i className="fas fa-plus"></i>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{texts.home.addWish}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{texts.home.addWishDesc}</div>
          </div>
        </div>

        {/* 快速新增按鈕 */}
        <div 
          className="wish-card" 
          style={{ 
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
          onClick={() => setShowQuickAddModal(true)}
        >
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            color: 'var(--primary-color)'
          }}>
            <i className="fas fa-bolt"></i>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{texts.home.quickAddWish}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{texts.home.quickAddDesc}</div>
          </div>
        </div>
        
        {/* 發起挑戰按鈕 */}
        <div 
          className="wish-card" 
          style={{ 
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
          onClick={() => navigate('/create-challenge')}
        >
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            color: 'var(--primary-color)'
          }}>
            <i className="fas fa-trophy"></i>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>發起挑戰</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>邀請好友一起完成目標</div>
          </div>
        </div>

        {/* 尋找支援按鈕 */}
        <div 
          className="wish-card" 
          style={{ 
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            borderRadius: 'var(--radius-md)'
          }}
          onClick={() => navigate('/create-support')}
        >
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <i className="fas fa-hands-helping"></i>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>尋找支援</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>尋找志同道合的夥伴</div>
          </div>
        </div>
      </div>
      
      {/* 願望統計區塊 */}
      <div className="wish-card" style={{ 
        padding: '15px', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%)',
        borderRadius: 'var(--radius-md)',
        color: 'white'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '10px',
          textAlign: 'center'
        }}>
          {/* 總願望 */}
          <div 
            style={{ 
              padding: '8px', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'all' ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
              background: activeTab === 'all' ? 'rgba(255,255,255,0.2)' : 'transparent'
            }}
            onClick={() => handleTabChange('all')}
          >
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {wishes.length}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {texts.wishlist.stats.total}
            </div>
          </div>
          
          {/* 進行中 */}
          <div 
            style={{ 
              padding: '8px', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'inProgress' ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
              background: activeTab === 'inProgress' ? 'rgba(255,255,255,0.2)' : 'transparent'
            }}
            onClick={() => handleTabChange('inProgress')}
          >
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {wishes.filter(w => w.status === 'inProgress').length}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {texts.wishlist.stats.inProgress}
            </div>
          </div>
          
          {/* 未開始 */}
          <div 
            style={{ 
              padding: '8px', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'notStarted' ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
              background: activeTab === 'notStarted' ? 'rgba(255,255,255,0.2)' : 'transparent'
            }}
            onClick={() => handleTabChange('notStarted')}
          >
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {wishes.filter(w => w.status === 'notStarted').length}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {texts.wishlist.stats.notStarted}
            </div>
          </div>
          
          {/* 已完成 */}
          <div 
            style={{ 
              padding: '8px', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'completed' ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
              background: activeTab === 'completed' ? 'rgba(255,255,255,0.2)' : 'transparent'
            }}
            onClick={() => handleTabChange('completed')}
          >
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {wishes.filter(w => w.status === 'completed').length}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {texts.wishlist.stats.completed}
            </div>
          </div>
        </div>
      </div>
      
      {/* 願望列表 */}
      <div style={{ marginTop: '20px' }}>
        {filteredWishes.map((wish) => (
          <div key={wish.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{wish.title}</h3>
              <select
                value={wish.status}
                onChange={(e) => handleWishStatusChange(wish.id, e.target.value)}
                style={statusDropdownStyle}
              >
                <option value="notStarted">{wishStatusTexts.notStarted}</option>
                <option value="inProgress">{wishStatusTexts.inProgress}</option>
                <option value="completed">{wishStatusTexts.completed}</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>{wish.category}</span>
                {wish.tags && wish.tags.map((tag, index) => (
                  <span key={index} style={{
                    backgroundColor: '#F0F2F5',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleWishClick(wish.id)}
                style={detailButtonStyle}
              >
                詳細資料
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 快速添加願望模態框 */}
      {showQuickAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>快速添加願望</h3>
            <input
              type="text"
              value={quickWishTitle}
              onChange={(e) => setQuickWishTitle(e.target.value)}
              placeholder="輸入願望標題"
              className="input-field"
            />
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="text-btn"
                onClick={() => setShowQuickAddModal(false)}
                style={{ marginRight: '10px' }}
              >
                取消
              </button>
              <button 
                className="primary-btn"
                onClick={handleQuickAddWish}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home; 