import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function Wishlist() {
  const navigate = useNavigate();
  const { texts } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [wishlists, setWishlists] = useState([]);
  const [activeWishlist, setActiveWishlist] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [memberLevel, setMemberLevel] = useState('regular');
  
  // 通知相關狀態
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [notificationActiveTab, setNotificationActiveTab] = useState('all');
  
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
  
  // 按鈕文字的多語言支持
  const buttonTexts = {
    startChallenge: texts.wishlist?.buttons?.startChallenge || '發起挑戰',
    findSupport: texts.wishlist?.buttons?.findSupport || '尋找支援',
    createNewList: texts.wishlist?.createNewList || '創建新列表',
    addWish: texts.wishlist?.addWish || '添加願望',
    all: texts.wishlist?.categories?.all || '全部'
  };
  
  // 計算願望統計數據
  const getWishStats = () => {
    return {
      total: wishes.length,
      completed: wishes.filter(wish => wish.progress === 100).length,
      inProgress: wishes.filter(wish => wish.progress > 0 && wish.progress < 100).length,
      notStarted: wishes.filter(wish => wish.progress === 0).length
    };
  };
  
  // 獲取用戶資料
  useEffect(() => {
    // 從 localStorage 獲取用戶資料
    const storedUserName = localStorage.getItem('userName') || '用戶';
    const storedUserAvatar = localStorage.getItem('userAvatar') || 'https://randomuser.me/api/portraits/men/1.jpg';
    const storedMemberLevel = localStorage.getItem('memberLevel') || 'regular';
    
    setUserName(storedUserName);
    setUserAvatar(storedUserAvatar);
    setMemberLevel(storedMemberLevel);
  }, []);
  
  // 模擬獲取願望列表數據
  useEffect(() => {
    // 模擬API請求延遲
    const timer = setTimeout(() => {
      // 模擬願望列表數據
      const wishlistsData = [
        {
          id: 0, // 使用 0 作為"全部"的 ID
          name: buttonTexts.all,
          count: 0, // 稍後會更新
          icon: '🔍'
        },
        {
          id: 1,
          name: texts.wishlistNames.learning,
          count: 3,
          icon: '📚'
        },
        {
          id: 2,
          name: texts.wishlistNames.fitness,
          count: 2,
          icon: '💪'
        },
        {
          id: 3,
          name: texts.wishlistNames.travel,
          count: 2,
          icon: '✈️'
        },
        {
          id: 4,
          name: texts.wishlistNames.career,
          count: 1,
          icon: '💼'
        }
      ];
      
      // 計算"全部"分類的願望數量
      const totalCount = wishlistsData.slice(1).reduce((sum, list) => sum + list.count, 0);
      wishlistsData[0].count = totalCount;
      
      setWishlists(wishlistsData);
      setActiveWishlist(wishlistsData[0]); // 設置"全部"為預設值
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [texts.wishlistNames, buttonTexts.all]);
  
  // 當選擇的願望列表變化時，獲取該列表的願望
  useEffect(() => {
    if (activeWishlist) {
      // 模擬API請求延遲
      const timer = setTimeout(() => {
        // 模擬願望數據
        let wishesData = [];
        
        if (activeWishlist.id === 1) {
          // 學習目標
          wishesData = [
            {
              id: 101,
              title: '學習日文 N3 程度',
              description: '希望能夠在年底前達到日語N3水平，能夠理解日常對話和簡單的日文文章。',
              category: '學習',
              progress: 65,
              dueDate: '2023-12-31',
              priority: 'high'
            },
            {
              id: 104,
              title: '閱讀10本經典文學作品',
              description: '拓展文學視野，閱讀10本世界經典文學作品。',
              category: '閱讀',
              progress: 30,
              dueDate: '2023-12-31',
              priority: 'medium'
            },
            {
              id: 107,
              title: '學習Python編程',
              description: '學習Python編程基礎，能夠獨立開發簡單的應用程序。',
              category: '學習',
              progress: 20,
              dueDate: '2023-10-31',
              priority: 'medium'
            }
          ];
        } else if (activeWishlist.id === 2) {
          // 健身計劃
          wishesData = [
            {
              id: 102,
              title: '每週健身三次',
              description: '保持健康的生活方式，每週至少去健身房三次，每次至少1小時。',
              category: '健身',
              progress: 40,
              dueDate: '2023-06-30',
              priority: 'medium'
            },
            {
              id: 108,
              title: '完成半程馬拉松',
              description: '訓練並參加一場半程馬拉松比賽。',
              category: '健身',
              progress: 15,
              dueDate: '2023-11-15',
              priority: 'high'
            }
          ];
        } else if (activeWishlist.id === 3) {
          // 旅行願望
          wishesData = [
            {
              id: 109,
              title: '環遊日本',
              description: '計劃一次日本之旅，參觀東京、京都、大阪等城市。',
              category: '旅行',
              progress: 10,
              dueDate: '2024-04-30',
              priority: 'medium'
            },
            {
              id: 110,
              title: '探索台灣東海岸',
              description: '騎自行車環島台灣東海岸，體驗自然風光。',
              category: '旅行',
              progress: 5,
              dueDate: '2023-09-30',
              priority: 'low'
            }
          ];
        } else if (activeWishlist.id === 4) {
          // 職業發展
          wishesData = [
            {
              id: 111,
              title: '獲得專業認證',
              description: '準備並通過行業相關的專業認證考試。',
              category: '職業發展',
              progress: 25,
              dueDate: '2023-08-31',
              priority: 'high'
            }
          ];
        }
        
        setWishes(wishesData);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [activeWishlist]);
  
  // 獲取通知數據
  useEffect(() => {
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
        }
      ];
      
      setNotifications(notificationsData);
      setNotificationLoading(false);
    }, 500);
  }, []);
  
  // 處理願望列表點擊
  const handleWishlistClick = (wishlist) => {
    setActiveWishlist(wishlist);
    
    // 如果選擇的是"全部"分類，則顯示所有願望
    if (wishlist.id === 0) {
      // 獲取所有分類的願望
      let allWishes = [];
      
      // 模擬獲取所有願望
      wishlists.slice(1).forEach(list => {
        // 這裡應該是從後端獲取每個分類的願望
        // 在實際應用中，可能需要調用 API
        // 這裡我們使用模擬數據
        if (list.id === 1) {
          allWishes = allWishes.concat([
            {
              id: 101,
              title: '學習日文 N3 程度',
              description: '希望能夠在年底前達到日語N3水平，能夠理解日常對話和簡單的日文文章。',
              category: '學習',
              progress: 65,
              dueDate: '2023-12-31',
              priority: 'high'
            },
            {
              id: 104,
              title: '閱讀10本經典文學作品',
              description: '拓展文學視野，閱讀10本世界經典文學作品。',
              category: '閱讀',
              progress: 30,
              dueDate: '2023-12-31',
              priority: 'medium'
            },
            {
              id: 107,
              title: '學習Python編程',
              description: '學習Python編程基礎，能夠獨立開發簡單的應用程序。',
              category: '學習',
              progress: 20,
              dueDate: '2023-10-31',
              priority: 'medium'
            }
          ]);
        } else if (list.id === 2) {
          allWishes = allWishes.concat([
            {
              id: 102,
              title: '每週健身三次',
              description: '保持健康的生活方式，每週至少去健身房三次，每次至少1小時。',
              category: '健身',
              progress: 40,
              dueDate: '2023-06-30',
              priority: 'medium'
            },
            {
              id: 108,
              title: '完成半程馬拉松',
              description: '訓練並參加一場半程馬拉松比賽。',
              category: '健身',
              progress: 15,
              dueDate: '2023-11-15',
              priority: 'high'
            }
          ]);
        } else if (list.id === 3) {
          allWishes = allWishes.concat([
            {
              id: 109,
              title: '環遊日本',
              description: '計劃一次日本之旅，參觀東京、京都、大阪等城市。',
              category: '旅行',
              progress: 10,
              dueDate: '2024-04-30',
              priority: 'medium'
            },
            {
              id: 110,
              title: '探索台灣東海岸',
              description: '騎自行車環島台灣東海岸，體驗自然風光。',
              category: '旅行',
              progress: 5,
              dueDate: '2023-09-30',
              priority: 'low'
            }
          ]);
        } else if (list.id === 4) {
          allWishes = allWishes.concat([
            {
              id: 111,
              title: '獲得專業認證',
              description: '準備並通過行業相關的專業認證考試。',
              category: '職業發展',
              progress: 25,
              dueDate: '2023-08-31',
              priority: 'high'
            }
          ]);
        }
      });
      
      setWishes(allWishes);
    }
  };
  
  // 處理願望點擊
  const handleWishClick = (wishId) => {
    console.log('導航到願望詳情頁面:', wishId);
    navigate(`/wish-detail/${wishId}`);
  };
  
  // 處理添加願望
  const handleAddWish = () => {
    navigate('/add-wish');
  };
  
  // 處理添加新列表
  const handleAddNewList = () => {
    setShowNewListForm(true);
  };
  
  // 處理提交新列表
  const handleSubmitNewList = (e) => {
    e.preventDefault();
    
    if (!newListName.trim()) return;
    
    // 模擬添加新列表
    const newList = {
      id: wishlists.length + 1,
      name: newListName,
      count: 0,
      icon: '📋'
    };
    
    setWishlists([...wishlists, newList]);
    setNewListName('');
    setShowNewListForm(false);
    setActiveWishlist(newList);
  };
  
  // 處理取消添加新列表
  const handleCancelNewList = () => {
    setNewListName('');
    setShowNewListForm(false);
  };
  
  // 獲取優先級顏色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff3b30';
      case 'medium':
        return '#ff9500';
      case 'low':
        return '#34c759';
      default:
        return '#8e8e93';
    }
  };
  
  // 獲取優先級文字
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return texts.wishlist.priorityLevels.high;
      case 'medium':
        return texts.wishlist.priorityLevels.medium;
      case 'low':
        return texts.wishlist.priorityLevels.low;
      default:
        return texts.wishlist.priorityLevels.none;
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
  
  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>載入中...</div>
      </div>
    );
  }
  
  return (
    <div className="content-area">
      {/* 統計卡片 - 移至頂部 */}
      <div className="wish-card" style={{ 
        padding: '20px', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%)',
        color: 'white'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{getWishStats().total}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>{texts.wishlist.stats.total}</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {getWishStats().completed}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>{texts.wishlist.stats.completed}</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {getWishStats().inProgress}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>{texts.wishlist.stats.inProgress}</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {getWishStats().notStarted}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>{texts.wishlist.stats.notStarted}</div>
          </div>
        </div>
      </div>
      
      {/* 願望列表標題和操作按鈕 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <div></div>
        <button 
          className="primary-btn"
          onClick={handleAddWish}
        >
          <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
          {texts.wishlist.addWish}
        </button>
      </div>
      
      {/* 統一設計的四個按鈕 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        <button 
          className="action-btn"
          onClick={() => navigate('/create-challenge')}
          style={{ 
            padding: '12px 0',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ marginBottom: '8px', fontSize: '24px' }}>🏆</span>
          {buttonTexts.startChallenge}
        </button>
        
        <button 
          className="action-btn"
          onClick={() => navigate('/create-support')}
          style={{ 
            padding: '12px 0',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ marginBottom: '8px', fontSize: '24px' }}>👥</span>
          {buttonTexts.findSupport}
        </button>
        
        <button 
          className="action-btn"
          onClick={handleAddNewList}
          style={{ 
            padding: '12px 0',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ marginBottom: '8px', fontSize: '24px' }}>📋</span>
          {buttonTexts.createNewList}
        </button>
        
        <button 
          className="action-btn"
          onClick={handleAddWish}
          style={{ 
            padding: '12px 0',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ marginBottom: '8px', fontSize: '24px' }}>✨</span>
          {buttonTexts.addWish}
        </button>
      </div>
      
      {/* 新列表表單 */}
      {showNewListForm && (
        <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
          <form onSubmit={handleSubmitNewList}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {texts.wishlist.listName}
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder={texts.wishlist.enterListName}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="text-btn"
                onClick={handleCancelNewList}
              >
                {texts.wishlist.cancel}
              </button>
              <button 
                type="submit" 
                className="primary-btn"
                disabled={!newListName.trim()}
              >
                {texts.wishlist.create}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* 分類列表 - 自動換行排列 */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        padding: '10px 0'
      }}>
        {wishlists.map(wishlist => (
          <div 
            key={wishlist.id}
            style={{ 
              padding: '7px 14px',
              borderRadius: '18px',
              backgroundColor: activeWishlist && activeWishlist.id === wishlist.id ? 'var(--primary-color)' : '#f2f2f7',
              color: activeWishlist && activeWishlist.id === wishlist.id ? 'white' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center'
            }}
            onClick={() => handleWishlistClick(wishlist)}
          >
            <span style={{ marginRight: '5px', fontSize: '16px' }}>{wishlist.icon}</span>
            {wishlist.name}
          </div>
        ))}
      </div>
      
      {/* 願望列表 */}
      {activeWishlist && (
        <>
          {wishes.length > 0 ? (
            wishes.map(wish => (
              <div 
                key={wish.id} 
                className="wish-card" 
                style={{ 
                  padding: '15px',
                  marginBottom: '15px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => handleWishClick(wish.id)}
              >
                {/* 優先級標記 */}
                <div style={{ 
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: getPriorityColor(wish.priority)
                }}>
                  <span style={{ marginRight: '5px' }}>{texts.wishlist.priority}:</span>
                  <span style={{ fontWeight: 'bold' }}>{getPriorityText(wish.priority)}</span>
                </div>
                
                <h3 style={{ margin: '0 0 10px 0', paddingRight: '80px' }}>{wish.title}</h3>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '10px',
                  fontSize: '14px',
                  color: '#8e8e93'
                }}>
                  <div style={{ 
                    backgroundColor: '#f2f2f7', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    marginRight: '10px'
                  }}>
                    {wish.category}
                  </div>
                  <div>{texts.wishlist.dueDate}: {wish.dueDate}</div>
                </div>
                
                <p style={{ 
                  margin: '0 0 15px 0',
                  fontSize: '14px',
                  color: '#636366',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {wish.description}
                </p>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                    <span>{texts.wishlist.progress} {wish.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${wish.progress}%`,
                        backgroundColor: '#007aff' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              padding: '30px', 
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
              <h3>{texts.wishlist.noWishes}</h3>
              <p>{texts.wishlist.noWishesDesc}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Wishlist; 