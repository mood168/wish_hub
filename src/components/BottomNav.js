import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function BottomNav() {
  const location = useLocation();
  const { texts } = useLanguage();
  
  // 檢查當前路徑是否匹配
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bottom-nav">
      <NavLink to="/wishlist" className={isActive('/wishlist') ? 'active' : ''}>
        <i className="fas fa-list-alt"></i>
        <span>{texts.nav.wishlist}</span>
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