import React, { createContext, useContext } from 'react';
import { useDatabase } from './DatabaseContext';

const ServicesContext = createContext();

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices 必須在 ServicesProvider 內使用');
  }
  return context;
};

export const ServicesProvider = ({ children }) => {
  const { 
    wishService, 
    commentService, 
    userService, 
    stepService, 
    isLoading,
    // 其他服務...
  } = useDatabase();

  const services = {
    wishService,
    commentService,
    userService,
    stepService,
    isLoading,
    // 其他服務...
  };

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}; 