import React, { useState, useEffect } from 'react';

function StatusBar() {
  const [currentTime, setCurrentTime] = useState('');

  // 更新時間
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    // 初始化時間
    updateTime();

    // 每分鐘更新一次
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-time">{currentTime}</span>
      </div>
      <div className="status-right">
        <i className="fas fa-signal"></i>
        <i className="fas fa-wifi"></i>
        <i className="fas fa-battery-full"></i>
      </div>
    </div>
  );
}

export default StatusBar; 