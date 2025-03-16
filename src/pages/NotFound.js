import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      textAlign: 'center'
    }}>
      <div style={{ 
        fontSize: '120px',
        fontWeight: 'bold',
        color: '#007aff',
        marginBottom: '20px',
        lineHeight: '1'
      }}>
        404
      </div>
      
      <h1 style={{ 
        fontSize: '32px',
        marginBottom: '20px',
        color: '#333'
      }}>
        頁面未找到
      </h1>
      
      <p style={{ 
        fontSize: '18px',
        color: '#666',
        maxWidth: '500px',
        marginBottom: '40px',
        lineHeight: '1.6'
      }}>
        抱歉，您嘗試訪問的頁面不存在或已被移動。
      </p>
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          backgroundColor: '#007aff',
          color: 'white',
          textDecoration: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}>
          返回首頁
        </Link>
        
        <Link to="/contact" style={{ 
          color: '#007aff',
          textDecoration: 'none',
          fontSize: '16px'
        }}>
          報告問題
        </Link>
      </div>
      
      <div style={{ 
        marginTop: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{ 
          fontSize: '16px',
          color: '#666',
          marginBottom: '15px'
        }}>
          您可能想要訪問：
        </p>
        
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <Link to="/home" style={{ 
            color: '#007aff',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#e6f2ff',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            主頁
          </Link>
          
          <Link to="/wishlist" style={{ 
            color: '#007aff',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#e6f2ff',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            願望清單
          </Link>
          
          <Link to="/community" style={{ 
            color: '#007aff',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#e6f2ff',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            社區
          </Link>
          
          <Link to="/profile" style={{ 
            color: '#007aff',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#e6f2ff',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            個人資料
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 