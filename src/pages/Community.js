import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function Community() {
  const navigate = useNavigate();
  const { texts } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [memberLevel, setMemberLevel] = useState('regular');
  
  // 添加篩選類型狀態
  const [filterType, setFilterType] = useState('all');
  
  // 模擬熱門願望數據
  const [trendingWishes, setTrendingWishes] = useState([]);
  
  // 模擬最新願望數據
  const [latestWishes, setLatestWishes] = useState([]);
  
  // 模擬關注用戶的願望數據
  const [followingWishes, setFollowingWishes] = useState([]);
  
  // 模擬搜索結果
  const [searchResults, setSearchResults] = useState([]);
  
  // 模擬挑戰願望數據
  const [challengeWishes, setChallengeWishes] = useState([]);
  
  // 模擬支援願望數據
  const [supportWishes, setSupportWishes] = useState([]);
  
  // 模擬好友願望數據
  const [friendWishes, setFriendWishes] = useState([]);
  
  // 模擬推薦用戶
  const recommendedUsers = [
    { id: 1, name: '張小美', username: 'xiaomei', avatar: '👩‍🎨', bio: '熱愛藝術和旅行的設計師', followers: 156 },
    { id: 2, name: '李大壯', username: 'dazhuang', avatar: '🧗‍♂️', bio: '健身愛好者，喜歡挑戰自我', followers: 89 },
    { id: 3, name: '王文靜', username: 'wenjing', avatar: '👩‍💼', bio: '職場達人，分享職業成長經驗', followers: 210 }
  ];
  
  // 模擬用戶挑戰數據
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: '7天冥想挑戰',
      creator: { name: '張小美', username: 'xiaomei', avatar: '👩‍🎨' },
      participants: 28,
      duration: 7,
      category: '健康'
    },
    {
      id: 2,
      title: '30天閱讀馬拉松',
      creator: { name: '王文靜', username: 'wenjing', avatar: '👩‍💼' },
      participants: 42,
      duration: 30,
      category: '學習'
    },
    {
      id: 3,
      title: '21天早起習慣養成',
      creator: { name: '李大壯', username: 'dazhuang', avatar: '🧗‍♂️' },
      participants: 56,
      duration: 21,
      category: '生活習慣'
    }
  ]);
  
  // 模擬心願支援者數據
  const [supports, setSupports] = useState([
    {
      id: 1,
      title: '提供日語學習資源',
      provider: { name: '王文靜', username: 'wenjing', avatar: '👩‍💼' },
      category: '學習',
      type: 'resource'
    },
    {
      id: 2,
      title: '尋找健身夥伴',
      provider: { name: '李大壯', username: 'dazhuang', avatar: '🧗‍♂️' },
      category: '健身',
      type: 'partner'
    },
    {
      id: 3,
      title: '分享攝影技巧',
      provider: { name: '張小美', username: 'xiaomei', avatar: '👩‍🎨' },
      category: '興趣',
      type: 'advice'
    }
  ]);
  
  // 模擬好友動態數據
  const [friendActivities, setFriendActivities] = useState([
    {
      id: 1,
      type: 'progress',
      user: { name: '張小美', username: 'xiaomei', avatar: '👩‍🎨' },
      wish: { title: '學習水彩畫', category: '興趣' },
      progress: 75,
      timestamp: '2023-04-02 09:30'
    },
    {
      id: 2,
      type: 'completed',
      user: { name: '李大壯', username: 'dazhuang', avatar: '🧗‍♂️' },
      wish: { title: '完成半程馬拉松', category: '健身' },
      timestamp: '2023-04-01 18:45'
    },
    {
      id: 3,
      type: 'achievement',
      user: { name: '王文靜', username: 'wenjing', avatar: '👩‍💼' },
      achievement: '堅持達人',
      timestamp: '2023-03-31 12:20'
    }
  ]);
  
  // 獲取用戶資料
  useEffect(() => {
    // 從 localStorage 獲取用戶資料
    const storedUserName = localStorage.getItem('userName') || '用戶';
    const storedUserAvatar = localStorage.getItem('userAvatar') || 'https://randomuser.me/api/portraits/men/1.jpg';
    const storedMemberLevel = localStorage.getItem('memberLevel') || 'regular';
    
    setUserName(storedUserName);
    setUserAvatar(storedUserAvatar);
    setMemberLevel(storedMemberLevel);
  }, []);
  
  // 模擬熱門標籤
  const trendingTags = [
    { id: 1, name: '語言學習', count: 245 },
    { id: 2, name: '健身', count: 189 },
    { id: 3, name: '旅行', count: 156 },
    { id: 4, name: '閱讀', count: 132 },
    { id: 5, name: '職業發展', count: 98 }
  ];
  
  // 模擬獲取數據
  useEffect(() => {
    // 模擬API請求延遲
    const timer = setTimeout(() => {
      // 模擬熱門願望數據
      const trendingData = [
        {
          id: 1,
          title: '完成馬拉松比賽',
          category: '健身',
          progress: 75,
          likes: 48,
          comments: 12,
          user: {
            name: '李大壯',
            username: 'dazhuang',
            avatar: '🧗‍♂️'
          }
        },
        {
          id: 2,
          title: '學習西班牙語到B2水平',
          category: '學習',
          progress: 60,
          likes: 36,
          comments: 8,
          user: {
            name: '王文靜',
            username: 'wenjing',
            avatar: '👩‍💼'
          }
        },
        {
          id: 3,
          title: '環遊歐洲五國',
          category: '旅行',
          progress: 40,
          likes: 29,
          comments: 15,
          user: {
            name: '張小美',
            username: 'xiaomei',
            avatar: '👩‍🎨'
          }
        },
        {
          id: 4,
          title: '學習攝影技巧',
          category: '興趣',
          progress: 30,
          likes: 24,
          comments: 6,
          user: {
            name: '陳志明',
            username: 'zhiming',
            avatar: '📸'
          }
        }
      ];
      
      // 模擬最新願望數據
      const latestData = [
        {
          id: 5,
          title: '學習彈鋼琴',
          category: '興趣',
          progress: 10,
          likes: 5,
          comments: 2,
          user: {
            name: '林小雨',
            username: 'xiaoyu',
            avatar: '🎹'
          },
          createdAt: '2023-03-18'
        },
        {
          id: 6,
          title: '閱讀20本經典文學作品',
          category: '閱讀',
          progress: 15,
          likes: 8,
          comments: 3,
          user: {
            name: '趙書生',
            username: 'shusheng',
            avatar: '📚'
          },
          createdAt: '2023-03-17'
        },
        {
          id: 7,
          title: '學習數據分析',
          category: '學習',
          progress: 5,
          likes: 12,
          comments: 4,
          user: {
            name: '吳數據',
            username: 'shuju',
            avatar: '📊'
          },
          createdAt: '2023-03-16'
        },
        {
          id: 8,
          title: '每週健身三次',
          category: '健身',
          progress: 25,
          likes: 15,
          comments: 5,
          user: {
            name: '孫健將',
            username: 'jianjiang',
            avatar: '💪'
          },
          createdAt: '2023-03-15'
        }
      ];
      
      // 模擬關注用戶的願望數據
      const followingData = [
        {
          id: 9,
          title: '學習水彩畫',
          category: '藝術',
          progress: 45,
          likes: 18,
          comments: 7,
          user: {
            name: '張小美',
            username: 'xiaomei',
            avatar: '👩‍🎨'
          },
          createdAt: '2023-03-14'
        },
        {
          id: 10,
          title: '參加半程馬拉松',
          category: '健身',
          progress: 60,
          likes: 22,
          comments: 9,
          user: {
            name: '李大壯',
            username: 'dazhuang',
            avatar: '🧗‍♂️'
          },
          createdAt: '2023-03-12'
        },
        {
          id: 11,
          title: '提升職場溝通技巧',
          category: '職業發展',
          progress: 35,
          likes: 14,
          comments: 6,
          user: {
            name: '王文靜',
            username: 'wenjing',
            avatar: '👩‍💼'
          },
          createdAt: '2023-03-10'
        }
      ];
      
      setTrendingWishes(trendingData);
      setLatestWishes(latestData);
      setFollowingWishes(followingData);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 處理標籤切換
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 處理搜索
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // 模擬搜索結果
    const results = [
      ...trendingWishes,
      ...latestWishes,
      ...followingWishes
    ].filter(wish => 
      wish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wish.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wish.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setActiveTab('search');
  };
  
  // 處理標籤點擊
  const handleTagClick = (tagName) => {
    setSearchQuery(tagName);
    
    // 模擬標籤搜索結果
    const results = [
      ...trendingWishes,
      ...latestWishes,
      ...followingWishes
    ].filter(wish => 
      wish.category.toLowerCase() === tagName.toLowerCase()
    );
    
    setSearchResults(results);
    setActiveTab('search');
  };
  
  // 處理用戶點擊
  const handleUserClick = (username) => {
    // 實際應用中這裡會導航到用戶資料頁面
    console.log(`導航到用戶資料頁面: ${username}`);
  };
  
  // 處理願望點擊
  const handleWishClick = (wishId) => {
    console.log('導航到願望詳情頁面:', wishId);
    navigate(`/wish-detail/${wishId}`);
  };
  
  // 獲取會員等級圖示和顏色
  const getMemberLevelInfo = (level) => {
    switch (level) {
      case 'gold':
        return { icon: '🏅', color: '#FFD700', name: '金牌會員' };
      case 'diamond':
        return { icon: '💎', color: '#B9F2FF', name: '鑽石會員' };
      case 'regular':
      default:
        return { icon: '👤', color: '#AAAAAA', name: '一般會員' };
    }
  };
  
  // 處理挑戰點擊
  const handleChallengeClick = (challengeId) => {
    console.log(`查看挑戰: ${challengeId}`);
    // 在實際應用中，這裡應該導航到挑戰詳情頁面
  };
  
  // 處理發起挑戰
  const handleCreateChallenge = () => {
    console.log('發起新挑戰');
    // 在實際應用中，這裡應該導航到創建挑戰頁面
  };
  
  // 處理加入挑戰
  const handleJoinChallenge = (challengeId) => {
    console.log(`加入挑戰: ${challengeId}`);
    // 在實際應用中，這裡應該調用 API 加入挑戰
  };
  
  // 處理支援點擊
  const handleSupportClick = (supportId) => {
    console.log(`查看支援: ${supportId}`);
    // 在實際應用中，這裡應該導航到支援詳情頁面
  };
  
  // 處理提供支援
  const handleOfferSupport = () => {
    console.log('提供新支援');
    // 在實際應用中，這裡應該導航到創建支援頁面
  };
  
  // 處理尋求支援
  const handleRequestSupport = () => {
    console.log('尋求支援');
    // 在實際應用中，這裡應該導航到尋求支援頁面
  };
  
  // 處理查看更多好友動態
  const handleViewMoreActivities = () => {
    console.log('查看更多好友動態');
    // 在實際應用中，這裡應該導航到好友動態頁面
  };
  
  // 處理好友動態點擊
  const handleActivityClick = (activity) => {
    console.log(`查看動態: ${activity.id}`);
    // 在實際應用中，這裡應該根據動態類型導航到相應頁面
  };
  
  // 處理篩選類型變更
  const handleFilterChange = (type) => {
    setFilterType(type);
  };
  
  // 獲取當前篩選後的願望列表
  const getFilteredWishes = () => {
    let wishes = [];
    
    // 根據當前標籤獲取基礎願望列表
    if (activeTab === 'trending') {
      wishes = [...trendingWishes];
    } else if (activeTab === 'latest') {
      wishes = [...latestWishes];
    } else if (activeTab === 'following') {
      wishes = [...followingWishes];
    } else if (activeTab === 'search') {
      wishes = [...searchResults];
    }
    
    // 根據篩選類型進一步篩選
    if (filterType === 'friends') {
      return wishes.filter(wish => friendWishes.some(fw => fw.id === wish.id));
    } else if (filterType === 'challenges') {
      return wishes.filter(wish => challengeWishes.some(cw => cw.id === wish.id));
    } else if (filterType === 'support') {
      return wishes.filter(wish => supportWishes.some(sw => sw.id === wish.id));
    } else if (filterType === 'hot') {
      return wishes.sort((a, b) => b.likes - a.likes);
    } else if (filterType === 'latest') {
      // 假設有 createdAt 屬性，實際應用中應該有
      return wishes.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (filterType === 'following') {
      return wishes.filter(wish => followingWishes.some(fw => fw.id === wish.id));
    }
    
    // 默認返回所有願望
    return wishes;
  };
  
  // 渲染願望卡片 - 改為動態牆樣式
  const renderWishCard = (wish) => (
    <div 
      key={wish.id} 
      className="wish-card" 
      style={{ 
        padding: '15px',
        marginBottom: '20px',
        cursor: 'pointer',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        backgroundColor: 'white'
      }}
      onClick={() => handleWishClick(wish.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <div 
          style={{ 
            fontSize: '24px', 
            marginRight: '12px',
            width: '40px',
            height: '40px',
            backgroundColor: '#f2f2f7',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleUserClick(wish.user.username);
          }}
        >
          {wish.user.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 'bold' }}>{wish.user.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>@{wish.user.username}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {wish.createdAt ? new Date(wish.createdAt).toLocaleDateString() : ''}
        </div>
      </div>
      
      <h3 style={{ margin: '0 0 10px 0' }}>{wish.title}</h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '10px',
        fontSize: '14px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ 
          backgroundColor: '#f2f2f7', 
          padding: '4px 8px', 
          borderRadius: '12px',
          marginRight: '10px'
        }}>
          {wish.category}
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
          <span>進度 {wish.progress}%</span>
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
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        borderTop: '1px solid #f2f2f7',
        paddingTop: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginRight: '15px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log(`點讚願望: ${wish.id}`);
            }}
          >
            <span style={{ marginRight: '5px' }}>❤️</span>
            <span>{wish.likes}</span>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log(`評論願望: ${wish.id}`);
            }}
          >
            <span style={{ marginRight: '5px' }}>💬</span>
            <span>{wish.comments}</span>
          </div>
        </div>
        <div>
          <button 
            style={{ 
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log(`分享願望: ${wish.id}`);
            }}
          >
            分享
          </button>
        </div>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>載入中...</div>
      </div>
    );
  }
  
  return (
    <div className="content-area">
      {/* 篩選按鈕 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '20px',
        padding: '5px 0'
      }}>
        <button 
          style={{ 
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: filterType === 'all' ? 'var(--primary-color)' : '#f2f2f7',
            color: filterType === 'all' ? 'white' : 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            flex: '1',
            margin: '0 5px'
          }}
          onClick={() => {
            handleFilterChange('all');
            handleTabChange('trending');
          }}
        >
          全部
        </button>
        <button 
          style={{ 
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: filterType === 'friends' ? 'var(--primary-color)' : '#f2f2f7',
            color: filterType === 'friends' ? 'white' : 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            flex: '1',
            margin: '0 5px'
          }}
          onClick={() => handleFilterChange('friends')}
        >
          好友
        </button>
        <button 
          style={{ 
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: filterType === 'latest' ? 'var(--primary-color)' : '#f2f2f7',
            color: filterType === 'latest' ? 'white' : 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            flex: '1',
            margin: '0 5px'
          }}
          onClick={() => {
            handleFilterChange('latest');
            handleTabChange('latest');
          }}
        >
          最新
        </button>
        <button 
          style={{ 
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: filterType === 'hot' ? 'var(--primary-color)' : '#f2f2f7',
            color: filterType === 'hot' ? 'white' : 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            flex: '1',
            margin: '0 5px'
          }}
          onClick={() => {
            handleFilterChange('hot');
            handleTabChange('trending');
          }}
        >
          熱門
        </button>
        <button 
          style={{ 
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: filterType === 'following' ? 'var(--primary-color)' : '#f2f2f7',
            color: filterType === 'following' ? 'white' : 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            flex: '1',
            margin: '0 5px'
          }}
          onClick={() => handleFilterChange('following')}
        >
          追蹤
        </button>
      </div>

      {/* 搜索欄 */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px',
        position: 'relative'
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={texts.communityPage.searchPlaceholder}
          style={{ 
            flex: 1,
            padding: '10px 15px',
            borderRadius: '20px',
            border: '1px solid #e0e0e0',
            fontSize: '16px'
          }}
        />
        <button 
          style={{ 
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
          onClick={() => handleTabChange('search')}
        >
          🔍
        </button>
      </div>
      
      {/* 主要內容區域 - 改為單列動態牆 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* 願望列表 */}
        <div>
          {activeTab === 'trending' && (
            <div>
              {getFilteredWishes().map(wish => renderWishCard(wish))}
            </div>
          )}
          
          {activeTab === 'latest' && (
            <div>
              {getFilteredWishes().map(wish => renderWishCard(wish))}
            </div>
          )}
          
          {activeTab === 'following' && (
            <div>
              {getFilteredWishes().length > 0 ? (
                getFilteredWishes().map(wish => renderWishCard(wish))
              ) : (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
                  <h3>{texts.communityPage.following.empty.title}</h3>
                  <p>{texts.communityPage.following.empty.description}</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'search' && (
            <div>
              {searchResults.length > 0 ? (
                getFilteredWishes().map(wish => renderWishCard(wish))
              ) : (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
                  <h3>{texts.communityPage.search.empty.title}</h3>
                  <p>{texts.communityPage.search.empty.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Community; 