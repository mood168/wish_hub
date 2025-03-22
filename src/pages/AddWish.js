import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServicesContext';

// 優先級顏色映射
const getPriorityColor = (priority) => {
  const colors = {
    high: '#ff3b30',    // 紅色
    medium: '#ff9500',  // 橙色
    low: '#34c759'      // 綠色
  };
  return colors[priority] || colors.medium;
};

// 優先級文字映射
const getPriorityText = (priority) => {
  const texts = {
    high: '高優先級',
    medium: '中優先級',
    low: '低優先級'
  };
  return texts[priority] || texts.medium;
};

function AddWish() {
  const { wishService, isLoading: dbLoading } = useDatabase();
  const { texts } = useLanguage();
  const { user } = useAuth();
  const { services } = useServices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // 基本資訊
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('1');
  const [visibility, setVisibility] = useState('public');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // 步驟設定
  const [stepInput, setStepInput] = useState('');
  const [steps, setSteps] = useState([]);
  
  // 目標設定
  const [dailyGoalInput, setDailyGoalInput] = useState('');
  const [weeklyGoalInput, setWeeklyGoalInput] = useState('');
  const [dailyGoals, setDailyGoals] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [aiMode, setAiMode] = useState('easyToHard');
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [activeGoalType, setActiveGoalType] = useState('daily');
  
  // 筆記本
  const [notebookContent, setNotebookContent] = useState('');
  
  const navigate = useNavigate();

  // 預設分類選項
  const categories = [
    { id: 'learning', name: texts.categories.learning },
    { id: 'fitness', name: texts.categories.fitness },
    { id: 'travel', name: texts.categories.travel },
    { id: 'career', name: texts.categories.career },
    { id: 'finance', name: texts.categories.finance },
    { id: 'hobby', name: texts.categories.hobby },
    { id: 'other', name: texts.categories.other }
  ];

  // 處理目標添加
  const handleAddGoal = (e) => {
    e.preventDefault();

    if (activeGoalType === 'daily') {
      if (!dailyGoalInput.trim()) return;
    setDailyGoals([...dailyGoals, dailyGoalInput.trim()]);
    setDailyGoalInput('');
    } else if (activeGoalType === 'weekly') {
      if (!weeklyGoalInput.trim()) return;
      setWeeklyGoals([...weeklyGoals, weeklyGoalInput.trim()]);
      setWeeklyGoalInput('');
    }
  };

  // 處理每日目標刪除
  const handleRemoveGoal = (index) => {
    setDailyGoals(dailyGoals.filter((_, i) => i !== index));
  };
  
  // 處理每週目標刪除
  const handleRemoveWeeklyGoal = (index) => {
    setWeeklyGoals(weeklyGoals.filter((_, i) => i !== index));
  };

  // 獲取AI建議的目標
  const handleGetAiSuggestions = async () => {
    setShowAiSuggestions(true);
    // TODO: 實現AI建議功能
    // 這裡可以調用後端API來獲取AI建議
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('請輸入願望名稱');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 檢查用戶是否已登入
      if (!user) {
        throw new Error('請先登入');
      }
      
      console.log('用戶資訊:', user);
      console.log('wishService 對象:', wishService);
      
      // 檢查 WishService 實例的方法
      if (typeof wishService.addWish !== 'function') {
        console.error('wishService.addWish 不是一個函數');
        throw new Error('系統錯誤: 添加願望功能不可用');
      }
      
      // 使用當前日期時間作為臨時ID，確保是字串類型
      const tempId = `wish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // 創建願望對象
      const wishData = {
        id: tempId,  // 添加臨時ID (字串類型)
        title: title.trim(),
        description: description.trim(),
        category,
        priority: priority, // 使用字串類型
        visibility,
        isAnonymous,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: String(user.id || user.uid || tempId),  // 確保使用正確的ID並轉為字串
        username: user.name || user.displayName || '匿名用戶',
        userAvatar: user.avatar || user.photoURL || '',
        progress: 0,
        steps: steps.map(step => ({ 
          id: `step_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          text: step, 
          completed: false 
        })),
        dailyGoals: dailyGoals,
        weeklyGoals: weeklyGoals,
        comments: [],
        likes: 0,
        shares: 0,
        status: 'active',
        dailyProgress: {},  // 添加空的進度數據結構
        weeklyProgress: {},
        progressByDate: {},
        notebookContent: notebookContent
      };
      
      console.log('準備添加的願望數據:', wishData);
      
      // 使用 try-catch 包裝 addWish 調用
      let result;
      try {
        console.log('開始調用 wishService.addWish');
        result = await wishService.addWish(wishData);
        console.log('wishService.addWish 調用完成，結果:', result);
      } catch (addError) {
        console.error('調用 wishService.addWish 出錯:', addError);
        throw new Error(`添加願望時出現系統錯誤: ${addError.message}`);
      }
      
      if (result) {
        console.log('願望添加成功, 返回數據:', result);
        // 使用正確的 ID 導航到新願望頁面
        const newWishId = result.id || result;
        navigate(`/wish/${newWishId}`);
      } else {
        throw new Error('添加願望失敗: 系統未返回有效結果');
      }
    } catch (error) {
      console.error('添加願望錯誤:', error);
      setError(`添加願望時出錯: ${error.message || '未知錯誤'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (dbLoading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div className="content-area" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        {/* 按鈕區塊 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <button 
            type="button"
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid var(--primary-color)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'white',
              color: 'var(--primary-color)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            取消，回上一頁
          </button>
          <button 
            type="submit"
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? texts.addWish.submitting : texts.addWish.submit}
          </button>
        </div>

        {/* 願望基本資訊區塊 */}
        <div style={{ 
          marginBottom: '20px',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            margin: '0',
            padding: '15px 20px',
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <i className="fas fa-star" style={{ color: 'var(--primary-color)' }}></i>
            願望基本資訊
          </h3>

          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '15px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                <i className="fas fa-heading" style={{ marginRight: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}></i>
                願望標題
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入願望標題..."
            required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '15px',
                  backgroundColor: 'var(--background-color)'
                }}
          />
        </div>
        
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '15px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                <i className="fas fa-align-left" style={{ marginRight: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}></i>
                願望描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
                placeholder="描述你的願望..."
            required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '15px',
                  backgroundColor: 'var(--background-color)',
                  minHeight: '120px',
                  resize: 'vertical'
                }}
              />
        </div>
        
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '15px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                <i className="fas fa-tag" style={{ marginRight: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}></i>
                類別
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '15px',
                  backgroundColor: 'var(--background-color)',
                  cursor: 'pointer'
                }}
              >
                <option value="">選擇類別</option>
                <option value="學習">學習</option>
                <option value="健身">健身</option>
                <option value="閱讀">閱讀</option>
                <option value="旅行">旅行</option>
                <option value="職業發展">職業發展</option>
                <option value="理財">理財</option>
                <option value="興趣愛好">興趣愛好</option>
                <option value="人際關係">人際關係</option>
                <option value="生活品質">生活品質</option>
                <option value="其他">其他</option>
              </select>
            </div>

            {/* 筆記本區塊 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '15px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                <i className="fas fa-book" style={{ marginRight: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}></i>
                私人筆記本 (僅創建者可見)
              </label>
              <textarea
                placeholder="在這裡記錄你的私人筆記，幫助你實現願望的想法、資源或提醒事項..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '15px',
                  backgroundColor: 'var(--background-color)',
                  minHeight: '120px',
                  resize: 'vertical'
                }}
                value={notebookContent}
                onChange={(e) => setNotebookContent(e.target.value)}
              />
              <div style={{ 
                fontSize: '13px', 
                color: 'var(--text-secondary)',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <i className="fas fa-lock" style={{ fontSize: '12px' }}></i>
                此筆記僅供個人查看，不會在願望頁面公開顯示
              </div>
            </div>
          </div>
        </div>

        {/* 願望 To-Do List (TDL) 設定 */}
        <div style={{ 
              marginBottom: '20px',
              backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ 
            margin: '0',
            padding: '15px 20px',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid var(--border-color)'
              }}>
            <i className="fas fa-list-check" style={{ color: 'var(--primary-color)' }}></i>
            願望To-Do List (TDL)
              </h3>

          <div style={{ padding: '20px' }}>
              {/* 目標類型選擇器 */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
              marginBottom: '15px',
                backgroundColor: 'var(--background-color)',
                padding: '4px',
                borderRadius: 'var(--radius-md)'
              }}>
                <button
                  type="button"
                onClick={() => setActiveGoalType('daily')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeGoalType === 'daily' ? 'white' : 'transparent',
                  color: activeGoalType === 'daily' ? 'var(--primary-color)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                  fontWeight: activeGoalType === 'daily' ? '600' : '400',
                  boxShadow: activeGoalType === 'daily' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  每日To-Do List
                </button>
                <button
                  type="button"
                onClick={() => setActiveGoalType('weekly')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeGoalType === 'weekly' ? 'white' : 'transparent',
                  color: activeGoalType === 'weekly' ? 'var(--primary-color)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                  fontWeight: activeGoalType === 'weekly' ? '600' : '400',
                  boxShadow: activeGoalType === 'weekly' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  每周To-Do List
                </button>
              </div>
              
              {/* 目標輸入區 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <input
                  type="text"
                placeholder={activeGoalType === 'daily' ? "輸入每日TDL" : "輸入每週TDL"}
                value={activeGoalType === 'daily' ? dailyGoalInput : weeklyGoalInput}
                onChange={(e) => activeGoalType === 'daily' 
                  ? setDailyGoalInput(e.target.value) 
                  : setWeeklyGoalInput(e.target.value)
                }
                  style={{ 
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '14px',
                  backgroundColor: 'var(--background-color)'
                  }}
                />
                <button 
                  type="button" 
                  onClick={handleAddGoal}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  新增
                </button>
              </div>
              
              {/* 目標列表 */}
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* 每日目標列表 */}
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                  marginBottom: '10px',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <i className="fas fa-list-ul" style={{ fontSize: '14px', color: 'var(--primary-color)' }}></i>
                    每日TDL項目
                  </h4>
                  {dailyGoals.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {dailyGoals.map((goal, index) => (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          padding: '10px',
                            backgroundColor: 'var(--background-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '14px'
                          }}
                        >
                          <span style={{ flex: 1 }}>{goal}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveGoal(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '4px',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ 
                      color: 'var(--text-secondary)',
                      textAlign: 'center', 
                    margin: '10px 0',
                      fontSize: '14px'
                    }}>
                      未設定每日TDL
                    </p>
                  )}
                </div>

                {/* 每週目標列表 */}
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                  marginBottom: '10px',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <i className="fas fa-list-check" style={{ fontSize: '14px', color: 'var(--primary-color)' }}></i>
                    每周TDL項目
                  </h4>
                  {weeklyGoals.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {weeklyGoals.map((goal, index) => (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          padding: '10px',
                            backgroundColor: 'var(--background-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '14px'
                          }}
                        >
                          <span style={{ flex: 1 }}>{goal}</span>
                          <button
                            type="button"
                          onClick={() => handleRemoveWeeklyGoal(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '4px',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ 
                      color: 'var(--text-secondary)',
                      textAlign: 'center', 
                    margin: '10px 0',
                      fontSize: '14px'
                    }}>
                      未設定每周TDL
                    </p>
                  )}
                </div>
              </div>
              
            {/* AI建議設定 - 置於TDL列表下方 */}
              <div style={{ 
              marginTop: '15px',
                padding: '12px',
              backgroundColor: 'var(--background-color)', 
              borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontWeight: '500' }}>
                    AI建議設定
                  </div>
                  <button
                    type="button"
                    onClick={handleGetAiSuggestions}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    獲取建議
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setAiMode('easyToHard')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: aiMode === 'easyToHard' ? 'var(--primary-color)' : 'white',
                      color: aiMode === 'easyToHard' ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    由易到難
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiMode('average')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: aiMode === 'average' ? 'var(--primary-color)' : 'white',
                      color: aiMode === 'average' ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    平均難度
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiMode('hardToEasy')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: aiMode === 'hardToEasy' ? 'var(--primary-color)' : 'white',
                      color: aiMode === 'hardToEasy' ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    由難到易
                  </button>
              </div>
                </div>
              </div>
            </div>
            
            {/* 其他設定區塊 */}
        <div style={{ 
              marginBottom: '20px',
              backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ 
            margin: '0',
            padding: '15px 20px',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid var(--border-color)'
              }}>
            <i className="fas fa-cog" style={{ color: 'var(--primary-color)' }}></i>
                其他設定
              </h3>

          <div style={{ padding: '20px' }}>
              {/* 優先級 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                marginBottom: '10px', 
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>
                  優先級
                </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                  {['high', 'medium', 'low'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      style={{
                        flex: 1,
                      padding: '10px',
                        border: `2px solid ${priority === p ? getPriorityColor(p) : 'transparent'}`,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: `${getPriorityColor(p)}20`,
                        color: getPriorityColor(p),
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: priority === p ? '600' : '400',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {getPriorityText(p)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 公開設定 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                marginBottom: '10px', 
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>
                公開設定
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                  style={{
                      flex: 1,
                    padding: '10px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: visibility === 'public' ? 'var(--primary-color)' : 'var(--background-color)',
                      color: visibility === 'public' ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: visibility === 'public' ? '600' : '400'
                    }}
                  >
                  公開
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('friends')}
                    style={{
                      flex: 1,
                    padding: '10px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: visibility === 'friends' ? 'var(--primary-color)' : 'var(--background-color)',
                    color: visibility === 'friends' ? 'white' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                    fontWeight: visibility === 'friends' ? '600' : '500'
                    }}
                  >
                  好友
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    style={{
                      flex: 1,
                    padding: '10px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: visibility === 'private' ? 'var(--primary-color)' : 'var(--background-color)',
                      color: visibility === 'private' ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: visibility === 'private' ? '600' : '400'
                    }}
                  >
                  私人
                  </button>
                </div>
              
              {/* 公開設定說明 */}
              {visibility === 'public' && (
                <div style={{ 
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5'
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    <i className="fas fa-globe" style={{ marginRight: '5px', color: 'var(--primary-color)' }}></i> 
                    公開模式
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    <li>所有人都可以查看此願望的詳細資訊</li>
                    <li>其他用戶可以查看您的 To-Do List 項目</li>
                    <li>僅您能進行編輯和修改</li>
                    <li>筆記本功能僅對您可見</li>
                  </ul>
              </div>
              )}
              
              {visibility === 'friends' && (
                <div style={{ 
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: 'var(--background-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5'
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    <i className="fas fa-user-friends" style={{ marginRight: '5px', color: 'var(--primary-color)' }}></i> 
                    好友模式
                </div>
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    <li>僅您的好友可以查看此願望的詳細資訊</li>
                    <li>非好友用戶無法訪問此願望</li>
                    <li>好友可以查看您的 To-Do List 項目</li>
                    <li>僅您能進行編輯和修改</li>
                    <li>筆記本功能僅對您可見</li>
                  </ul>
                </div>
              )}
              
              {visibility === 'private' && (
                <div style={{ 
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5'
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    <i className="fas fa-lock" style={{ marginRight: '5px', color: 'var(--primary-color)' }}></i> 
                    不公開模式
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    <li>僅您可以查看此願望的所有內容</li>
                    <li>其他用戶無法訪問此願望</li>
                    <li>適合記錄個人私密願望</li>
                    <li>您擁有完整的編輯和修改權限</li>
                  </ul>
                </div>
              )}
              </div>

            {/* 標籤設定 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                marginBottom: '10px', 
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>
                標籤
                </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                  placeholder="輸入標籤..."
                    value={stepInput}
                    onChange={(e) => setStepInput(e.target.value)}
                    style={{ 
                      flex: 1,
                    padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                    backgroundColor: 'var(--background-color)'
                    }}
                  />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (stepInput.trim() && !steps.includes(stepInput.trim())) {
                        setSteps([...steps, stepInput.trim()]);
                        setStepInput('');
                      }
                    }}
                    style={{
                    padding: '10px 20px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                  新增
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {steps.map((step, index) => (
                    <div 
                      key={index} 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '14px',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {step}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSteps(steps.filter(s => s !== step));
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          marginLeft: '4px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className="fas fa-times" style={{ fontSize: '12px' }}></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 截止日期 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                marginBottom: '10px', 
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>
                截止日期
                </label>
                <input
                  type="date"
                  value={weeklyGoalInput}
                  onChange={(e) => setWeeklyGoalInput(e.target.value)}
                  style={{ 
                    width: '100%',
                  padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '14px',
                  backgroundColor: 'var(--background-color)'
                  }}
                />
              </div>
              
            {/* 錯誤訊息 */}
              {error && (
                <div style={{ 
                marginTop: '20px',
                  padding: '12px',
                  backgroundColor: '#ff3b3020',
                  color: '#ff3b30',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddWish; 