import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';

function ProfileEditModal({ user, onClose, onSave }) {
  const { userService } = useDatabase();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    location: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 初始化表單數據
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
  }, [user]);

  // 處理輸入變化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 處理頭像上傳
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 在實際應用中，這裡會上傳圖片到伺服器或雲存儲
      // 這裡使用 FileReader 將圖片轉換為 base64 字符串
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let updatedUser;
      
      // 檢查用戶是否有 id
      if (user.id) {
        // 更新現有用戶資料
        updatedUser = await userService.updateUser(user.id, formData);
      } else {
        // 如果用戶沒有 id，先通過電子郵件查詢用戶
        const existingUser = await userService.getUserByEmail(formData.email);
        
        if (existingUser) {
          // 如果用戶存在，更新用戶資料
          updatedUser = await userService.updateUser(existingUser.id, formData);
        } else {
          // 如果用戶不存在，創建新用戶
          const userId = await userService.saveUser({
            ...formData,
            joinDate: new Date().toISOString()
          });
          updatedUser = await userService.getUser(userId);
        }
      }
      
      // 更新 localStorage 中的用戶名
      if (formData.name) {
        localStorage.setItem('userName', formData.name);
      }
      
      // 通知父組件保存成功
      onSave(updatedUser);
      onClose();
    } catch (err) {
      console.error('更新用戶資料時出錯:', err);
      setError('更新資料失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
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
      <div className="modal-content" style={{
        backgroundColor: 'var(--card-background)',
        color: 'var(--text-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2>編輯個人資料</h2>
        
        {error && (
          <div style={{
            backgroundColor: 'var(--danger-color-light)',
            color: 'var(--danger-color)',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* 頭像上傳 */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                src={formData.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                alt="頭像" 
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <label htmlFor="avatar-upload" style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <i className="fas fa-camera"></i>
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          
          {/* 姓名 */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              姓名
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-background)',
                color: 'var(--text-primary)'
              }}
              required
            />
          </div>
          
          {/* 電子郵件 */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              電子郵件
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-background)',
                color: 'var(--text-primary)',
                opacity: 0.7
              }}
              required
              disabled
            />
            <small style={{ color: 'var(--text-secondary)' }}>電子郵件無法修改</small>
          </div>
          
          {/* 個人簡介 */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              個人簡介
            </label>
            <textarea 
              id="bio" 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-background)',
                color: 'var(--text-primary)',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>
          
          {/* 所在地 */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              所在地
            </label>
            <input 
              type="text" 
              id="location" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-background)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          {/* 個人網站 */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="website" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              個人網站
            </label>
            <input 
              type="url" 
              id="website" 
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-background)',
                color: 'var(--text-primary)'
              }}
              placeholder="https://"
            />
          </div>
          
          {/* 按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-background)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              取消
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '儲存中...' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEditModal; 