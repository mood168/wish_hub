import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [interests, setInterests] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // 第一步驟5秒後自動跳轉
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
        setTimeout(() => {
          setCurrentStep(1);
          setAnimationComplete(false);
        }, 500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const steps = [
    {
      title: 'Make a Wish',
      description: '寫下願望，我們一起實現',
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
      localStorage.setItem('userInterests', JSON.stringify(interests));
      localStorage.removeItem('isNewUser');
      navigate('/community');
    }
  };
  
  const handleSkip = () => {
    localStorage.removeItem('isNewUser');
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
          <div className={`auth-content ${animationComplete ? 'fade-out' : 'fade-in'}`}>
            <div className="heart-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h1 className="auth-title">{step.title}</h1>
            <p className="auth-subtitle">{step.description}</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
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
    <div className="auth-container">
      {currentStep === 1 && (
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
            <button
              onClick={handleSkip}
              className="secondary-btn"
            >
              跳過
            </button>
            
            <button
              onClick={handleNext}
              className="primary-btn"
              disabled={currentStep === 1 && interests.length === 0}
            >
              {currentStep < steps.length - 1 ? '下一步' : '開始使用'}
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 0 && renderStepContent()}
    </div>
  );
}

export default Onboarding; 