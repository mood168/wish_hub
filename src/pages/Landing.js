import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#ffffff'
    }}>
      {/* 導航欄 */}
      <nav style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#007aff'
        }}>
          願望中心
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/login" style={{ 
            color: '#333',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'background-color 0.3s'
          }}>
            登錄
          </Link>
          <Link to="/register" style={{ 
            backgroundColor: '#007aff',
            color: 'white',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'background-color 0.3s'
          }}>
            註冊
          </Link>
        </div>
      </nav>
      
      {/* 英雄區域 */}
      <section style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 20px',
        backgroundColor: '#f0f8ff'
      }}>
        <h1 style={{ 
          fontSize: '48px',
          marginBottom: '20px',
          maxWidth: '800px'
        }}>
          追蹤並實現您的願望
        </h1>
        <p style={{ 
          fontSize: '20px',
          color: '#555',
          maxWidth: '600px',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          願望中心幫助您組織、追蹤和實現您的願望和目標，讓夢想成真不再只是一個願望。
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/register" style={{ 
            backgroundColor: '#007aff',
            color: 'white',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}>
            立即開始
          </Link>
          <Link to="/about" style={{ 
            backgroundColor: 'transparent',
            color: '#007aff',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '1px solid #007aff',
            transition: 'background-color 0.3s'
          }}>
            了解更多
          </Link>
        </div>
      </section>
      
      {/* 特點區域 */}
      <section style={{ 
        padding: '80px 20px',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '36px',
            marginBottom: '60px'
          }}>
            為什麼選擇願望中心？
          </h2>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '40px'
          }}>
            {/* 特點卡片 1 */}
            <div style={{ 
              flex: '1 1 300px',
              maxWidth: '350px',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '36px',
                marginBottom: '20px',
                color: '#007aff'
              }}>
                ✓
              </div>
              <h3 style={{ 
                fontSize: '24px',
                marginBottom: '15px'
              }}>
                組織您的願望
              </h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                創建願望清單，分類您的目標，並設置優先級，讓您的願望井井有條。
              </p>
            </div>
            
            {/* 特點卡片 2 */}
            <div style={{ 
              flex: '1 1 300px',
              maxWidth: '350px',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '36px',
                marginBottom: '20px',
                color: '#007aff'
              }}>
                📊
              </div>
              <h3 style={{ 
                fontSize: '24px',
                marginBottom: '15px'
              }}>
                追蹤進度
              </h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                監控您的進展，慶祝里程碑，並保持動力以實現您的願望。
              </p>
            </div>
            
            {/* 特點卡片 3 */}
            <div style={{ 
              flex: '1 1 300px',
              maxWidth: '350px',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '36px',
                marginBottom: '20px',
                color: '#007aff'
              }}>
                🤝
              </div>
              <h3 style={{ 
                fontSize: '24px',
                marginBottom: '15px'
              }}>
                社區支持
              </h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                與志同道合的人分享您的願望，獲得支持和靈感，一起成長。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 如何工作區域 */}
      <section style={{ 
        padding: '80px 20px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '36px',
            marginBottom: '20px'
          }}>
            如何使用願望中心
          </h2>
          <p style={{ 
            fontSize: '18px',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto 60px',
            lineHeight: '1.6'
          }}>
            只需三個簡單步驟，開始追蹤和實現您的願望
          </p>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '40px'
          }}>
            {/* 步驟 1 */}
            <div style={{ 
              flex: '1 1 300px',
              maxWidth: '350px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#007aff',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                1
              </div>
              <h3 style={{ 
                fontSize: '24px',
                marginBottom: '15px'
              }}>
                創建帳戶
              </h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                註冊一個免費帳戶，開始您的願望追蹤之旅。
              </p>
            </div>
            
            {/* 步驟 2 */}
            <div style={{ 
              flex: '1 1 300px',
              maxWidth: '350px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#007aff',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                2
              </div>
              <h3 style={{ 
                fontSize: '24px',
                marginBottom: '15px'
              }}>
                添加願望
              </h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                創建您的願望，添加詳細信息，設置目標和截止日期。
              </p>
            </div>
            
            {/* 步驟 3 */}
            <div style={{ 
              flex: '1 1 300px',
              maxWidth: '350px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#007aff',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                3
              </div>
              <h3 style={{ 
                fontSize: '24px',
                marginBottom: '15px'
              }}>
                追蹤進度
              </h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                更新您的進度，慶祝成就，實現您的願望。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 行動召喚區域 */}
      <section style={{ 
        padding: '80px 20px',
        backgroundColor: '#007aff',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ 
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{ 
            fontSize: '36px',
            marginBottom: '20px'
          }}>
            準備好實現您的願望了嗎？
          </h2>
          <p style={{ 
            fontSize: '18px',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            今天就加入願望中心，開始追蹤和實現您的願望。
          </p>
          <Link to="/register" style={{ 
            backgroundColor: 'white',
            color: '#007aff',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}>
            立即註冊 - 免費
          </Link>
        </div>
      </section>
      
      {/* 頁腳 */}
      <footer style={{ 
        padding: '40px 20px',
        backgroundColor: '#f0f0f0',
        color: '#666'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '40px'
        }}>
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ 
              fontSize: '20px',
              marginBottom: '15px',
              color: '#333'
            }}>
              願望中心
            </h3>
            <p style={{ lineHeight: '1.6' }}>
              幫助您追蹤和實現願望的平台。
            </p>
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <h3 style={{ 
              fontSize: '20px',
              marginBottom: '15px',
              color: '#333'
            }}>
              鏈接
            </h3>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/about" style={{ 
                  color: '#666',
                  textDecoration: 'none'
                }}>
                  關於我們
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/features" style={{ 
                  color: '#666',
                  textDecoration: 'none'
                }}>
                  功能
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/contact" style={{ 
                  color: '#666',
                  textDecoration: 'none'
                }}>
                  聯繫我們
                </Link>
              </li>
            </ul>
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <h3 style={{ 
              fontSize: '20px',
              marginBottom: '15px',
              color: '#333'
            }}>
              法律
            </h3>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/terms" style={{ 
                  color: '#666',
                  textDecoration: 'none'
                }}>
                  服務條款
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/privacy" style={{ 
                  color: '#666',
                  textDecoration: 'none'
                }}>
                  隱私政策
                </Link>
              </li>
            </ul>
          </div>
          
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ 
              fontSize: '20px',
              marginBottom: '15px',
              color: '#333'
            }}>
              聯繫我們
            </h3>
            <p style={{ lineHeight: '1.6' }}>
              電子郵件：contact@wishhub.com<br />
              地址：台北市信義區信義路五段7號
            </p>
          </div>
        </div>
        
        <div style={{ 
          maxWidth: '1200px',
          margin: '40px auto 0',
          textAlign: 'center',
          borderTop: '1px solid #ddd',
          paddingTop: '20px'
        }}>
          <p>© 2023 願望中心。保留所有權利。</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing; 