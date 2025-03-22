import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function Rewards() {
  const { texts } = useLanguage();
  const [activeTab, setActiveTab] = useState('collection');
  
  // 模擬徽章數據
  const badges = [
    { id: 1, name: '初學者', icon: '🌱', description: '完成第一個願望', unlocked: true, date: '2023-03-05' },
    { id: 2, name: '堅持不懈', icon: '⏱️', description: '連續30天更新進度', unlocked: true, date: '2023-02-28' },
    { id: 3, name: '社交蝴蝶', icon: '🦋', description: '獲得10個讚', unlocked: true, date: '2023-02-15' },
    { id: 4, name: '學習達人', icon: '📚', description: '完成5個學習類願望', unlocked: false },
    { id: 5, name: '環球旅行家', icon: '🌍', description: '完成3個旅行類願望', unlocked: false },
    { id: 6, name: '健身狂熱者', icon: '💪', description: '完成5個健身類願望', unlocked: false },
    { id: 7, name: '夢想家', icon: '✨', description: '創建10個願望', unlocked: false },
    { id: 8, name: '實踐者', icon: '🏆', description: '完成10個願望', unlocked: false }
  ];
  
  // 模擬稱號數據
  const titles = [
    { id: 1, name: texts.rewards.titles.explorer.name, icon: '🔍', description: texts.rewards.titles.explorer.description, unlocked: true, equipped: true },
    { id: 2, name: texts.rewards.titles.persistent.name, icon: '📊', description: texts.rewards.titles.persistent.description, unlocked: true, equipped: false },
    { id: 3, name: texts.rewards.titles.socialStar.name, icon: '⭐', description: texts.rewards.titles.socialStar.description, unlocked: false },
    { id: 4, name: texts.rewards.titles.achiever.name, icon: '🎯', description: texts.rewards.titles.achiever.description, unlocked: false },
    { id: 5, name: texts.rewards.titles.planner.name, icon: '📝', description: texts.rewards.titles.planner.description, unlocked: false }
  ];
  
  // 模擬積分數據
  const points = 350;
  const level = 3;
  const nextLevelPoints = 500;
  
  // 模擬積分歷史
  const pointsHistory = [
    { id: 1, description: '完成願望：學習日文 N3 程度', points: 100, date: '2023-03-10' },
    { id: 2, description: '獲得徽章：初學者', points: 50, date: '2023-03-05' },
    { id: 3, description: '獲得徽章：堅持不懈', points: 100, date: '2023-02-28' },
    { id: 4, description: '獲得徽章：社交蝴蝶', points: 50, date: '2023-02-15' },
    { id: 5, description: '完成願望：學習烹飪', points: 50, date: '2023-02-10' }
  ];
  
  // 模擬獎勵商店 - 虛擬獎勵
  const virtualRewards = [
    { id: 1, name: '特殊主題', icon: '🎨', description: '解鎖應用特殊主題', cost: 200, available: true, type: 'virtual' },
    { id: 2, name: '高級徽章', icon: '🏅', description: '獲得獨特的高級徽章', cost: 300, available: true, type: 'virtual' },
    { id: 3, name: '專屬頭像框', icon: '🖼️', description: '獲得專屬頭像框', cost: 150, available: true, type: 'virtual' },
    { id: 4, name: 'AI助手加強版', icon: '🤖', description: '解鎖AI助手的高級功能', cost: 500, available: false, type: 'virtual' }
  ];
  
  // 模擬獎勵商店 - 實體獎勵
  const physicalRewards = [
    { id: 5, name: '願望中心紀念T恤', icon: '👕', description: '限量版願望中心主題T恤', cost: 1000, available: true, type: 'physical' },
    { id: 6, name: '精美筆記本', icon: '📔', description: '願望規劃專用筆記本', cost: 800, available: true, type: 'physical' },
    { id: 7, name: '願望中心馬克杯', icon: '☕', description: '願望中心主題馬克杯', cost: 600, available: true, type: 'physical' },
    { id: 8, name: '願望中心帆布袋', icon: '👜', description: '環保帆布袋', cost: 500, available: true, type: 'physical' }
  ];
  
  // 模擬社群競賽數據
  const competitions = [
    { id: 1, name: '3月學習挑戰', icon: '📚', endDate: '2023-03-31', status: 'active' },
    { id: 2, name: '健身30天', icon: '💪', endDate: '2023-04-15', status: 'active' },
    { id: 3, name: '閱讀馬拉松', icon: '📖', endDate: '2023-05-01', status: 'upcoming' },
    { id: 4, name: '2月創意寫作', icon: '✍️', endDate: '2023-02-28', status: 'completed' }
  ];
  
  // 模擬排行榜數據
  const leaderboard = [
    { id: 1, name: '王大明', avatar: '👨‍💻', points: 1250, rank: 1 },
    { id: 2, name: '李小華', avatar: '👩‍🎓', points: 980, rank: 2 },
    { id: 3, name: '張文靜', avatar: '👩‍💼', points: 820, rank: 3 },
    { id: 4, name: '陳志強', avatar: '👨‍🚀', points: 750, rank: 4 },
    { id: 5, name: '林小美', avatar: '👩‍🎨', points: 720, rank: 5 },
    { id: 6, name: '我', avatar: '😊', points: 350, rank: 18, isCurrentUser: true }
  ];

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleRedeemReward = (itemId) => {
    console.log(`兌換獎勵: ${itemId}`);
    // 實際應用中這裡會處理獎勵兌換邏輯
  };
  
  const handleEquipTitle = (titleId) => {
    console.log(`裝備稱號: ${titleId}`);
    // 實際應用中這裡會處理裝備稱號的邏輯
  };
  
  const handleJoinCompetition = (competitionId) => {
    console.log(`參加競賽: ${competitionId}`);
    // 實際應用中這裡會處理參加競賽的邏輯
  };

  return (
    <div className="content-area">
      {/* 用戶積分卡片 */}
      <div className="wish-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#8e8e93' }}>{texts.rewards.currentLevel}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Level {level}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#8e8e93' }}>{texts.rewards.points.title}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{points}</div>
          </div>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8e8e93', marginBottom: '4px' }}>
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${(points / nextLevelPoints) * 100}%`,
                backgroundColor: '#007aff' 
              }}
            ></div>
          </div>
          <div style={{ fontSize: '12px', color: '#8e8e93', textAlign: 'right', marginTop: '4px' }}>
            {texts.rewards.pointsToNextLevel.replace('{points}', nextLevelPoints - points)}
          </div>
        </div>
      </div>
      
      {/* 分類標籤 */}
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'collection' ? 'active' : ''}`} 
          onClick={() => switchTab('collection')}
        >
          {texts.rewards.tabs.collection}
        </div>
        <div 
          className={`tab ${activeTab === 'shop' ? 'active' : ''}`} 
          onClick={() => switchTab('shop')}
        >
          {texts.rewards.tabs.shop}
        </div>
        <div 
          className={`tab ${activeTab === 'competition' ? 'active' : ''}`} 
          onClick={() => switchTab('competition')}
        >
          {texts.rewards.tabs.competition}
        </div>
        <div 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`} 
          onClick={() => switchTab('history')}
        >
          {texts.rewards.tabs.history}
        </div>
      </div>
      
      {/* 勳章收藏庫內容 */}
      {activeTab === 'collection' && (
        <div className="tab-content">
          {/* 稱號部分 */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>{texts.rewards.titles.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {titles.map(title => (
                <div 
                  key={title.id} 
                  className="wish-card" 
                  style={{ 
                    padding: '15px',
                    opacity: title.unlocked ? 1 : 0.6,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      fontSize: '24px', 
                      marginRight: '15px',
                      width: '50px',
                      height: '50px',
                      backgroundColor: title.unlocked ? 'var(--primary-light)' : '#f2f2f7',
                      borderRadius: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: title.unlocked ? 'var(--primary-color)' : '#8e8e93'
                    }}>
                      {title.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title.name}</div>
                      <div style={{ fontSize: '14px', color: '#636366' }}>{title.description}</div>
                    </div>
                  </div>
                  {title.unlocked ? (
                    <button 
                      className={title.equipped ? "secondary-btn" : "primary-btn"} 
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '12px'
                      }}
                      onClick={() => handleEquipTitle(title.id)}
                    >
                      {title.equipped ? texts.rewards.titles.equipped : texts.rewards.titles.equip}
                    </button>
                  ) : (
                    <div style={{ 
                      fontSize: '20px',
                      color: '#8e8e93'
                    }}>
                      🔒
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 徽章部分 */}
          <h3 style={{ marginBottom: '15px' }}>{texts.rewards.badges.title}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {badges.map(badge => (
              <div 
                key={badge.id} 
                className="badge" 
                style={{ 
                  width: '80px',
                  height: '80px',
                  margin: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: badge.unlocked ? 'white' : '#f2f2f7',
                  boxShadow: badge.unlocked ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  borderRadius: '50%',
                  opacity: badge.unlocked ? 1 : 0.5,
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '32px' }}>{badge.icon}</div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-30px', 
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: badge.unlocked ? 'bold' : 'normal',
                  color: badge.unlocked ? '#333' : '#8e8e93'
                }}>
                  {badge.name}
                </div>
                {badge.unlocked ? (
                  <div style={{ 
                    position: 'absolute', 
                    top: '-10px', 
                    right: '-10px',
                    fontSize: '16px'
                  }}>
                    ✅
                  </div>
                ) : (
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    fontSize: '24px'
                  }}>
                    🔒
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 積分商店內容 */}
      {activeTab === 'shop' && (
        <div className="tab-content">
          {/* 虛擬獎勵部分 */}
          <h3 style={{ marginBottom: '15px' }}>{texts.rewards.shop.virtual}</h3>
          {virtualRewards.map(item => (
            <div 
              key={item.id} 
              className="wish-card" 
              style={{ 
                padding: '16px',
                marginBottom: '16px',
                opacity: item.available ? 1 : 0.6
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    marginRight: '16px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'var(--primary-light)',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-color)'
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '14px', color: '#636366' }}>{item.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ 
                    color: '#007aff', 
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    {item.cost} {texts.rewards.points.title}
                  </div>
                  <button 
                    className="primary-btn" 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '12px',
                      opacity: item.cost <= points && item.available ? 1 : 0.5
                    }}
                    disabled={item.cost > points || !item.available}
                    onClick={() => handleRedeemReward(item.id)}
                  >
                    {item.cost <= points && item.available ? texts.rewards.shop.redeem : '積分不足'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* 實體獎勵部分 */}
          <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>{texts.rewards.shop.physical}</h3>
          {physicalRewards.map(item => (
            <div 
              key={item.id} 
              className="wish-card" 
              style={{ 
                padding: '16px',
                marginBottom: '16px',
                opacity: item.available ? 1 : 0.6
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    marginRight: '16px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f2f2f7',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '14px', color: '#636366' }}>{item.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ 
                    color: '#007aff', 
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    {item.cost} {texts.rewards.points.title}
                  </div>
                  <button 
                    className="primary-btn" 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '12px',
                      opacity: item.cost <= points && item.available ? 1 : 0.5
                    }}
                    disabled={item.cost > points || !item.available}
                    onClick={() => handleRedeemReward(item.id)}
                  >
                    {item.cost <= points && item.available ? texts.rewards.shop.redeem : '積分不足'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 社群競賽內容 */}
      {activeTab === 'competition' && (
        <div className="tab-content">
          {/* 排行榜部分 */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>{texts.rewards.competition.leaderboard}</h3>
            <div className="wish-card" style={{ padding: '20px' }}>
              {leaderboard.map(user => (
                <div 
                  key={user.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: user.id !== leaderboard.length ? '1px solid #e0e0e0' : 'none',
                    backgroundColor: user.isCurrentUser ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                    borderRadius: user.isCurrentUser ? '8px' : '0',
                    padding: user.isCurrentUser ? '10px' : '10px 0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: '30px', 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      color: user.rank <= 3 ? '#007aff' : '#8e8e93'
                    }}>
                      {user.rank}
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      marginRight: '10px',
                      marginLeft: '10px'
                    }}>
                      {user.avatar}
                    </div>
                    <div style={{ fontWeight: user.isCurrentUser ? 'bold' : 'normal' }}>
                      {user.name}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 'bold',
                    color: user.rank <= 3 ? '#007aff' : '#333'
                  }}>
                    {user.points} {texts.rewards.points.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 競賽列表部分 */}
          <h3 style={{ marginBottom: '15px' }}>{texts.rewards.competition.title}</h3>
          {competitions.map(competition => (
            <div 
              key={competition.id} 
              className="wish-card" 
              style={{ 
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    marginRight: '16px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: competition.status === 'active' ? 'var(--primary-light)' : '#f2f2f7',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: competition.status === 'active' ? 'var(--primary-color)' : '#8e8e93'
                  }}>
                    {competition.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{competition.name}</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#636366',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                      截止日期: {competition.endDate}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {competition.status === 'active' && (
                    <button 
                      className="primary-btn" 
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '12px'
                      }}
                      onClick={() => handleJoinCompetition(competition.id)}
                    >
                      查看詳情
                    </button>
                  )}
                  {competition.status === 'upcoming' && (
                    <div style={{ 
                      padding: '6px 12px', 
                      fontSize: '12px',
                      backgroundColor: '#f2f2f7',
                      borderRadius: '6px',
                      color: '#8e8e93'
                    }}>
                      {texts.rewards.competition.upcoming}
                    </div>
                  )}
                  {competition.status === 'completed' && (
                    <div style={{ 
                      padding: '6px 12px', 
                      fontSize: '12px',
                      backgroundColor: '#f2f2f7',
                      borderRadius: '6px',
                      color: '#8e8e93'
                    }}>
                      {texts.rewards.competition.past}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 積分歷史內容 */}
      {activeTab === 'history' && (
        <div className="tab-content">
          {pointsHistory.map(item => (
            <div 
              key={item.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '12px 0',
                borderBottom: '1px solid #e0e0e0'
              }}
            >
              <div>
                <div>{item.description}</div>
                <div style={{ fontSize: '12px', color: '#8e8e93' }}>{item.date}</div>
              </div>
              <div style={{ 
                color: '#34c759', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                +{item.points}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rewards; 