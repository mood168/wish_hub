import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

function Settings() {
  const navigate = useNavigate();
  const { language, texts, changeLanguage } = useLanguage();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [themeColor, setThemeColor] = useState('blue');
  const [fontSize, setFontSize] = useState('medium');
  const [notificationTypes, setNotificationTypes] = useState({
    wishUpdates: true,
    friendActivity: true,
    systemUpdates: true
  });
  const [user, setUser] = useState({
    name: '用戶',
    email: 'user@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    joinDate: '2023年3月15日',
    bio: '',
    isCustomAvatar: false,
    memberLevel: 'regular'
  });
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // 從 localStorage 獲取用戶資料
  useEffect(() => {
    const userName = localStorage.getItem('userName') || '用戶';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userAvatar = localStorage.getItem('userAvatar') || 'https://randomuser.me/api/portraits/men/1.jpg';
    const userBio = localStorage.getItem('userBio') || '';
    const isCustomAvatar = localStorage.getItem('isCustomAvatar') === 'true';
    const memberLevel = localStorage.getItem('memberLevel') || 'regular';
    
    // 獲取應用設定
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedThemeColor = localStorage.getItem('themeColor') || 'blue';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedNotificationTypes = JSON.parse(localStorage.getItem('notificationTypes')) || {
      wishUpdates: true,
      friendActivity: true,
      systemUpdates: true
    };
    
    setUser({
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      joinDate: '2023年3月15日',
      bio: userBio,
      isCustomAvatar: isCustomAvatar,
      memberLevel: memberLevel
    });
    
    setDarkMode(savedDarkMode);
    setNotifications(savedNotifications);
    setThemeColor(savedThemeColor);
    setFontSize(savedFontSize);
    setNotificationTypes(savedNotificationTypes);
    
    // 應用深色模式
    applyDarkMode(savedDarkMode);
    
    // 應用字型大小
    applyFontSize(savedFontSize);
    
    // 應用主題顏色
    applyThemeColor(savedThemeColor);
  }, []);

  // 應用深色模式
  const applyDarkMode = (isDarkMode) => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // 實際應用中這裡會更新主題設定
  };
  
  // 應用字型大小
  const applyFontSize = (size) => {
    document.documentElement.style.fontSize = 
      size === 'small' ? '14px' : 
      size === 'medium' ? '16px' : 
      size === 'large' ? '18px' : 
      size === 'xlarge' ? '20px' : '16px';
  };
  
  // 應用主題顏色
  const applyThemeColor = (color) => {
    const colors = {
      blue: { primary: '#6a9ec0', light: '#e6f2ff', rgb: '106, 158, 192' },
      green: { primary: '#7fb685', light: '#e6f9ed', rgb: '127, 182, 133' },
      purple: { primary: '#a886c5', light: '#f5e6fa', rgb: '168, 134, 197' },
      pink: { primary: '#e8a0bf', light: '#fce6f0', rgb: '232, 160, 191' },
      orange: { primary: '#e8b87b', light: '#fff4e6', rgb: '232, 184, 123' },
      gray: { primary: '#8e8e93', light: '#f2f2f7', rgb: '142, 142, 147' }
    };
    
    // 深色模式下的顏色調整
    const darkModeColors = {
      blue: { primary: '#6A9EFF', light: '#1a2a4d', rgb: '106, 158, 255' },
      green: { primary: '#7AC88C', light: '#1a2d20', rgb: '122, 200, 140' },
      purple: { primary: '#B68CE8', light: '#2a1a4d', rgb: '182, 140, 232' },
      pink: { primary: '#E8A0C8', light: '#4d1a3a', rgb: '232, 160, 200' },
      orange: { primary: '#E8B87B', light: '#4d3a1a', rgb: '232, 184, 123' },
      gray: { primary: '#AAAAAA', light: '#2a2a2a', rgb: '170, 170, 170' }
    };
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const selectedColor = isDarkMode ? darkModeColors[color] || darkModeColors.blue : colors[color] || colors.blue;
    
    document.documentElement.style.setProperty('--primary-color', selectedColor.primary);
    document.documentElement.style.setProperty('--primary-light', selectedColor.light);
    document.documentElement.style.setProperty('--primary-color-rgb', selectedColor.rgb);
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    setSettingsChanged(true);
    // 立即應用深色模式
    applyDarkMode(newValue);
  };

  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    setSettingsChanged(true);
  };

  const handleLanguageChange = (e) => {
    const newValue = e.target.value;
    changeLanguage(newValue);
    setSettingsChanged(true);
  };
  
  const handleThemeColorChange = (color) => {
    setThemeColor(color);
    setSettingsChanged(true);
    // 立即應用主題顏色
    applyThemeColor(color);
  };
  
  const handleFontSizeChange = (e) => {
    const newValue = e.target.value;
    setFontSize(newValue);
    setSettingsChanged(true);
    // 立即應用字型大小
    applyFontSize(newValue);
  };
  
  const handleNotificationTypeToggle = (type) => {
    const updatedTypes = {
      ...notificationTypes,
      [type]: !notificationTypes[type]
    };
    setNotificationTypes(updatedTypes);
    setSettingsChanged(true);
  };
  
  // 處理會員等級變更
  const handleMemberLevelChange = (level) => {
    setUser({
      ...user,
      memberLevel: level
    });
    setSettingsChanged(true);
  };
  
  // 儲存所有設定
  const handleSaveSettings = () => {
    setSavingSettings(true);
    
    // 模擬API請求延遲
    setTimeout(() => {
      // 儲存設定到 localStorage
      localStorage.setItem('darkMode', darkMode);
      localStorage.setItem('notifications', notifications);
      localStorage.setItem('themeColor', themeColor);
      localStorage.setItem('fontSize', fontSize);
      localStorage.setItem('notificationTypes', JSON.stringify(notificationTypes));
      localStorage.setItem('memberLevel', user.memberLevel);
      // 語言設定已在 handleLanguageChange 中透過 changeLanguage 函數更新

      setSavingSettings(false);
      setSettingsChanged(false);
      
      // 顯示儲存成功提示
      alert(texts.settings.saveSuccess);
    }, 1000);
  };

  const handleLogout = () => {
    // 先執行登出
    logout();
    // 強制導航到登入頁面
    navigate('/login', { replace: true });
  };
  
  // 處理編輯個人資料
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  // 獲取會員等級圖示和顏色
  const getMemberLevelInfo = (level) => {
    switch (level) {
      case 'gold':
        return { icon: '🏅', color: '#FFD700', name: texts.memberLevel.levels.gold.name };
      case 'diamond':
        return { icon: '💎', color: '#B9F2FF', name: texts.memberLevel.levels.diamond.name };
      case 'regular':
      default:
        return { icon: '👤', color: '#AAAAAA', name: texts.memberLevel.levels.regular.name };
    }
  };

  // 顏色選項
  const colorOptions = [
    { id: 'blue', name: texts.colorOptions.blue, color: '#6a9ec0' },
    { id: 'green', name: texts.colorOptions.green, color: '#7fb685' },
    { id: 'purple', name: texts.colorOptions.purple, color: '#a886c5' },
    { id: 'pink', name: texts.colorOptions.pink, color: '#e8a0bf' },
    { id: 'orange', name: texts.colorOptions.orange, color: '#e8b87b' },
    { id: 'gray', name: texts.colorOptions.gray, color: '#8e8e93' }
  ];

  return (
    <div className="content-area">
      {/* 用戶資料 */}
      <div className="wish-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="avatar-lg" 
              style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: user.isCustomAvatar ? '3px solid var(--primary-color)' : '3px solid transparent'
              }} 
            />
            {user.isCustomAvatar && (
              <div style={{ 
                position: 'absolute', 
                bottom: '-5px', 
                right: '-5px', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                borderRadius: '50%', 
                width: '24px', 
                height: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          <div style={{ marginLeft: '16px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>{user.name}</h3>
              <div style={{ 
                marginLeft: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: getMemberLevelInfo(user.memberLevel).color,
                color: user.memberLevel === 'regular' ? '#333' : '#333',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                <span style={{ marginRight: '4px' }}>{getMemberLevelInfo(user.memberLevel).icon}</span>
                {getMemberLevelInfo(user.memberLevel).name}
              </div>
              <div 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '8px', 
                  backgroundColor: 'var(--background-color)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  marginLeft: '5px',
                  border: '1px solid var(--border-color)'
                }}
                onClick={() => navigate('/member-level-info')}
                title="查看會員等級說明"
              >
                ?
              </div>
            </div>
            <div style={{ color: '#8e8e93', fontSize: '14px' }}>{user.email}</div>
            <div style={{ color: '#8e8e93', fontSize: '12px', marginTop: '4px' }}>
              {texts.settings.userProfile.joinTime}: {user.joinDate}
            </div>
            {user.isCustomAvatar && (
              <div style={{ 
                color: 'var(--primary-color)', 
                fontSize: '12px', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <i className="fas fa-check-circle"></i>
                使用專屬頭像
              </div>
            )}
          </div>
        </div>
        
        {user.bio && (
          <div style={{ marginTop: '12px', fontSize: '14px' }}>
            <p>{user.bio}</p>
          </div>
        )}
        
        <button 
          className="secondary-btn" 
          style={{ marginTop: '16px', width: '100%' }}
          onClick={handleEditProfile}
        >
          {texts.settings.userProfile.editProfile}
        </button>
      </div>
      
      {/* 應用設定 */}
      <div className="wish-card" style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h3 style={{ margin: 0 }}>{texts.settings.appSettings.title}</h3>
          <button 
            className="primary-btn" 
            style={{ 
              padding: '8px 16px',
              fontSize: '14px',
              opacity: settingsChanged ? 1 : 0.5
            }}
            disabled={!settingsChanged || savingSettings}
            onClick={handleSaveSettings}
          >
            {savingSettings ? texts.settings.appSettings.saving : texts.settings.appSettings.save}
          </button>
        </div>
        
        {/* 系統主色調 */}
        <div style={{ 
          padding: '12px 0',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{ marginBottom: '10px' }}>{texts.settings.appSettings.themeColor}</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {colorOptions.map(option => (
              <div 
                key={option.id}
                onClick={() => handleThemeColorChange(option.id)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: option.color,
                  cursor: 'pointer',
                  border: themeColor === option.id ? '3px solid #000' : '3px solid transparent',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {themeColor === option.id && (
                  <span style={{ color: 'white', fontSize: '18px' }}>✓</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap', 
            marginTop: '8px', 
            fontSize: '12px', 
            color: '#8e8e93' 
          }}>
            {colorOptions.map(option => (
              <div key={option.id} style={{ textAlign: 'center', width: '40px' }}>
                {option.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* 深色模式 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div>
            <div>{texts.settings.appSettings.darkMode.title}</div>
            <div style={{ color: '#8e8e93', fontSize: '12px' }}>
              {texts.settings.appSettings.darkMode.desc}
            </div>
          </div>
          <div 
            className="toggle-switch" 
            style={{
              width: '50px',
              height: '30px',
              backgroundColor: darkMode ? '#34c759' : '#e0e0e0',
              borderRadius: '15px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onClick={handleDarkModeToggle}
          >
            <div 
              style={{
                width: '26px',
                height: '26px',
                backgroundColor: 'white',
                borderRadius: '13px',
                position: 'absolute',
                top: '2px',
                left: darkMode ? '22px' : '2px',
                transition: 'left 0.3s'
              }}
            ></div>
          </div>
        </div>
        
        {/* 字型大小 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div>
            <div>{texts.settings.appSettings.fontSize.title}</div>
            <div style={{ color: '#8e8e93', fontSize: '12px' }}>
              {texts.settings.appSettings.fontSize.desc}
            </div>
          </div>
          <select 
            value={fontSize} 
            onChange={handleFontSizeChange}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: 'white'
            }}
          >
            <option value="small">{texts.settings.appSettings.fontSize.small}</option>
            <option value="medium">{texts.settings.appSettings.fontSize.medium}</option>
            <option value="large">{texts.settings.appSettings.fontSize.large}</option>
            <option value="xlarge">{texts.settings.appSettings.fontSize.xlarge}</option>
          </select>
        </div>
        
        {/* 通知設定 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div>
            <div>{texts.settings.appSettings.notifications.title}</div>
            <div style={{ color: '#8e8e93', fontSize: '12px' }}>
              {texts.settings.appSettings.notifications.desc}
            </div>
          </div>
          <div 
            className="toggle-switch" 
            style={{
              width: '50px',
              height: '30px',
              backgroundColor: notifications ? '#34c759' : '#e0e0e0',
              borderRadius: '15px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onClick={handleNotificationsToggle}
          >
            <div 
              style={{
                width: '26px',
                height: '26px',
                backgroundColor: 'white',
                borderRadius: '13px',
                position: 'absolute',
                top: '2px',
                left: notifications ? '22px' : '2px',
                transition: 'left 0.3s'
              }}
            ></div>
          </div>
        </div>
        
        {/* 通知類型設定 */}
        {notifications && (
          <div style={{ padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ marginBottom: '10px' }}>{texts.settings.appSettings.notifications.types.title}</div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 0'
            }}>
              <div>{texts.settings.appSettings.notifications.types.wishUpdates}</div>
              <div 
                className="toggle-switch" 
                style={{
                  width: '40px',
                  height: '24px',
                  backgroundColor: notificationTypes.wishUpdates ? '#34c759' : '#e0e0e0',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onClick={() => handleNotificationTypeToggle('wishUpdates')}
              >
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    position: 'absolute',
                    top: '2px',
                    left: notificationTypes.wishUpdates ? '18px' : '2px',
                    transition: 'left 0.3s'
                  }}
                ></div>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 0'
            }}>
              <div>{texts.settings.appSettings.notifications.types.friendActivity}</div>
              <div 
                className="toggle-switch" 
                style={{
                  width: '40px',
                  height: '24px',
                  backgroundColor: notificationTypes.friendActivity ? '#34c759' : '#e0e0e0',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onClick={() => handleNotificationTypeToggle('friendActivity')}
              >
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    position: 'absolute',
                    top: '2px',
                    left: notificationTypes.friendActivity ? '18px' : '2px',
                    transition: 'left 0.3s'
                  }}
                ></div>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 0'
            }}>
              <div>{texts.settings.appSettings.notifications.types.systemUpdates}</div>
              <div 
                className="toggle-switch" 
                style={{
                  width: '40px',
                  height: '24px',
                  backgroundColor: notificationTypes.systemUpdates ? '#34c759' : '#e0e0e0',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onClick={() => handleNotificationTypeToggle('systemUpdates')}
              >
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    position: 'absolute',
                    top: '2px',
                    left: notificationTypes.systemUpdates ? '18px' : '2px',
                    transition: 'left 0.3s'
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* 語言 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div>
            <div>{texts.settings.appSettings.language.title}</div>
            <div style={{ color: '#8e8e93', fontSize: '12px' }}>
              {texts.settings.appSettings.language.desc}
            </div>
          </div>
          <select 
            value={language} 
            onChange={handleLanguageChange}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: 'white'
            }}
          >
            <option value="zh-TW">繁體中文</option>
            <option value="en-US">English</option>
            <option value="ja-JP">日本語</option>
          </select>
        </div>
      </div>
      
      {/* 關於與支援 */}
      <div className="wish-card" style={{ padding: '20px' }}>
        <h3>{texts.settings.about.title}</h3>
        
        <div style={{ 
          padding: '12px 0',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'pointer'
        }} onClick={() => console.log('隱私政策')}>
          <div>{texts.settings.about.privacy}</div>
        </div>
        
        <div style={{ 
          padding: '12px 0',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'pointer'
        }} onClick={() => console.log('使用條款')}>
          <div>{texts.settings.about.terms}</div>
        </div>
        
        <div style={{ 
          padding: '12px 0',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'pointer'
        }} onClick={() => console.log('聯絡我們')}>
          <div>{texts.settings.about.contact}</div>
        </div>
        
        <div style={{ 
          padding: '12px 0',
          cursor: 'pointer'
        }} onClick={() => console.log('關於 WishHub')}>
          <div>{texts.settings.about.about}</div>
          <div style={{ color: '#8e8e93', fontSize: '12px' }}>
            {texts.settings.about.version} 1.0.0
          </div>
        </div>
      </div>
      
      {/* 登出按鈕 */}
      <div className="wish-card" style={{ marginTop: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: 'var(--danger-color)',
            color: 'white',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {texts.settings.logout}
        </button>
      </div>
    </div>
  );
}

export default Settings; 