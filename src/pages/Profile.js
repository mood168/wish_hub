import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  
  // 模擬用戶數據
  const [userData, setUserData] = useState({
    name: '王小明',
    username: 'xiaoming123',
    email: 'xiaoming@example.com',
    avatar: '👨‍💻',
    bio: '熱愛學習和旅行的軟體工程師，希望透過這個平台實現我的各種願望！',
    joinDate: '2023-01-15',
    location: '台北市',
    website: 'https://xiaoming.dev',
    socialLinks: {
      twitter: '@xiaoming',
      instagram: '@xiaoming_travel',
      linkedin: 'xiaoming-wang'
    }
  });
  
  // 編輯模式狀態
  const [isEditing, setIsEditing] = useState(false);
  
  // 編輯表單數據
  const [formData, setFormData] = useState({...userData});
  
  // 模擬用戶統計數據
  const stats = {
    wishes: 12,
    completed: 5,
    inProgress: 7,
    followers: 28,
    following: 35
  };
  
  // 模擬成就數據
  const achievements = [
    { id: 1, name: '初學者', icon: '🌱', date: '2023-01-20' },
    { id: 2, name: '堅持不懈', icon: '⏱️', date: '2023-02-28' },
    { id: 3, name: '社交蝴蝶', icon: '🦋', date: '2023-03-15' }
  ];
  
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
    // 實際應用中這裡會發送API請求更新用戶資料
    console.log('提交的用戶資料:', formData);
  };
  
  // 取消編輯
  const handleCancel = () => {
    setFormData({...userData});
    setIsEditing(false);
  };
  
  return (
    <div className="content-area">
      {/* 頂部導航欄 */}
      {isEditing && (
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
      )}
      
      {!isEditing && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>個人資料</h2>
          <button 
            className="primary-btn" 
            onClick={() => setIsEditing(true)}
          >
            編輯
          </button>
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
              {userData.avatar}
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{userData.name}</h3>
              <div style={{ color: '#8e8e93', marginBottom: '5px' }}>@{userData.username}</div>
              <div style={{ fontSize: '14px', color: '#636366' }}>
                加入時間：{userData.joinDate}
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p>{userData.bio}</p>
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
          
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            {userData.socialLinks.twitter && (
              <a 
                href={`https://twitter.com/${userData.socialLinks.twitter.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  marginRight: '15px',
                  color: '#1da1f2',
                  fontSize: '20px',
                  textDecoration: 'none'
                }}
              >
                🐦
              </a>
            )}
            
            {userData.socialLinks.instagram && (
              <a 
                href={`https://instagram.com/${userData.socialLinks.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  marginRight: '15px',
                  color: '#e1306c',
                  fontSize: '20px',
                  textDecoration: 'none'
                }}
              >
                📸
              </a>
            )}
            
            {userData.socialLinks.linkedin && (
              <a 
                href={`https://linkedin.com/in/${userData.socialLinks.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#0077b5',
                  fontSize: '20px',
                  textDecoration: 'none'
                }}
              >
                💼
              </a>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '15px 0',
            borderTop: '1px solid #e0e0e0',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{stats.wishes}</div>
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>願望</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{stats.completed}</div>
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>已完成</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{stats.inProgress}</div>
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>進行中</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{stats.followers}</div>
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>粉絲</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{stats.following}</div>
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>關注</div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                頭像表情
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
              <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '5px' }}>
                輸入一個表情符號作為您的頭像
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                姓名
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                用戶名
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                電子郵件
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                個人簡介
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                所在地
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                個人網站
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Twitter
              </label>
              <input
                type="text"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Instagram
              </label>
              <input
                type="text"
                name="socialLinks.instagram"
                value={formData.socialLinks.instagram}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                LinkedIn
              </label>
              <input
                type="text"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleInputChange}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>
        </form>
      )}
      
      {/* 成就展示區 */}
      {!isEditing && (
        <div>
          <h3>成就徽章</h3>
          <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '0 15px 15px 0',
                    width: '80px'
                  }}
                >
                  <div style={{ 
                    fontSize: '32px', 
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f2f2f7',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '5px'
                  }}>
                    {achievement.icon}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    {achievement.name}
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#8e8e93',
                    textAlign: 'center'
                  }}>
                    {achievement.date}
                  </div>
                </div>
              ))}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: '0 15px 15px 0',
                  width: '80px'
                }}
              >
                <div style={{ 
                  fontSize: '32px', 
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#f2f2f7',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '5px',
                  opacity: 0.5
                }}>
                  🔍
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#8e8e93'
                }}>
                  查看更多
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <button 
              className="secondary-btn" 
              style={{ width: '100%' }}
              onClick={() => navigate('/rewards')}
            >
              前往獎勵中心
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile; 