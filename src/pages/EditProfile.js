import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function EditProfile() {
  const navigate = useNavigate();
  const { texts } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);
  const [memberLevel, setMemberLevel] = useState('regular');
  const fileInputRef = useRef(null);
  
  // 興趣選項
  const interestOptions = [
    { id: 1, name: texts.categories.learning, icon: '📚' },
    { id: 2, name: texts.categories.health, icon: '💪' },
    { id: 3, name: texts.categories.travel, icon: '✈️' },
    { id: 4, name: texts.categories.career, icon: '💼' },
    { id: 5, name: texts.categories.finance, icon: '💰' },
    { id: 6, name: texts.categories.creative, icon: '🎨' },
    { id: 7, name: texts.categories.relationship, icon: '❤️' },
    { id: 8, name: texts.categories.personalGrowth, icon: '🌱' }
  ];
  
  // 預設頭像選項
  const avatarOptions = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg',
  ];
  
  // 載入用戶資料
  useEffect(() => {
    // 從 localStorage 獲取用戶資料
    const userName = localStorage.getItem('userName') || '用戶';
    const userAvatar = localStorage.getItem('userAvatar') || 'https://randomuser.me/api/portraits/men/1.jpg';
    const userInterests = JSON.parse(localStorage.getItem('userInterests') || '[]');
    const userBio = localStorage.getItem('userBio') || '';
    const userCustomAvatar = localStorage.getItem('isCustomAvatar') === 'true';
    const userMemberLevel = localStorage.getItem('memberLevel') || 'regular';
    
    setNickname(userName);
    setAvatar(userAvatar);
    setPreviewAvatar(userAvatar);
    setSelectedInterests(userInterests);
    setBio(userBio);
    setIsCustomAvatar(userCustomAvatar);
    setMemberLevel(userMemberLevel);
  }, []);
  
  // 處理興趣選擇
  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(item => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };
  
  // 處理頭像選擇
  const handleAvatarSelect = (avatarUrl) => {
    setPreviewAvatar(avatarUrl);
    setIsCustomAvatar(false);
  };
  
  // 處理自定義頭像上傳
  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 檢查文件類型
      if (!file.type.match('image.*')) {
        alert('請選擇圖片文件！');
        return;
      }
      
      // 檢查文件大小（限制為 2MB）
      if (file.size > 2 * 1024 * 1024) {
        alert('圖片大小不能超過 2MB！');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target.result);
        setIsCustomAvatar(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 觸發文件選擇器
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // 獲取會員等級圖示和顏色
  const getMemberLevelInfo = (level) => {
    switch (level) {
      case 'gold':
        return { icon: '🏅', color: '#FFD700', name: texts.memberLevel.about.gold };
      case 'diamond':
        return { icon: '💎', color: '#B9F2FF', name: texts.memberLevel.about.diamond };
      case 'regular':
      default:
        return { icon: '👤', color: '#AAAAAA', name: texts.memberLevel.about.regular };
    }
  };
  
  // 處理表單提交
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // 模擬API請求延遲
    setTimeout(() => {
      // 儲存用戶資料到 localStorage
      localStorage.setItem('userName', nickname);
      localStorage.setItem('userAvatar', previewAvatar);
      localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
      localStorage.setItem('userBio', bio);
      localStorage.setItem('isCustomAvatar', isCustomAvatar.toString());
      // 會員等級在設定頁面管理，這裡不儲存
      
      setLoading(false);
      
      // 返回設定頁面
      navigate('/settings');
    }, 1000);
  };
  
  // 處理取消
  const handleCancel = () => {
    navigate('/settings');
  };
  
  return (
    <div className="content-area">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        gap: '10px' 
      }}>
        <button 
          type="button" 
          className="icon-btn" 
          onClick={handleCancel}
          style={{ 
            marginRight: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px'
          }}
        >
          ←
        </button>
        <button 
          type="button" 
          className="primary-btn" 
          onClick={handleSubmit}
          disabled={loading}
          style={{ 
            padding: '8px 16px',
            fontSize: '14px'
          }}
        >
          {loading ? texts.editProfile.saving : texts.editProfile.save}
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* 頭像選擇 */}
        <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3>{texts.editProfile.avatar}</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              border: '3px solid var(--primary-color)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}>
              <img 
                src={previewAvatar} 
                alt="預覽頭像" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              
              {/* 會員等級標誌 */}
              <div style={{ 
                position: 'absolute', 
                bottom: '-5px', 
                right: '-5px', 
                backgroundColor: getMemberLevelInfo(memberLevel).color,
                color: memberLevel === 'regular' ? '#333' : '#333',
                borderRadius: '50%', 
                width: '30px', 
                height: '30px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '16px',
                border: '2px solid white'
              }}>
                {getMemberLevelInfo(memberLevel).icon}
              </div>
            </div>
          </div>
          
          {/* 會員等級顯示 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: '20px',
            width: 'fit-content',
            margin: '0 auto 20px'
          }}>
            <div style={{
              backgroundColor: getMemberLevelInfo(memberLevel).color,
              color: memberLevel === 'regular' ? '#333' : '#333',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '4px' }}>{getMemberLevelInfo(memberLevel).icon}</span>
              {getMemberLevelInfo(memberLevel).name}
            </div>
            <div 
              style={{ 
                width: '18px', 
                height: '18px', 
                borderRadius: '9px', 
                backgroundColor: 'var(--background-color)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
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
          
          {/* 頭像選擇選項 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              {texts.editProfile.uploadCustomAvatar}
            </div>
            <button
              type="button"
              onClick={triggerFileInput}
              className="secondary-btn"
              style={{ width: '100%', marginBottom: '20px' }}
            >
              {texts.editProfile.chooseFile}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCustomAvatarUpload}
              style={{ display: 'none' }}
            />
            
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              {texts.editProfile.chooseDefaultAvatar}
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '10px' 
            }}>
              {avatarOptions.map((avatarUrl, index) => (
                <div
                  key={index}
                  onClick={() => handleAvatarSelect(avatarUrl)}
                  style={{
                    width: '100%',
                    paddingBottom: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    border: previewAvatar === avatarUrl ? '3px solid var(--primary-color)' : '3px solid transparent'
                  }}
                >
                  <img
                    src={avatarUrl}
                    alt={`Avatar option ${index + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 暱稱設定 */}
        <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3>{texts.editProfile.nickname}</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={texts.editProfile.nicknamePlaceholder}
              style={{ 
                width: 'calc(100% - 24px)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '16px'
              }}
            />
          </div>
        </div>
        
        {/* 背景故事設定 */}
        <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3>{texts.editProfile.bio.title}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
            {texts.editProfile.bio.desc}
          </p>
          
          <div style={{ marginBottom: '10px' }}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={texts.editProfile.bio.placeholder}
              style={{ 
                width: 'calc(100% - 24px)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '16px',
                minHeight: '120px',
                resize: 'vertical'
              }}
              maxLength={500}
            />
            <div style={{ 
              textAlign: 'right', 
              fontSize: '12px', 
              color: 'var(--text-secondary)',
              marginTop: '5px'
            }}>
              {bio.length}/500 {texts.editProfile.bio.charCount}
            </div>
          </div>
        </div>
        
        {/* 興趣設定 */}
        <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3>{texts.editProfile.interests.title}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
            {texts.editProfile.interests.desc}
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '10px',
            marginBottom: '10px'
          }}>
            {interestOptions.map(option => (
              <div
                key={option.id}
                onClick={() => toggleInterest(option.id)}
                style={{ 
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: selectedInterests.includes(option.id) ? 'var(--primary-color)' : 'var(--card-color)',
                  color: selectedInterests.includes(option.id) ? 'white' : 'var(--text-primary)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>{option.icon}</div>
                <div style={{ fontSize: '14px' }}>{option.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 按鈕 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="secondary-btn" 
            style={{ flex: 1 }}
            onClick={handleCancel}
          >
            {texts.editProfile.cancel}
          </button>
          <button 
            type="submit" 
            className="primary-btn" 
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? texts.editProfile.saving : texts.editProfile.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile; 