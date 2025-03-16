import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function Notifications() {
  const navigate = useNavigate();
  const { texts } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // 模擬獲取通知數據
  useEffect(() => {
    // 模擬API請求延遲
    const timer = setTimeout(() => {
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
          content: texts.notifications.notificationTypes.like,
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
          content: texts.notifications.notificationTypes.comment,
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
          content: texts.notifications.notificationTypes.follow
        },
        {
          id: 4,
          type: 'system',
          read: true,
          timestamp: '2023-03-17 10:00',
          content: texts.notifications.notificationTypes.badge.replace('{badge}', '初學者'),
          targetId: 1,
          targetType: 'badge'
        },
        {
          id: 5,
          type: 'progress',
          read: true,
          timestamp: '2023-03-16 08:30',
          content: texts.notifications.notificationTypes.progress.replace('{progress}', '50'),
          targetId: 101,
          targetType: 'wish',
          targetTitle: '學習日文 N3 程度'
        },
        {
          id: 6,
          type: 'system',
          read: true,
          timestamp: '2023-03-15 12:15',
          content: texts.notifications.notificationTypes.welcome
        }
      ];
      
      setNotifications(notificationsData);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [texts.notifications.notificationTypes]);
  
  // 處理標籤切換
  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'social') return ['like', 'comment', 'follow'].includes(notification.type);
    if (activeTab === 'system') return ['system', 'progress'].includes(notification.type);
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>{texts.notifications.title}</h2>
        {unreadCount > 0 && (
          <button 
            className="text-btn" 
            onClick={markAllAsRead}
          >
            {texts.notifications.markAllAsRead}
          </button>
        )}
      </div>
      
      {/* 分類標籤 */}
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`} 
          onClick={() => handleTabChange('all')}
        >
          {texts.notifications.tabs.all}
        </div>
        <div 
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`} 
          onClick={() => handleTabChange('unread')}
        >
          {texts.notifications.tabs.unread} {unreadCount > 0 && `(${unreadCount})`}
        </div>
        <div 
          className={`tab ${activeTab === 'social' ? 'active' : ''}`} 
          onClick={() => handleTabChange('social')}
        >
          {texts.notifications.tabs.social}
        </div>
        <div 
          className={`tab ${activeTab === 'system' ? 'active' : ''}`} 
          onClick={() => handleTabChange('system')}
        >
          {texts.notifications.tabs.system}
        </div>
      </div>
      
      {/* 通知列表 */}
      <div className="tab-content">
        {filteredNotifications.length > 0 ? (
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
            <h3>沒有通知</h3>
            <p>當有新的通知時，將會顯示在這裡</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications; 