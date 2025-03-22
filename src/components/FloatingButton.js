import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FloatingButton() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    navigate('/add-wish');
  };
  
  return (
    <div 
      className="floating-btn pulse" 
      onClick={handleClick}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <i className="fas fa-plus"></i>
      {isOpen && (
        <span 
          style={{
            position: 'absolute',
            right: '70px',
            backgroundColor: 'var(--card-color)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            boxShadow: 'var(--shadow-md)',
            whiteSpace: 'nowrap',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          新增願望
        </span>
      )}
    </div>
  );
}

export default FloatingButton; 