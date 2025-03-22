import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WishCard({ wish }) {
  const [isLiked, setIsLiked] = useState(wish.isLiked || false);
  const [likeCount, setLikeCount] = useState(wish.likeCount || 0);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = (e) => {
    e.stopPropagation();
    // 實現評論功能
    console.log('評論心願:', wish.id);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    // 實現收藏功能
    console.log('收藏心願:', wish.id);
  };

  const handleCardClick = () => {
    navigate(`/plan/${wish.id}`);
  };

  return (
    <div className="wish-card" onClick={handleCardClick}>
      <div className="wish-header">
        <img src={wish.userAvatar} alt="用戶頭像" className="avatar-sm" />
        <div className="wish-user-info">
          <div className="wish-username">{wish.username}</div>
          <div className="wish-time">{wish.time}</div>
        </div>
      </div>
      <div className="wish-content">
        <div className="wish-title">{wish.title}</div>
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
      </div>
      <div className="wish-actions">
        <div className={`wish-action ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          <i className={isLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
          <span className="like-count">{likeCount}</span>
        </div>
        <div className="wish-action" onClick={handleComment}>
          <i className="far fa-comment"></i>
          <span>{wish.commentCount}</span>
        </div>
        <div className="wish-action" onClick={handleBookmark}>
          <i className="far fa-bookmark"></i>
          <span>收藏</span>
        </div>
      </div>
    </div>
  );
}

export default WishCard; 