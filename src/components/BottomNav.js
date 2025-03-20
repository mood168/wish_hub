import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';

function BottomNav() {
  const location = useLocation();
  const { texts } = useLanguage();
  const { unreadCount } = useNotification();
  
  // 檢查當前路徑是否匹配
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bottom-nav">
      <NavLink to="/notifications" className={isActive('/notifications') ? 'active' : ''}>
        <div className="nav-icon-container">
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <span>{texts.nav.notifications}</span>
      </NavLink>
      <NavLink to="/community" className={isActive('/community') ? 'active' : ''}>
        <i className="fas fa-users"></i>
        <span>{texts.nav.community}</span>
      </NavLink>
      <NavLink to="/home" className={isActive('/home') ? 'active' : ''} data-target="home-iframe">
        <i className="fas fa-home"></i>
        <span>{texts.nav.home}</span>
      </NavLink>
      <NavLink to="/rewards" className={isActive('/rewards') ? 'active' : ''}>
        <i className="fas fa-trophy"></i>
        <span>{texts.nav.rewards}</span>
      </NavLink>
      <NavLink to="/settings" className={isActive('/settings') ? 'active' : ''}>
        <i className="fas fa-cog"></i>
        <span>{texts.nav.settings}</span>
      </NavLink>
    </div>
  );
}

export default BottomNav; 