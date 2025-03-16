import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [interests, setInterests] = useState([]);
  
  const steps = [
    {
      title: '歡迎使用 Make a Wish',
      description: '在這裡，你可以記錄、分享和實現你的願望',
      type: 'welcome'
    },
    {
      title: '選擇您的興趣',
      description: '這將幫助我們為您推薦相關內容',
      type: 'interests',
      options: [
        { id: 1, name: '學習', icon: '📚' },
        { id: 2, name: '健康', icon: '💪' },
        { id: 3, name: '旅行', icon: '✈️' },
        { id: 4, name: '職業', icon: '💼' },
        { id: 5, name: '財務', icon: '💰' },
        { id: 6, name: '創意', icon: '🎨' },
        { id: 7, name: '關係', icon: '❤️' },
        { id: 8, name: '個人成長', icon: '🌱' }
      ]
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 完成引導流程，導航到社群頁面
      // 儲存用戶興趣到 localStorage
      localStorage.setItem('userInterests', JSON.stringify(interests));
      localStorage.removeItem('isNewUser'); // 移除新用戶標記
      navigate('/community');
    }
  };
  
  const handleSkip = () => {
    // 跳過引導流程，直接導航到社群頁面
    localStorage.removeItem('isNewUser'); // 移除新用戶標記
    navigate('/community');
  };
  
  const toggleInterest = (id) => {
    if (interests.includes(id)) {
      setInterests(interests.filter(item => item !== id));
    } else {
      setInterests([...interests, id]);
    }
  };
  
  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.type) {
      case 'welcome':
        return (
          <div className="onboarding-content welcome">
            <div className="emoji-icon">🌟</div>
            <p className="description">
              在這裡，你可以記錄、分享和實現你的願望。無論是旅行、學習新技能還是財務目標，我們都能幫助您一步步實現。
            </p>
            <div className="emoji-illustration">✨🚀🌈</div>
          </div>
        );
        
      case 'interests':
        return (
          <div className="onboarding-content">
            <div className="interests-grid">
              {step.options.map(option => (
                <div
                  key={option.id}
                  onClick={() => toggleInterest(option.id)}
                  className={`interest-item ${interests.includes(option.id) ? 'active' : ''}`}
                >
                  <div className="interest-icon">{option.icon}</div>
                  <div className="interest-name">{option.name}</div>
                </div>
              ))}
            </div>
            <p className="interest-hint">
              選擇您感興趣的類別，我們將為您推薦相關的願望和內容
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="content-area">
      <div className="onboarding-container">
        <div className="progress-container">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? 'active' : ''}`}
              style={{ flex: 1, marginRight: index < steps.length - 1 ? '5px' : 0 }}
            />
          ))}
        </div>
        
        <div className="onboarding-header">
          <h1 className="title">{steps[currentStep].title}</h1>
          <p className="subtitle">{steps[currentStep].description}</p>
        </div>
        
        {renderStepContent()}
        
        <div className="onboarding-actions">
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleSkip}
              className="secondary-btn"
            >
              跳過
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            onClick={handleNext}
            className="primary-btn"
          >
            {currentStep < steps.length - 1 ? '下一步' : '開始使用'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding; 