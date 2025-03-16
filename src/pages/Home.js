import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';

function Home() {
  const navigate = useNavigate();
  const { wishService, isLoading: dbLoading } = useDatabase();
  const { texts } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [wishes, setWishes] = useState([]);
  const [activeTab, setActiveTab] = useState('inProgress');
  const [todayTasks, setTodayTasks] = useState([]);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickWishTitle, setQuickWishTitle] = useState('');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [greeting, setGreeting] = useState('');
  const [memberLevel, setMemberLevel] = useState('regular');
  
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
        setLoading(true);
        
        // 從 localStorage 獲取當前用戶 ID
        // 在實際應用中，這應該從用戶上下文或身份驗證服務中獲取
        const userId = 1; // 使用示範用戶 ID
        
        // 從資料庫獲取願望
        const wishesData = await wishService.getWishes(userId);
        
        setWishes(wishesData);
      } catch (error) {
        console.error('獲取願望數據時出錯:', error);
        // 如果資料庫獲取失敗，使用模擬數據
        const wishesData = [
          {
            id: 101,
            title: '學習日文 N3 程度',
            description: '希望能夠在年底前達到日語N3水平，能夠理解日常對話和簡單的日文文章。',
            category: '學習',
            progress: 65,
            dueDate: '2023-12-31',
            status: 'inProgress',
            priority: 'high',
            tags: ['語言學習', '日文', 'JLPT']
          },
          {
            id: 102,
            title: '每週健身三次',
            description: '保持健康的生活方式，每週至少去健身房三次，每次至少1小時。',
            category: '健身',
            progress: 40,
            dueDate: '2023-06-30',
            status: 'inProgress',
            priority: 'medium',
            tags: ['健身', '健康']
          },
          {
            id: 103,
            title: '學習烹飪',
            description: '學習基本的烹飪技巧，能夠自己做出10道不同的菜餚。',
            category: '興趣',
            progress: 100,
            dueDate: '2023-02-28',
            status: 'completed',
            priority: 'low',
            tags: ['烹飪', '生活技能']
          },
          {
            id: 104,
            title: '閱讀10本經典文學作品',
            description: '拓展文學視野，閱讀10本世界經典文學作品。',
            category: '閱讀',
            progress: 30,
            dueDate: '2023-12-31',
            status: 'inProgress',
            priority: 'medium',
            tags: ['閱讀', '文學']
          },
          {
            id: 105,
            title: '學習攝影基礎',
            description: '學習攝影的基本技巧，能夠拍出構圖良好的照片。',
            category: '興趣',
            progress: 0,
            dueDate: '2023-09-30',
            status: 'notStarted',
            priority: 'low',
            tags: ['攝影', '藝術']
          }
        ];
        
        setWishes(wishesData);
      } finally {
        setLoading(false);
      }
    };
    
    // 當資料庫初始化完成後獲取數據
    if (!dbLoading) {
      fetchWishes();
      fetchTodayTasks();
      fetchNotifications();
    }
  }, [wishService, dbLoading]);
  
  // 獲取今日待辦任務
  const fetchTodayTasks = () => {
    // 模擬從後端獲取今日待辦任務
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const todayTasksData = [
        {
          id: 301,
          title: '日文單字複習',
          completed: false,
          wishId: 101,
          time: '09:00'
        },
        {
          id: 302,
          title: '健身房訓練',
          completed: true,
          wishId: 102,
          time: '18:30'
        },
        {
          id: 303,
          title: '閱讀《百年孤獨》第三章',
          completed: false,
          wishId: 104,
          time: '21:00'
        }
      ];
      
      setTodayTasks(todayTasksData);
    }, 600);
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
    navigate(`/wish-detail/${wishId}`);
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
  const handleQuickAddWish = () => {
    setShowQuickAddModal(true);
  };
  
  // 處理提交快速添加願望
  const handleSubmitQuickWish = () => {
    if (!quickWishTitle.trim()) return;
    
    // 模擬添加新願望
    console.log('快速添加願望:', quickWishTitle);
    
    // 在實際應用中，這裡應該調用 API 添加願望
    // 然後刷新願望列表
    
    // 重置表單並關閉模態框
    setQuickWishTitle('');
    setShowQuickAddModal(false);
    
    // 顯示成功提示
    alert('願望已添加！');
  };
  
  // 處理關閉快速添加模態框
  const handleCloseQuickAddModal = () => {
    setQuickWishTitle('');
    setShowQuickAddModal(false);
  };
  
  // 處理任務狀態切換
  const handleToggleTaskStatus = (taskId) => {
    setTodayTasks(todayTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
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
          <div 
            key={index}
            className="tag"
          >
            #{tag}
          </div>
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
          onClick={() => handleToggleTaskStatus(task.id)}
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
  
  if (loading || dbLoading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
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
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ margin: 0 }}>{texts.home.title}</h2>
      </div>
      
      {/* 快速新增心願按鈕和添加新願望按鈕並排 */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px'
      }}>
        {/* 快速新增心願按鈕 */}
        <div 
          className="wish-card" 
          style={{ 
            padding: '15px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            borderRadius: 'var(--radius-md)'
          }}
          onClick={handleQuickAddWish}
        >
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px'
          }}>
            <i className="fas fa-bolt"></i>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{texts.home.quickAddWish}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{texts.home.quickAddDesc}</div>
          </div>
        </div>
        
        {/* 添加新願望按鈕 */}
        <div 
          className="wish-card" 
          style={{ 
            padding: '15px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
          onClick={handleAddWish}
        >
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px',
            color: 'var(--primary-color)'
          }}>
            <i className="fas fa-plus"></i>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{texts.home.addWish}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{texts.home.addWishDesc}</div>
          </div>
        </div>
      </div>
      
      {/* 待辦清單 */}
      <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h3 style={{ margin: 0 }}>{texts.home.todayTasks}</h3>
          <div style={{ 
            fontSize: '14px', 
            color: 'var(--primary-color)',
            cursor: 'pointer'
          }}>
            {texts.home.seeAll}
          </div>
        </div>
        
        {todayTasks.length > 0 ? (
          todayTasks.map(task => renderTaskItem(task))
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎉</div>
            <div>{texts.home.noTasks}</div>
          </div>
        )}
      </div>
      
      {/* 通知部分 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0 }}>{notificationTexts.title}</h3>
          {unreadCount > 0 && (
            <button 
              className="text-btn" 
              onClick={markAllAsRead}
            >
              {notificationTexts.markAllAsRead}
            </button>
          )}
        </div>
        
        {/* 分類標籤 */}
        <div className="tab-container">
          <div 
            className={`tab ${notificationActiveTab === 'all' ? 'active' : ''}`} 
            onClick={() => handleNotificationTabChange('all')}
          >
            {notificationTexts.tabs.all}
          </div>
          <div 
            className={`tab ${notificationActiveTab === 'unread' ? 'active' : ''}`} 
            onClick={() => handleNotificationTabChange('unread')}
          >
            {notificationTexts.tabs.unread} {unreadCount > 0 && `(${unreadCount})`}
          </div>
          <div 
            className={`tab ${notificationActiveTab === 'social' ? 'active' : ''}`} 
            onClick={() => handleNotificationTabChange('social')}
          >
            {notificationTexts.tabs.social}
          </div>
          <div 
            className={`tab ${notificationActiveTab === 'system' ? 'active' : ''}`} 
            onClick={() => handleNotificationTabChange('system')}
          >
            {notificationTexts.tabs.system}
          </div>
        </div>
        
        {/* 通知列表 */}
        <div className="tab-content">
          {notificationLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>載入中...</div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                style={{ 
                  display: 'flex', 
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: notification.read ? 'white' : '#f0f8ff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer'
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* 通知類型圖標 */}
                <div style={{ 
                  marginRight: '15px',
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f2f2f7',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {renderNotificationIcon(notification.type)}
                </div>
                
                {/* 通知內容 */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    {notification.user && (
                      <span style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        {notification.user.name}
                      </span>
                    )}
                    <span>{notification.content}</span>
                  </div>
                  
                  {notification.targetTitle && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#636366',
                      marginBottom: '5px'
                    }}>
                      "{notification.targetTitle}"
                    </div>
                  )}
                  
                  {notification.comment && (
                    <div style={{ 
                      fontSize: '14px',
                      backgroundColor: '#f2f2f7',
                      padding: '8px',
                      borderRadius: '8px',
                      marginBottom: '5px'
                    }}>
                      {notification.comment}
                    </div>
                  )}
                  
                  <div style={{ fontSize: '12px', color: '#8e8e93' }}>
                    {notification.timestamp}
                  </div>
                </div>
                
                {/* 未讀標記 */}
                {!notification.read && (
                  <div style={{ 
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#007aff',
                    borderRadius: '5px',
                    alignSelf: 'center',
                    marginLeft: '10px'
                  }}></div>
                )}
              </div>
            ))
          ) : (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <h3>{notificationTexts.noNotifications}</h3>
              <p>{notificationTexts.noNotificationsDesc}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 快速添加願望模態框 */}
      {showQuickAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: '90%',
            maxWidth: '400px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>{texts.home.quickAddWish}</h3>
            
            <input
              type="text"
              value={quickWishTitle}
              onChange={(e) => setQuickWishTitle(e.target.value)}
              placeholder="輸入您的心願..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '20px',
                fontSize: '16px'
              }}
              autoFocus
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="secondary-btn"
                onClick={handleCloseQuickAddModal}
              >
                {texts.editProfile.cancel}
              </button>
              <button 
                className="primary-btn"
                onClick={handleSubmitQuickWish}
                disabled={!quickWishTitle.trim()}
              >
                {texts.settings.appSettings.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home; 