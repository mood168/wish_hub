import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/auth.css';

function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [interests, setInterests] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [animationComplete, setAnimationComplete] = useState(false);
  const { changeLanguage } = useLanguage();
  
  useEffect(() => {
    // 第一步驟2秒後自動跳轉 (原來是5秒)
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
        setTimeout(() => {
          setCurrentStep(1);
          setAnimationComplete(false);
        }, 500);
      }, 2000); // 從5000ms減少到2000ms
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // 雙語文字內容
  const bilingual = {
    welcome: {
      title: 'Make a Wish',
      subtitle: '寫下願望，我們一起實現 / Write down your wishes, let\'s make them come true together'
    },
    language: {
      title: {
        en: 'Choose Your Language',
        'zh-TW': '選擇您的語言'
      },
      description: {
        en: 'Please select your preferred language',
        'zh-TW': '請選擇您偏好的語言'
      },
      hint: {
        en: 'You can change the language in settings anytime',
        'zh-TW': '您可以隨時在設定中更改語言'
      }
    },
    interests: {
      title: {
        en: 'Choose Your Interests',
        'zh-TW': '選擇您的興趣'
      },
      description: {
        en: 'This will help us recommend relevant content for you',
        'zh-TW': '這將幫助我們為您推薦相關內容'
      },
      options: [
        { id: 1, name: { en: 'Learning', 'zh-TW': '學習' }, icon: '📚' },
        { id: 2, name: { en: 'Health', 'zh-TW': '健康' }, icon: '💪' },
        { id: 3, name: { en: 'Travel', 'zh-TW': '旅行' }, icon: '✈️' },
        { id: 4, name: { en: 'Career', 'zh-TW': '職業' }, icon: '💼' },
        { id: 5, name: { en: 'Finance', 'zh-TW': '財務' }, icon: '💰' },
        { id: 6, name: { en: 'Creative', 'zh-TW': '創意' }, icon: '🎨' },
        { id: 7, name: { en: 'Relationship', 'zh-TW': '關係' }, icon: '❤️' },
        { id: 8, name: { en: 'Personal Growth', 'zh-TW': '個人成長' }, icon: '🌱' }
      ],
      hint: {
        en: 'Select categories that interest you, and we will recommend related wishes and content',
        'zh-TW': '選擇您感興趣的類別，我們將為您推薦相關的願望和內容'
      }
    },
    buttons: {
      back: {
        en: 'Back',
        'zh-TW': '回上一步'
      },
      next: {
        en: 'Next',
        'zh-TW': '下一步'
      },
      start: {
        en: 'Get Started',
        'zh-TW': '開始使用'
      }
    }
  };

  const steps = [
    {
      title: bilingual.welcome.title,
      description: bilingual.welcome.subtitle,
      type: 'welcome'
    },
    {
      title: '',
      description: '',
      type: 'language',
      options: [
        { id: 'en', name: 'English', icon: '🇺🇸' },
        { id: 'zh-TW', name: '繁體中文', icon: '🇹🇼' }
      ]
    },
    {
      title: selectedLanguage === 'en' ? bilingual.interests.title.en : bilingual.interests.title['zh-TW'],
      description: selectedLanguage === 'en' ? bilingual.interests.description.en : bilingual.interests.description['zh-TW'],
      type: 'interests',
      options: bilingual.interests.options
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 保存用戶語言和興趣設置
      localStorage.setItem('userLanguage', selectedLanguage);
      localStorage.setItem('userInterests', JSON.stringify(interests));
      localStorage.removeItem('isNewUser');
      
      // 確保在導航前再次應用語言設置
      console.log('最終確認語言設置為:', selectedLanguage);
      changeLanguage(selectedLanguage);
      
      // 導航到首頁而非社群頁
      navigate('/home');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // 如果已經是第一步，則導航到登錄頁面
      navigate('/login');
    }
  };
  
  const toggleInterest = (id) => {
    if (interests.includes(id)) {
      setInterests(interests.filter(item => item !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  const handleLanguageSelect = (id) => {
    setSelectedLanguage(id);
    // 當用戶選擇語言時，立即應用語言設置
    changeLanguage(id);
    console.log('語言已選擇為:', id);
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
      
      case 'language':
        return (
          <div className="auth-content">
            <div style={{
              textAlign: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{
                fontSize: '22px',
                color: 'var(--text-color)',
                margin: '0 0 10px 0',
                fontWeight: 'normal'
              }}>{bilingual.language.description['zh-TW']}</h2>
              <h2 style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '28px',
                color: 'var(--text-color)',
                margin: '0',
                fontWeight: 'normal'
              }}>{bilingual.language.description.en}</h2>
            </div>
            
            <div className="language-grid" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '20px',
              marginBottom: '20px'
            }}>
              {step.options.map(option => (
                <div
                  key={option.id}
                  onClick={() => handleLanguageSelect(option.id)}
                  className={`language-item ${selectedLanguage === option.id ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 30px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    backgroundColor: selectedLanguage === option.id ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                    border: selectedLanguage === option.id ? '2px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    color: 'var(--text-color)',
                    minWidth: '120px'
                  }}
                >
                  <div className="language-icon" style={{ fontSize: '36px', marginBottom: '15px' }}>{option.icon}</div>
                  <div className="language-name" style={{ 
                    fontWeight: selectedLanguage === option.id ? 'bold' : 'normal',
                    fontSize: '16px'
                  }}>{option.name}</div>
                </div>
              ))}
            </div>
            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px', 
              color: 'var(--text-color)', 
              opacity: '0.8',
              fontSize: '14px'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>{bilingual.language.hint['zh-TW']}</p>
              <p style={{ margin: '0' }}>{bilingual.language.hint.en}</p>
            </div>
          </div>
        );
        
      case 'interests':
        return (
          <div className="auth-content">
            <div className="interests-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '15px',
              margin: '20px 0'
            }}>
              {bilingual.interests.options.map(option => (
                <div
                  key={option.id}
                  onClick={() => toggleInterest(option.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '15px 10px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    backgroundColor: interests.includes(option.id) ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                    border: interests.includes(option.id) ? '2px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    color: 'var(--text-color)'
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{option.icon}</div>
                  <div style={{ fontWeight: interests.includes(option.id) ? 'bold' : 'normal', fontSize: '14px' }}>
                    {selectedLanguage === 'en' ? option.name.en : option.name['zh-TW']}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ 
              textAlign: 'center', 
              marginTop: '15px', 
              color: 'var(--text-color)', 
              opacity: '0.8',
              fontSize: '14px'
            }}>
              {selectedLanguage === 'en' ? bilingual.interests.hint.en : bilingual.interests.hint['zh-TW']}
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="auth-container">
      {currentStep > 0 && (
        <div style={{
          width: '100%', 
          maxWidth: '450px',
          display: 'flex', 
          flexDirection: 'column',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '30px'
          }}>
            {steps.map((_, index) => (
              <div
                key={index}
                style={{ 
                  height: '4px',
                  flex: 1, 
                  backgroundColor: index <= currentStep ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '2px',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))}
          </div>
          
          <div style={{textAlign: 'center', marginBottom: '15px'}}>
            <h1 style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: '42px',
              color: 'var(--text-color)',
              margin: '0 0 10px 0',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
            }}>{steps[currentStep].title}</h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-color)',
              opacity: '0.9',
              margin: '0'
            }}>{steps[currentStep].description}</p>
          </div>
          
          {renderStepContent()}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px',
            gap: '15px'
          }}>
            <button
              onClick={handleBack}
              style={{
                padding: '12px 20px',
                borderRadius: '25px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-color)',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: '1'
              }}
            >
              {currentStep === 1 
                ? `${bilingual.buttons.back['zh-TW']} / ${bilingual.buttons.back.en}` 
                : (selectedLanguage === 'en' ? bilingual.buttons.back.en : bilingual.buttons.back['zh-TW'])}
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentStep === 2 && interests.length === 0}
              style={{
                padding: '12px 20px',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'var(--text-color)',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: '1',
                opacity: currentStep === 2 && interests.length === 0 ? '0.7' : '1'
              }}
            >
              {currentStep < steps.length - 1 
                ? (currentStep === 1 
                  ? `${bilingual.buttons.next['zh-TW']} / ${bilingual.buttons.next.en}` 
                  : (selectedLanguage === 'en' ? bilingual.buttons.next.en : bilingual.buttons.next['zh-TW']))
                : (selectedLanguage === 'en' ? bilingual.buttons.start.en : bilingual.buttons.start['zh-TW'])}
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 0 && renderStepContent()}
    </div>
  );
}

export default Onboarding; 