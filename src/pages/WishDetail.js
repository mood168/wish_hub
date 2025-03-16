import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';

function WishDetail() {
  const { wishId } = useParams();
  const navigate = useNavigate();
  const { wishService, commentService, stepService, isLoading: dbLoading } = useDatabase();
  const { texts } = useLanguage();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  
  // 評論數據
  const [comments, setComments] = useState([]);
  
  // 進度數據
  const [progress, setProgress] = useState([]);
  
  // 相關願望
  const [relatedWishes, setRelatedWishes] = useState([]);
  
  // 步驟數據
  const [steps, setSteps] = useState([]);
  
  // 目標設定
  const [goals, setGoals] = useState({
    daily: '',
    weekly: ''
  });
  
  // 隱私設定
  const [privacySettings, setPrivacySettings] = useState({
    isPublic: true,
    friendsOnly: false,
    isAnonymous: false
  });
  
  // 進度記錄
  const [progressLogs, setProgressLogs] = useState([]);
  
  // 新步驟
  const [newStep, setNewStep] = useState('');
  
  // 從資料庫獲取願望數據
  useEffect(() => {
    const fetchWishData = async () => {
      try {
        setLoading(true);
        
        // 獲取願望詳情
        let wishIdValue = wishId;
        try {
          // 嘗試將 wishId 轉換為整數，但如果失敗則使用原始值
          wishIdValue = parseInt(wishId);
          if (isNaN(wishIdValue)) {
            wishIdValue = wishId;
          }
        } catch (e) {
          console.log('無法將 wishId 轉換為整數，使用原始值:', wishId);
        }
        
        // 嘗試從數據庫獲取願望
        let wishData = await wishService.getWish(wishIdValue);
        
        // 如果數據庫中沒有找到願望，則使用模擬數據
        if (!wishData) {
          console.log('數據庫中找不到願望，使用模擬數據:', wishIdValue);
          
          // 模擬願望數據
          const mockWishes = [
            {
              id: 101,
              title: '學習日文 N3 程度',
              description: '希望能夠在年底前達到日語N3水平，能夠理解日常對話和簡單的日文文章。',
              category: '學習',
              progress: 65,
              dueDate: '2023-12-31',
              priority: 'high',
              userId: 1
            },
            {
              id: 102,
              title: '每週健身三次',
              description: '保持健康的生活方式，每週至少去健身房三次，每次至少1小時。',
              category: '健身',
              progress: 40,
              dueDate: '2023-06-30',
              priority: 'medium',
              userId: 1
            },
            {
              id: 104,
              title: '閱讀10本經典文學作品',
              description: '拓展文學視野，閱讀10本世界經典文學作品。',
              category: '閱讀',
              progress: 30,
              dueDate: '2023-12-31',
              priority: 'medium',
              userId: 1
            },
            {
              id: 107,
              title: '學習Python編程',
              description: '學習Python編程基礎，能夠獨立開發簡單的應用程序。',
              category: '學習',
              progress: 20,
              dueDate: '2023-10-31',
              priority: 'medium',
              userId: 1
            },
            {
              id: 108,
              title: '完成半程馬拉松',
              description: '訓練並參加一場半程馬拉松比賽。',
              category: '健身',
              progress: 15,
              dueDate: '2023-11-15',
              priority: 'high',
              userId: 1
            },
            {
              id: 109,
              title: '環遊日本',
              description: '計劃一次日本之旅，參觀東京、京都、大阪等城市。',
              category: '旅行',
              progress: 10,
              dueDate: '2024-04-30',
              priority: 'medium',
              userId: 1
            },
            {
              id: 110,
              title: '探索台灣東海岸',
              description: '騎自行車環島台灣東海岸，體驗自然風光。',
              category: '旅行',
              progress: 5,
              dueDate: '2023-09-30',
              priority: 'low',
              userId: 1
            },
            {
              id: 111,
              title: '獲得專業認證',
              description: '準備並通過行業相關的專業認證考試。',
              category: '職業發展',
              progress: 25,
              dueDate: '2023-08-31',
              priority: 'high',
              userId: 1
            }
          ];
          
          // 從模擬數據中查找對應的願望
          wishData = mockWishes.find(wish => wish.id === wishIdValue);
        }
        
        if (!wishData) {
          console.error('找不到願望:', wishId);
          setLoading(false);
          alert('找不到該願望，請返回重試');
          return;
        }
        
        // 獲取用戶資料（在實際應用中，這應該從用戶服務中獲取）
        const userData = {
          name: '王小明',
          avatar: '👨‍💻',
          username: 'xiaoming123'
        };
        
        // 設置願望數據
        setWish({
          ...wishData,
          user: userData
        });
        
        // 模擬獲取步驟數據
        const stepsData = [
          { id: 1, content: '研究相關資料', completed: true, completedDate: '2023-05-15' },
          { id: 2, content: '制定學習計劃', completed: true, completedDate: '2023-05-20' },
          { id: 3, content: '每天學習30分鐘', completed: false, completedDate: null },
          { id: 4, content: '參加線上課程', completed: false, completedDate: null },
          { id: 5, content: '找語言交換夥伴', completed: false, completedDate: null }
        ];
        setSteps(stepsData);
        
        // 模擬獲取目標設定
        setGoals({
          daily: '學習30分鐘日語',
          weekly: '完成一個單元的學習'
        });
        
        // 模擬獲取隱私設定
        setPrivacySettings({
          isPublic: true,
          friendsOnly: false,
          isAnonymous: false
        });
        
        // 模擬獲取進度記錄
        const progressLogsData = [
          { id: 1, date: '2023-05-15', progress: 10, note: '開始學習基礎單字' },
          { id: 2, date: '2023-05-22', progress: 15, note: '學習了基本句型' },
          { id: 3, date: '2023-05-29', progress: 20, note: '開始練習簡單對話' },
          { id: 4, date: '2023-06-05', progress: 25, note: '複習了第一單元' },
          { id: 5, date: '2023-06-12', progress: 30, note: '開始學習第二單元' }
        ];
        setProgressLogs(progressLogsData);
        
        // 模擬獲取評論數據
        const commentsData = [
          {
            id: 1,
            user: { name: '李小華', avatar: '👩‍🎓', username: 'xiaohua' },
            content: '加油！我也在學習日語，可以一起交流。',
            createdAt: '2023-05-25T10:30:00',
            likes: 5
          },
          {
            id: 2,
            user: { name: '張大山', avatar: '🧔', username: 'dashan' },
            content: '推薦你使用「大家的日本語」教材，非常適合初學者。',
            createdAt: '2023-05-24T15:45:00',
            likes: 3
          }
        ];
        setComments(commentsData);
        
        // 模擬獲取進度數據
        // 使用相同的 wishIdValue 變數
        const progressData = await wishService.getWishProgress(wishIdValue);
        setProgress(progressData || []);
        
        // 模擬獲取相關願望
        // 使用相同的 wishIdValue 變數
        const relatedData = await wishService.getRelatedWishes(wishIdValue);
        setRelatedWishes(relatedData || []);
        
        setLoading(false);
      } catch (error) {
        console.error('獲取願望數據時出錯:', error);
        setLoading(false);
      }
    };
    
      fetchWishData();
  }, [wishId, navigate, wishService, commentService, stepService]);
  
  // 處理評論提交
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    try {
      // 創建新評論
      const newComment = {
        id: Date.now(),
        wishId: parseInt(wishId) || wishId, // 確保與 fetchWishData 使用相同的 wishId 格式
        userId: 1, // 假設當前用戶ID為1
        username: '當前用戶',
        avatar: '👤',
        content: comment,
        createdAt: new Date().toISOString()
      };
      
      // 添加到評論列表
      setComments([newComment, ...comments]);
      
      // 清空評論輸入框
      setComment('');
      
      // 在實際應用中，這裡應該調用API保存評論
      await commentService.addComment(newComment);
    } catch (error) {
      console.error('提交評論時出錯:', error);
    }
  };
  
  // 處理步驟完成狀態切換
  const handleStepToggle = (stepId) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        const completed = !step.completed;
        return {
          ...step,
          completed,
          completedDate: completed ? new Date().toISOString().split('T')[0] : null
        };
      }
      return step;
    }));
  };
  
  // 處理添加新步驟
  const handleAddStep = (e) => {
    e.preventDefault();
    
    if (!newStep.trim()) return;
    
    const newStepObj = {
      id: Date.now(),
      content: newStep,
      completed: false,
      completedDate: null
    };
    
    setSteps([...steps, newStepObj]);
    setNewStep('');
  };
  
  // 處理目標更新
  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setGoals(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 處理隱私設定更新
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    
    // 特殊處理互斥選項
    if (name === 'isPublic' && checked) {
      setPrivacySettings({
        isPublic: true,
        friendsOnly: false,
        isAnonymous: false
      });
    } else if (name === 'friendsOnly' && checked) {
      setPrivacySettings({
        isPublic: false,
        friendsOnly: true,
        isAnonymous: false
      });
    } else if (name === 'isAnonymous') {
      setPrivacySettings(prev => ({
        ...prev,
        isAnonymous: checked
      }));
    }
  };
  
  // 處理添加進度記錄
  const [newProgressLog, setNewProgressLog] = useState({
    progress: '',
    note: ''
  });
  
  const handleProgressLogChange = (e) => {
    const { name, value } = e.target;
    setNewProgressLog(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddProgressLog = (e) => {
    e.preventDefault();
    
    if (!newProgressLog.progress || !newProgressLog.note.trim()) return;
    
    const newLog = {
      id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      progress: parseInt(newProgressLog.progress),
      note: newProgressLog.note
    };
    
    setProgressLogs([newLog, ...progressLogs]);
    setNewProgressLog({ progress: '', note: '' });
    
    // 更新願望的總進度
    if (wish) {
      setWish({
        ...wish,
        progress: parseInt(newProgressLog.progress)
      });
    }
  };
  
  // 計算完成的步驟百分比
  const calculateStepsProgress = () => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };
  
  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>載入中...</div>
      </div>
    );
  }
  
  if (!wish) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>找不到願望</div>
      </div>
    );
  }
  
  return (
    <div className="content-area">
      <div className="wish-header" style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          ← 返回
        </button>
        
        <h2 style={{ margin: '0 0 10px 0' }}>{wish.title}</h2>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '15px',
          fontSize: '14px',
          color: '#8e8e93'
        }}>
          <div style={{ 
            backgroundColor: '#f2f2f7', 
            padding: '4px 8px', 
            borderRadius: '12px',
            marginRight: '10px'
          }}>
            {wish.category}
          </div>
          <div>截止日期: {wish.dueDate}</div>
        </div>
        
        <p style={{ 
          margin: '0 0 15px 0',
          fontSize: '16px',
          color: '#636366',
          lineHeight: '1.5'
        }}>
          {wish.description}
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
            <span>進度 {wish.progress}%</span>
            <span>步驟完成度 {calculateStepsProgress()}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${wish.progress}%`,
                backgroundColor: 'var(--primary-color)' 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="tabs" style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '20px'
      }}>
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`} 
          onClick={() => setActiveTab('details')}
          style={{ 
            padding: '10px 15px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'details' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'details' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'details' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          詳細資訊
        </button>
        
        <button 
          className={`tab ${activeTab === 'steps' ? 'active' : ''}`}
          onClick={() => setActiveTab('steps')}
          style={{ 
            padding: '10px 15px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'steps' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'steps' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'steps' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          步驟
        </button>
        
        <button 
          className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
          style={{ 
            padding: '10px 15px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'goals' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'goals' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'goals' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          目標設定
        </button>
        
            <button 
          className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
              style={{ 
            padding: '10px 15px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'privacy' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'privacy' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'privacy' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          隱私設定
        </button>
        
        <button 
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
                style={{ 
            padding: '10px 15px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'progress' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'progress' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'progress' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
          進度追蹤
        </button>
              </div>
      
      <div className="tab-content">
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
              <h3>願望詳情</h3>
              <p>{wish.description}</p>
              
              <div style={{ marginTop: '15px' }}>
                <h4>優先級</h4>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: wish.priority === 'high' ? '#ff3b30' : wish.priority === 'medium' ? '#ff9500' : '#34c759',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  {wish.priority === 'high' ? '高' : wish.priority === 'medium' ? '中' : '低'}
                </div>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                <h4>創建時間</h4>
                <p>2023-05-10</p>
              </div>
            </div>
            
            <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
              <h3>評論</h3>
              
              <form onSubmit={handleCommentSubmit} style={{ marginBottom: '15px' }}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="添加評論..."
                  style={{ 
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    resize: 'vertical',
                    minHeight: '80px',
                    fontSize: '14px'
                  }}
                ></textarea>
                
                <button 
                  type="submit" 
                  className="primary-btn"
                  style={{ marginTop: '10px' }}
                  disabled={!comment.trim()}
                >
                  發表評論
                </button>
              </form>
              
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} style={{ marginBottom: '15px', borderBottom: '1px solid #f2f2f7', paddingBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ marginRight: '5px', fontSize: '24px' }}>{comment.avatar}</span>
                      <span style={{ fontWeight: 'bold' }}>{comment.username}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#8e8e93' }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ margin: '0', fontSize: '14px' }}>{comment.content}</p>
                  </div>
                ))
              ) : (
                <p>暫無評論</p>
              )}
            </div>
        </div>
      )}
      
        {activeTab === 'steps' && (
          <div className="steps-tab">
            <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
              <h3>完成步驟</h3>
              
              <div style={{ marginBottom: '20px' }}>
                {steps.map(step => (
                  <div 
                    key={step.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid #f2f2f7'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={step.completed}
                      onChange={() => handleStepToggle(step.id)}
                      style={{ marginRight: '10px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        textDecoration: step.completed ? 'line-through' : 'none',
                        color: step.completed ? '#8e8e93' : 'inherit'
                      }}>
                        {step.content}
                      </div>
                      {step.completed && step.completedDate && (
                        <div style={{ fontSize: '12px', color: '#8e8e93' }}>
                          完成於 {step.completedDate}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleAddStep}>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="添加新步驟..."
                style={{ 
                  flex: 1,
                  padding: '10px',
                      borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                      fontSize: '14px',
                  marginRight: '10px'
                }}
              />
              <button 
                type="submit" 
                className="primary-btn"
                    disabled={!newStep.trim()}
              >
                    添加
              </button>
            </div>
          </form>
            </div>
          </div>
        )}
        
        {activeTab === 'goals' && (
          <div className="goals-tab">
            <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
              <h3>目標設定</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  每日目標
                </label>
                <input
                  type="text"
                  name="daily"
                  value={goals.daily}
                  onChange={handleGoalChange}
                  placeholder="設定每日目標..."
              style={{ 
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  每週目標
                </label>
                <input
                  type="text"
                  name="weekly"
                  value={goals.weekly}
                  onChange={handleGoalChange}
                  placeholder="設定每週目標..."
                  style={{ 
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <button 
                className="primary-btn"
                style={{ width: '100%' }}
              >
                保存目標設定
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'privacy' && (
          <div className="privacy-tab">
            <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
              <h3>隱私設定</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="isPublic"
                    checked={privacySettings.isPublic}
                    onChange={handlePrivacyChange}
                    style={{ marginRight: '10px' }}
                  />
                  <span>公開 - 所有人可見</span>
                </label>
                
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="friendsOnly"
                    checked={privacySettings.friendsOnly}
                    onChange={handlePrivacyChange}
                    style={{ marginRight: '10px' }}
                  />
                  <span>僅好友可見</span>
                </label>
                
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={privacySettings.isAnonymous}
                    onChange={handlePrivacyChange}
                    style={{ marginRight: '10px' }}
                  />
                  <span>匿名模式 - 不顯示您的個人資訊</span>
                </label>
              </div>
              
              <button 
                className="primary-btn"
                style={{ width: '100%' }}
              >
                保存隱私設定
              </button>
            </div>
        </div>
      )}
      
        {activeTab === 'progress' && (
          <div className="progress-tab">
            <div className="wish-card" style={{ padding: '15px', marginBottom: '15px' }}>
              <h3>添加進度記錄</h3>
              
              <form onSubmit={handleAddProgressLog}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    當前進度 (%)
                  </label>
                  <input
                    type="number"
                    name="progress"
                    value={newProgressLog.progress}
                    onChange={handleProgressLogChange}
                    placeholder="0-100"
                    min="0"
                    max="100"
              style={{ 
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      fontSize: '14px'
                    }}
                  />
              </div>
              
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    進度說明
                  </label>
                  <textarea
                    name="note"
                    value={newProgressLog.note}
                    onChange={handleProgressLogChange}
                    placeholder="描述您的進度..."
                    style={{ 
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      resize: 'vertical',
                      minHeight: '80px',
                      fontSize: '14px'
                    }}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="primary-btn"
                  style={{ width: '100%' }}
                  disabled={!newProgressLog.progress || !newProgressLog.note.trim()}
                >
                  記錄進度
                </button>
              </form>
            </div>
            
            <div className="wish-card" style={{ padding: '15px' }}>
              <h3>進度歷史</h3>
              
              {progressLogs.length > 0 ? (
                progressLogs.map(log => (
                  <div 
                    key={log.id} 
                    style={{ 
                      padding: '15px 0',
                      borderBottom: '1px solid #f2f2f7'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 'bold' }}>{log.date}</span>
                      <span style={{ 
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {log.progress}%
                      </span>
                </div>
                    <p style={{ margin: '0', fontSize: '14px' }}>{log.note}</p>
              </div>
                ))
              ) : (
                <p>暫無進度記錄</p>
              )}
            </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default WishDetail; 