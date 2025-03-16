import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function CreateChallenge() {
  const navigate = useNavigate();
  const { texts } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [selectedWish, setSelectedWish] = useState('');
  
  // 表單狀態
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [challengeDuration, setChallengeDuration] = useState(7);
  const [participantScope, setParticipantScope] = useState('public'); // 'public' 或 'friends'
  const [challengeCategory, setChallengeCategory] = useState('');
  
  // 模擬類別選項
  const categoryOptions = [
    { value: 'fitness', label: '健身' },
    { value: 'learning', label: '學習' },
    { value: 'reading', label: '閱讀' },
    { value: 'lifestyle', label: '生活習慣' },
    { value: 'career', label: '職業發展' },
    { value: 'hobby', label: '興趣愛好' }
  ];
  
  // 模擬獲取用戶的願望列表
  useEffect(() => {
    // 模擬API請求
    const timer = setTimeout(() => {
      const mockWishes = [
        { id: 101, title: '學習日文 N3 程度', category: '學習' },
        { id: 102, title: '每週健身三次', category: '健身' },
        { id: 104, title: '閱讀10本經典文學作品', category: '閱讀' },
        { id: 107, title: '學習Python編程', category: '學習' },
        { id: 108, title: '完成半程馬拉松', category: '健身' },
        { id: 109, title: '環遊日本', category: '旅行' }
      ];
      
      setWishes(mockWishes);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 處理表單提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 表單驗證
    if (!challengeTitle.trim() || !challengeDescription.trim() || !challengeCategory) {
      alert('請填寫所有必填欄位');
      return;
    }
    
    // 模擬提交數據
    setLoading(true);
    
    // 模擬API請求
    setTimeout(() => {
      setLoading(false);
      
      // 提交成功後導航回社群頁面
      alert('挑戰創建成功！');
      navigate('/community');
    }, 1000);
  };
  
  return (
    <div className="content-area">
      <h2>發起心願挑戰</h2>
      
      <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
          創建一個挑戰，邀請其他人一起完成你的心願目標。設定明確的時間和目標，讓更多人參與進來！
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* 挑戰標題 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              挑戰標題 <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={challengeTitle}
              onChange={(e) => setChallengeTitle(e.target.value)}
              placeholder="例如：7天冥想挑戰、每週讀一本書挑戰"
              style={{ 
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          {/* 挑戰描述 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              挑戰描述 <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              value={challengeDescription}
              onChange={(e) => setChallengeDescription(e.target.value)}
              placeholder="描述這個挑戰的具體內容、規則和目標..."
              style={{ 
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                minHeight: '120px',
                resize: 'vertical'
              }}
              required
            />
          </div>
          
          {/* 挑戰類別 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              挑戰類別 <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              value={challengeCategory}
              onChange={(e) => setChallengeCategory(e.target.value)}
              style={{ 
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
              required
            >
              <option value="">請選擇類別</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 挑戰時長 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              挑戰時長（天）
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setChallengeDuration(prev => Math.max(1, prev - 1))}
                style={{ 
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: 'white',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="90"
                value={challengeDuration}
                onChange={(e) => setChallengeDuration(parseInt(e.target.value) || 7)}
                style={{ 
                  width: '80px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px',
                  textAlign: 'center',
                  margin: '0 10px'
                }}
              />
              <button
                type="button"
                onClick={() => setChallengeDuration(prev => Math.min(90, prev + 1))}
                style={{ 
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: 'white',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
              <span style={{ marginLeft: '10px', color: 'var(--text-secondary)' }}>
                天（1-90天）
              </span>
            </div>
          </div>
          
          {/* 參與者範圍 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              誰可以參與這個挑戰？
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="participantScope"
                  value="public"
                  checked={participantScope === 'public'}
                  onChange={() => setParticipantScope('public')}
                  style={{ marginRight: '8px' }}
                />
                所有人
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="participantScope"
                  value="friends"
                  checked={participantScope === 'friends'}
                  onChange={() => setParticipantScope('friends')}
                  style={{ marginRight: '8px' }}
                />
                僅限好友
              </label>
            </div>
          </div>
          
          {/* 關聯心願（可選） */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              關聯到我的心願（可選）
            </label>
            <select
              value={selectedWish}
              onChange={(e) => setSelectedWish(e.target.value)}
              style={{ 
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              <option value="">不關聯心願</option>
              {wishes.map(wish => (
                <option key={wish.id} value={wish.id}>
                  {wish.title} ({wish.category})
                </option>
              ))}
            </select>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              關聯心願後，挑戰進度將與心願進度同步
            </div>
          </div>
          
          {/* 提交按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              style={{ 
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid var(--primary-color)',
                backgroundColor: 'white',
                color: 'var(--primary-color)',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ 
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '創建中...' : '創建挑戰'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChallenge; 