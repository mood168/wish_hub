import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../context/DatabaseContext';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userService } = useDatabase();
  
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 載入用戶資料
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!user?.email) {
          navigate('/login');
          return;
        }
        
        const dbUser = await userService.getUserByEmail(user.email);
        if (!dbUser) {
          setError('找不到用戶資料');
          return;
        }
        
        const { password, ...userWithoutPassword } = dbUser;
        setUserData(userWithoutPassword);
        setFormData(userWithoutPassword);
        setLoading(false);
      } catch (error) {
        console.error('載入用戶資料失敗:', error);
        setError('載入用戶資料失敗');
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user, navigate, userService]);
  
  // 處理表單輸入變化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateUser(userData.id, formData);
      const { password, ...userWithoutPassword } = updatedUser;
      setUserData(userWithoutPassword);
      setIsEditing(false);
    } catch (error) {
      console.error('更新用戶資料失敗:', error);
      setError('更新用戶資料失敗');
    }
  };
  
  // 取消編輯
  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!userData) {
    return <div>無用戶資料</div>;
  }
  
  return (
    <div className="content-area">
      {/* 頂部導航欄 */}
      {isEditing ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <button 
            className="text-btn" 
            onClick={handleCancel}
          >
            取消
          </button>
          <h2 style={{ margin: 0 }}>編輯資料</h2>
          <button 
            className="primary-btn" 
            onClick={handleSubmit}
          >
            儲存
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <button 
              className="primary-btn" 
              onClick={() => setIsEditing(true)}
              style={{ marginRight: '10px' }}
            >
              編輯
            </button>
            <button 
              className="danger-btn" 
              onClick={logout}
            >
              登出
            </button>
          </div>
        </div>
      )}
      
      {/* 用戶資料卡片 */}
      {!isEditing ? (
        <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ 
              fontSize: '48px', 
              marginRight: '20px',
              width: '80px',
              height: '80px',
              backgroundColor: '#f2f2f7',
              borderRadius: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {userData.avatar || '👤'}
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{userData.name}</h3>
              <div style={{ color: '#8e8e93', marginBottom: '5px' }}>@{userData.username}</div>
              <div style={{ fontSize: '14px', color: '#636366' }}>
                加入時間：{new Date(userData.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p>{userData.bio || '這個用戶很懶，什麼都沒寫。'}</p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px' }}>
            {userData.location && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginRight: '20px',
                fontSize: '14px',
                color: '#636366'
              }}>
                <span style={{ marginRight: '5px' }}>📍</span>
                <span>{userData.location}</span>
              </div>
            )}
            
            {userData.website && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '14px',
                color: '#636366'
              }}>
                <span style={{ marginRight: '5px' }}>🔗</span>
                <a 
                  href={userData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#007aff', textDecoration: 'none' }}
                >
                  {userData.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="wish-card" style={{ padding: '20px' }}>
          <div className="form-group">
            <label>名稱</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>用戶名</label>
            <input
              type="text"
              name="username"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>個人簡介</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>所在地</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>個人網站</label>
            <input
              type="url"
              name="website"
              value={formData.website || ''}
              onChange={handleInputChange}
            />
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile; 