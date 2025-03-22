import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Plan() {
  const { wishId } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plan');
  const [aiPlanLoading, setAiPlanLoading] = useState(false);
  const [aiPlanGenerated, setAiPlanGenerated] = useState(false);
  
  // 模擬計劃步驟
  const [steps, setSteps] = useState([
    { id: 1, text: '每天學習30分鐘日文單字', completed: true },
    { id: 2, text: '每週參加一次線上課程', completed: false },
    { id: 3, text: '每月進行一次模擬測試', completed: false },
    { id: 4, text: '找語言交換夥伴練習口說', completed: false }
  ]);

  // 模擬AI生成的計劃
  const aiPlan = {
    title: '學習日文 N3 程度計劃',
    description: '這是一個為期6個月的學習計劃，幫助您達到日文N3水平。',
    steps: [
      { id: 5, text: '每天學習30個新單字', completed: false },
      { id: 6, text: '每週閱讀一篇日文文章', completed: false },
      { id: 7, text: '每週觀看2小時日語影片', completed: false },
      { id: 8, text: '每月完成一本N3練習題', completed: false },
      { id: 9, text: '參加線上日語社群', completed: false }
    ]
  };

  useEffect(() => {
    // 模擬從API獲取願望數據
    setTimeout(() => {
      setWish({
        id: wishId,
        title: '學習日文 N3 程度',
        description: '希望能在今年內通過日文 N3 檢定，每天學習30分鐘，週末參加線上課程。',
        tags: ['學習', '語言'],
        progress: 45,
        startDate: '2023-01-15',
        dueDate: '2023-12-31'
      });
      setLoading(false);
    }, 500);
  }, [wishId]);

  const handleBack = () => {
    navigate(-1);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const toggleStep = (id) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
    
    // 更新進度
    const updatedSteps = steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    const completedCount = updatedSteps.filter(step => step.completed).length;
    const newProgress = Math.round((completedCount / updatedSteps.length) * 100);
    
    setWish(prev => ({
      ...prev,
      progress: newProgress
    }));
  };

  const handleAddStep = () => {
    const newStep = prompt('請輸入新的計劃步驟:');
    if (newStep) {
      const newId = Math.max(...steps.map(step => step.id)) + 1;
      setSteps([...steps, { id: newId, text: newStep, completed: false }]);
    }
  };

  const handleGenerateAIPlan = () => {
    setAiPlanLoading(true);
    
    // 模擬API請求延遲
    setTimeout(() => {
      setAiPlanLoading(false);
      setAiPlanGenerated(true);
    }, 2000);
  };

  const handleApplyAIPlan = () => {
    setSteps([...steps, ...aiPlan.steps]);
    setAiPlanGenerated(false);
    setActiveTab('plan');
  };

  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* 頂部導航 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button 
          className="secondary-btn" 
          style={{ padding: '8px', marginRight: '16px' }}
          onClick={handleBack}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 style={{ margin: 0 }}>{wish.title}</h2>
      </div>
      
      {/* 願望卡片 */}
      <div className="wish-card">
        <div className="wish-content">
          <div className="wish-description">{wish.description}</div>
          <div className="wish-tags">
            {wish.tags.map((tag, index) => (
              <div key={index} className="tag">{tag}</div>
            ))}
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${wish.progress}%` }}></div>
          </div>
          <div style={{ fontSize: '12px', color: '#8e8e93', textAlign: 'right' }}>
            進度: {wish.progress}%
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#8e8e93' }}>
            <div>開始日期: {wish.startDate}</div>
            <div>截止日期: {wish.dueDate}</div>
          </div>
        </div>
      </div>
      
      {/* 分類標籤 */}
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'plan' ? 'active' : ''}`} 
          onClick={() => switchTab('plan')}
        >
          計劃
        </div>
        <div 
          className={`tab ${activeTab === 'ai' ? 'active' : ''}`} 
          onClick={() => switchTab('ai')}
        >
          AI助手
        </div>
        <div 
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`} 
          onClick={() => switchTab('notes')}
        >
          筆記
        </div>
      </div>
      
      {/* 計劃內容 */}
      {activeTab === 'plan' && (
        <div className="tab-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>計劃步驟</h3>
            <button 
              className="secondary-btn" 
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={handleAddStep}
            >
              <i className="fas fa-plus" style={{ marginRight: '5px' }}></i>
              新增步驟
            </button>
          </div>
          
          {steps.map(step => (
            <div key={step.id} className="todo-item">
              <div 
                className={`todo-checkbox ${step.completed ? 'checked' : ''}`}
                onClick={() => toggleStep(step.id)}
              >
                {step.completed && <i className="fas fa-check"></i>}
              </div>
              <div className="todo-text">
                <div style={{ textDecoration: step.completed ? 'line-through' : 'none' }}>
                  {step.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* AI助手內容 */}
      {activeTab === 'ai' && (
        <div className="tab-content">
          <h3>AI計劃助手</h3>
          <p>讓AI為您生成一個實現願望的詳細計劃。</p>
          
          {!aiPlanGenerated && !aiPlanLoading && (
            <button 
              className="primary-btn" 
              style={{ width: '100%', marginTop: '16px' }}
              onClick={handleGenerateAIPlan}
            >
              <i className="fas fa-magic" style={{ marginRight: '8px' }}></i>
              生成AI計劃
            </button>
          )}
          
          {aiPlanLoading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <div>AI正在為您生成計劃...</div>
            </div>
          )}
          
          {aiPlanGenerated && (
            <div className="wish-card" style={{ marginTop: '16px' }}>
              <h3>{aiPlan.title}</h3>
              <p>{aiPlan.description}</p>
              
              <div style={{ marginTop: '16px' }}>
                <h4>建議步驟:</h4>
                {aiPlan.steps.map(step => (
                  <div key={step.id} style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0' }}>
                    {step.text}
                  </div>
                ))}
              </div>
              
              <button 
                className="primary-btn" 
                style={{ width: '100%', marginTop: '16px' }}
                onClick={handleApplyAIPlan}
              >
                應用此計劃
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* 筆記內容 */}
      {activeTab === 'notes' && (
        <div className="tab-content">
          <h3>筆記</h3>
          <p>這裡可以記錄您的學習心得和進度。</p>
          
          <textarea
            className="input-field"
            placeholder="寫下您的筆記..."
            style={{ minHeight: '200px', resize: 'vertical' }}
          ></textarea>
          
          <button 
            className="primary-btn" 
            style={{ width: '100%', marginTop: '16px' }}
            onClick={() => console.log('保存筆記')}
          >
            保存筆記
          </button>
        </div>
      )}
    </div>
  );
}

export default Plan; 