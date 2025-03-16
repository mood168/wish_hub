import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function CreateSupport() {
  const navigate = useNavigate();
  const { texts } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [selectedWish, setSelectedWish] = useState('');
  
  // 表單狀態
  const [supportTitle, setSupportTitle] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [supportType, setSupportType] = useState('advice'); // 'advice', 'resource', 'partner', 'other'
  const [supportCategory, setSupportCategory] = useState('');
  
  // 模擬類別選項
  const categoryOptions = [
    { value: 'fitness', label: '健身' },
    { value: 'learning', label: '學習' },
    { value: 'reading', label: '閱讀' },
    { value: 'travel', label: '旅行' },
    { value: 'career', label: '職業發展' },
    { value: 'hobby', label: '興趣愛好' }
  ];
  
  // 支援類型選項
  const supportTypeOptions = [
    { value: 'advice', label: '建議與指導', icon: '💡', description: '尋求他人的經驗分享和專業建議' },
    { value: 'resource', label: '學習資源', icon: '📚', description: '尋找書籍、課程、工具等資源' },
    { value: 'partner', label: '尋找夥伴', icon: '👥', description: '尋找志同道合的夥伴一起完成目標' },
    { value: 'other', label: '其他支援', icon: '🔄', description: '其他類型的支援需求' }
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
  
  // 當選擇願望時自動填充類別
  useEffect(() => {
    if (selectedWish) {
      const wish = wishes.find(w => w.id.toString() === selectedWish.toString());
      if (wish) {
        // 根據願望類別設置支援類別
        const category = categoryOptions.find(c => c.label === wish.category);
        if (category) {
          setSupportCategory(category.value);
        }
        
        // 自動生成標題
        if (!supportTitle) {
          setSupportTitle(`尋求關於「${wish.title}」的支援`);
        }
      }
    }
  }, [selectedWish, wishes, supportTitle]);
  
  // 處理表單提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 表單驗證
    if (!supportTitle.trim() || !supportDescription.trim() || !supportCategory || !selectedWish) {
      alert('請填寫所有必填欄位並選擇一個心願');
      return;
    }
    
    // 模擬提交數據
    setLoading(true);
    
    // 模擬API請求
    setTimeout(() => {
      setLoading(false);
      
      // 提交成功後導航回社群頁面
      alert('支援請求創建成功！');
      navigate('/community');
    }, 1000);
  };
  
  return (
    <div className="content-area">
      <h2>發起心願支援</h2>
      
      <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
          尋求社群中其他用戶的幫助，獲取建議、資源或找到志同道合的夥伴，一起實現你的心願！
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* 選擇心願 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              選擇需要支援的心願 <span style={{ color: 'red' }}>*</span>
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
              required
            >
              <option value="">請選擇一個心願</option>
              {wishes.map(wish => (
                <option key={wish.id} value={wish.id}>
                  {wish.title} ({wish.category})
                </option>
              ))}
            </select>
          </div>
          
          {/* 支援類型 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              支援類型 <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '15px' 
            }}>
              {supportTypeOptions.map(option => (
                <div 
                  key={option.value}
                  style={{ 
                    padding: '15px',
                    borderRadius: '8px',
                    border: `2px solid ${supportType === option.value ? 'var(--primary-color)' : '#e0e0e0'}`,
                    backgroundColor: supportType === option.value ? 'rgba(var(--primary-rgb), 0.05)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSupportType(option.value)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px', marginRight: '10px' }}>{option.icon}</span>
                    <span style={{ fontWeight: 'bold' }}>{option.label}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {option.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 支援標題 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              支援標題 <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={supportTitle}
              onChange={(e) => setSupportTitle(e.target.value)}
              placeholder="簡短描述你需要的支援"
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
          
          {/* 支援描述 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              詳細描述 <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              value={supportDescription}
              onChange={(e) => setSupportDescription(e.target.value)}
              placeholder="詳細描述你需要什麼樣的支援，以及你目前遇到的困難..."
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
          
          {/* 支援類別 */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              支援類別 <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              value={supportCategory}
              onChange={(e) => setSupportCategory(e.target.value)}
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
              {loading ? '發布中...' : '發布支援請求'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSupport; 