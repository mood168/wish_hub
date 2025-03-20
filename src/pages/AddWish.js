import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [dailyGoals, setDailyGoals] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [goalInput, setGoalInput] = useState('');
  const [isDaily, setIsDaily] = useState(true);
  const [aiMode, setAiMode] = useState('easyToHard');
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  
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
    if (!goalInput.trim()) return;

    if (isDaily) {
      setDailyGoals([...dailyGoals, goalInput.trim()]);
    } else {
      setWeeklyGoals([...weeklyGoals, goalInput.trim()]);
    }
    setGoalInput('');
  };

  // 處理目標刪除
  const handleRemoveGoal = (index, isDaily) => {
    if (isDaily) {
      setDailyGoals(dailyGoals.filter((_, i) => i !== index));
    } else {
      setWeeklyGoals(weeklyGoals.filter((_, i) => i !== index));
    }
  };

  // 獲取AI建議的目標
  const handleGetAiSuggestions = async () => {
    setShowAiSuggestions(true);
    // TODO: 實現AI建議功能
    // 這裡可以調用後端API來獲取AI建議
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 檢查用戶是否登入
    if (!user) {
      setError('請先登入');
      return;
    }
    
    // 簡單的表單驗證
    if (!title || !description || !category) {
      setError(texts.addWish.requiredFields);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // 準備願望數據
      const wishData = {
        userId: user.id,
        title,
        description,
        category: categories.find(cat => cat.id === category)?.name || category,
        visibility: isPublic ? 'public' : 'private',
        dueDate: dueDate || null,
        status: 'notStarted',
        priority,
        dailyGoals,
        weeklyGoals,
        tags,
        tasks,
        createdAt: new Date().toISOString(),
        progress: 0
      };
      
      // 使用 wishService 儲存願望到 IndexedDB
      const wishId = await wishService.createWish(wishData);
      
      console.log('願望已成功儲存，ID:', wishId);
      
      // 返回首頁
      navigate('/home');
    } catch (error) {
      console.error('儲存願望時出錯:', error);
      setError('儲存願望時出錯，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    
    const newTask = {
      name: taskInput.trim(),
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  if (dbLoading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <form onSubmit={handleSubmit}>
        {/* 按鈕區塊 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
          maxWidth: '800px',
          margin: '0 auto 20px'
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
        <div className="wish-card" style={{ 
          padding: '30px',
          marginBottom: '20px',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          maxWidth: '800px',
          margin: '0 auto 20px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            margin: '0 0 25px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingBottom: '15px',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <i className="fas fa-star" style={{ color: 'var(--primary-color)' }}></i>
            願望基本資訊
          </h3>

          <div className="section-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '15px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="fas fa-heading" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}></i>
                願望標題
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入願望標題..."
            required
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  fontSize: '15px',
                  backgroundColor: 'var(--background-color)',
                  transition: 'all 0.2s ease',
                  ':focus': {
                    borderColor: 'var(--primary-color)',
                    boxShadow: '0 0 0 2px var(--primary-light)'
                  }
                }}
          />
        </div>
        
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '15px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="fas fa-align-left" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}></i>
                願望描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
                placeholder="描述你的願望..."
            required
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  fontSize: '15px',
                  backgroundColor: 'var(--background-color)',
                  minHeight: '120px',
                  resize: 'vertical',
                  transition: 'all 0.2s ease',
                  ':focus': {
                    borderColor: 'var(--primary-color)',
                    boxShadow: '0 0 0 2px var(--primary-light)'
                  }
                }}
              />
        </div>
        
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '15px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="fas fa-tag" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}></i>
                類別
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  fontSize: '15px',
                  backgroundColor: 'var(--background-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ':focus': {
                    borderColor: 'var(--primary-color)',
                    boxShadow: '0 0 0 2px var(--primary-light)'
                  }
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

            {/* 階段任務設定 */}
            <div style={{ marginBottom: '20px' }}>
              <h3>階段任務</h3>
              <div style={{ 
                display: 'flex',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="輸入任務名稱"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTask}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  新增
                </button>
              </div>

              {/* 任務列表 */}
              {tasks.length > 0 ? (
                <div style={{ 
                  backgroundColor: 'var(--background-color)',
                  borderRadius: '8px',
                  padding: '10px'
                }}>
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        marginBottom: index < tasks.length - 1 ? '8px' : 0
                      }}
                    >
                      <span>{task.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-tertiary)',
                          cursor: 'pointer',
                          padding: '4px 8px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)'
                }}>
                  尚未添加任何階段任務
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 2. 實現願望進度設定區塊 */}
        <div className="wish-card" style={{ 
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          maxWidth: '800px',
          margin: '0 auto 20px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-list-check"></i>
            實現願望進度設定
          </h3>

          {/* 目標類型選擇器 */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginBottom: '12px',
            backgroundColor: 'var(--background-color)',
            padding: '4px',
            borderRadius: 'var(--radius-md)'
          }}>
            <button
              type="button"
              onClick={() => setIsDaily(true)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isDaily ? 'white' : 'transparent',
                color: isDaily ? 'var(--primary-color)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: isDaily ? '600' : '400',
                boxShadow: isDaily ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              每日進度
            </button>
            <button
              type="button"
              onClick={() => setIsDaily(false)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: !isDaily ? 'white' : 'transparent',
                color: !isDaily ? 'var(--primary-color)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: !isDaily ? '600' : '400',
                boxShadow: !isDaily ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              每週進度
            </button>
          </div>
          
          {/* 目標輸入區 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder={isDaily ? "輸入每日進度..." : "輸入每週進度..."}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              style={{ 
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                backgroundColor: 'var(--background-color)',
                boxSizing: 'border-box'
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
              添加
            </button>
          </div>
          
          {/* 目標列表 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* 每日目標列表 */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '500', 
                marginBottom: '8px', 
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                每日進度列表
              </div>
              {dailyGoals.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dailyGoals.map((goal, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{ flex: 1 }}>{goal}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(index, true)}
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
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: 'var(--background-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  尚未設定每日進度
                </div>
              )}
            </div>

            {/* 每週目標列表 */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '500', 
                marginBottom: '8px', 
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                每週進度列表
              </div>
              {weeklyGoals.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {weeklyGoals.map((goal, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{ flex: 1 }}>{goal}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(index, false)}
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
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: 'var(--background-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  尚未設定每週進度
                </div>
              )}
            </div>
          </div>
          
          {/* AI建議設定 */}
          <div style={{ 
            backgroundColor: 'var(--background-color)', 
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            marginTop: '12px'
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
        
        {/* 3. 其他設定區塊 */}
        <div className="wish-card" style={{ 
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          maxWidth: '800px',
          margin: '0 auto 20px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-cog"></i>
            其他設定
          </h3>

          {/* 優先級 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              優先級
          </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  style={{
                    flex: 1,
                    padding: '12px',
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
              marginBottom: '12px', 
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
            {texts.addWish.fields.visibility.label}
          </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setIsPublic(true)}
              style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isPublic ? 'var(--primary-color)' : 'var(--background-color)',
                  color: isPublic ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isPublic ? '600' : '400'
                }}
              >
                {texts.addWish.fields.visibility.public}
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: !isPublic ? 'var(--primary-color)' : 'var(--background-color)',
                  color: !isPublic ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: !isPublic ? '600' : '400'
                }}
              >
                {texts.addWish.fields.visibility.private}
              </button>
            </div>
            <div style={{ 
              marginTop: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
                {isPublic ? texts.addWish.fields.visibility.publicDesc : texts.addWish.fields.visibility.privateDesc}
              </div>
          </div>

          {/* 標籤 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              {texts.addWish.fields.tags.label}
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder={texts.addWish.fields.tags.placeholder}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                style={{ 
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  backgroundColor: 'var(--background-color)',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                type="button"
                onClick={handleAddTag}
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
                {texts.addWish.fields.tags.add}
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map((tag, index) => (
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
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
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
              marginBottom: '8px', 
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              {texts.addWish.fields.dueDate.label}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ 
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                backgroundColor: 'var(--background-color)',
                boxSizing: 'border-box'
              }}
            />
        </div>
        
          {error && (
            <div style={{ 
              marginBottom: '20px',
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
      </form>
    </div>
  );
}

export default AddWish; 