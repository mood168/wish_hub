import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function MemberLevelInfo() {
  const navigate = useNavigate();
  const { texts } = useLanguage();
  
  // 獲取會員等級圖示和顏色
  const getMemberLevelInfo = (level) => {
    switch (level) {
      case 'gold':
        return { icon: '🏅', color: '#FFD700', name: texts.memberLevel.levels.gold.name };
      case 'diamond':
        return { icon: '💎', color: '#B9F2FF', name: texts.memberLevel.levels.diamond.name };
      case 'regular':
      default:
        return { icon: '👤', color: '#AAAAAA', name: texts.memberLevel.levels.regular.name };
    }
  };
  
  // 會員等級特權資訊
  const memberLevelPrivileges = [
    {
      level: 'regular',
      privileges: texts.memberLevel.levels.regular.privileges
    },
    {
      level: 'gold',
      privileges: texts.memberLevel.levels.gold.privileges
    },
    {
      level: 'diamond',
      privileges: texts.memberLevel.levels.diamond.privileges
    }
  ];
  
  // 處理返回
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="content-area">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            type="button" 
            className="icon-btn" 
            onClick={handleBack}
            style={{ 
              marginRight: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px'
            }}
          >
            ←
          </button>
          <h2 style={{ margin: 0 }}>{texts.memberLevel.title}</h2>
        </div>
      </div>
      
      <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>{texts.memberLevel.about.title}</h3>
        <p>
          {texts.memberLevel.about.description}
        </p>
      </div>
      
      {/* 會員等級卡片 */}
      {memberLevelPrivileges.map((memberLevel) => {
        const levelInfo = getMemberLevelInfo(memberLevel.level);
        return (
          <div 
            key={memberLevel.level} 
            className="wish-card" 
            style={{ 
              padding: '20px', 
              marginBottom: '20px',
              borderLeft: `4px solid ${levelInfo.color}`
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px' 
            }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '25px', 
                backgroundColor: levelInfo.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginRight: '15px'
              }}>
                {levelInfo.icon}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{levelInfo.name}</h3>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)',
                  marginTop: '5px'
                }}>
                  {texts.memberLevel.levels[memberLevel.level].description}
                </div>
              </div>
            </div>
            
            <h4>{texts.memberLevel.levels.regular.privileges.length > 0 ? '專屬特權：' : ''}</h4>
            <ul style={{ 
              paddingLeft: '20px',
              marginBottom: '15px'
            }}>
              {memberLevel.privileges.map((privilege, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {privilege}
                </li>
              ))}
            </ul>
            
            {memberLevel.level !== 'regular' && (
              <div style={{ 
                backgroundColor: 'var(--background-color)', 
                padding: '15px', 
                borderRadius: 'var(--radius-md)',
                marginTop: '15px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {`如何獲得${levelInfo.name}？`}
                </div>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  {texts.memberLevel.levels[memberLevel.level].howToGet}
                </p>
              </div>
            )}
          </div>
        );
      })}
      
      <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>{texts.memberLevel.faq.title}</h3>
        
        {texts.memberLevel.faq.questions.map((faq, index) => (
          <div key={index} style={{ marginBottom: index < texts.memberLevel.faq.questions.length - 1 ? '15px' : 0 }}>
            <h4 style={{ marginBottom: '5px' }}>{faq.question}</h4>
            <p style={{ margin: 0 }}>{faq.answer}</p>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button 
          className="primary-btn"
          onClick={() => navigate('/settings')}
          style={{ padding: '10px 20px' }}
        >
          {texts.memberLevel.goToSettings}
        </button>
      </div>
    </div>
  );
}

export default MemberLevelInfo; 