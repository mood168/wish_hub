import React from 'react';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '800px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '40px'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <Link 
            to="/" 
            style={{ 
              color: '#007aff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px'
            }}
          >
            ← 返回首頁
          </Link>
        </div>
        
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>服務條款</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>最後更新日期：2023年12月1日</p>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>1. 接受條款</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            歡迎使用願望中心（"服務"）。本服務由願望中心團隊（"我們"，"我們的"）提供。通過訪問或使用我們的服務，您同意受本服務條款（"條款"）的約束。如果您不同意這些條款的任何部分，則您可能不會使用我們的服務。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>2. 服務描述</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            願望中心是一個允許用戶創建、管理和追蹤個人願望和目標的平台。我們提供工具來幫助用戶組織他們的願望，設定目標，並追蹤進度。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>3. 用戶帳戶</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            要使用某些服務功能，您需要創建一個帳戶。您負責維護您的帳戶安全，並對您帳戶下發生的所有活動負全責。您同意提供準確、完整和最新的信息。如果您懷疑您的帳戶安全受到威脅，請立即通知我們。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>4. 用戶內容</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們的服務允許您發布、鏈接、存儲、分享和以其他方式提供某些信息、文本、圖形、視頻或其他材料（"內容"）。您對使用服務發布的所有內容負責，並聲明您擁有或有必要權限發布此類內容。
          </p>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            您保留您在服務上發布的任何內容的所有權利。通過在服務上發布內容，您授予我們非獨占、免版稅、可轉讓、可再許可、全球性許可，以使用、複製、修改、創建衍生作品、分發、公開展示和執行此類內容。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>5. 禁止行為</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            您同意不會：
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '10px' }}>違反任何適用法律或法規</li>
            <li style={{ marginBottom: '10px' }}>侵犯他人的權利，包括但不限於隱私權和知識產權</li>
            <li style={{ marginBottom: '10px' }}>發布虛假、誤導或欺騙性內容</li>
            <li style={{ marginBottom: '10px' }}>收集或存儲其他用戶的個人數據，未經其明確許可</li>
            <li style={{ marginBottom: '10px' }}>干擾或破壞服務或連接到服務的服務器或網絡</li>
            <li style={{ marginBottom: '10px' }}>使用自動化手段（如機器人、爬蟲等）訪問服務</li>
          </ul>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>6. 知識產權</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            服務及其原始內容、功能和設計是我們的專有財產，受國際版權、商標、專利、商業秘密和其他知識產權或專有權利法律的保護。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>7. 終止</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們可以因任何原因隨時終止或暫停您對服務的訪問，包括但不限於違反這些條款。終止後，您使用服務的權利將立即停止。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>8. 免責聲明</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            服務按"原樣"和"可用"基礎提供，不提供任何明示或暗示的保證。我們不保證服務將不間斷、及時、安全或無錯誤。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>9. 責任限制</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            在任何情況下，我們對因使用或無法使用服務而產生的任何間接、偶然、特殊、示範性或後果性損害不承擔責任。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>10. 條款變更</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們保留隨時修改或替換這些條款的權利。如果修訂是重大的，我們將嘗試提前至少30天通知。什麼構成重大變更將由我們自行決定。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>11. 聯繫我們</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            如果您對這些條款有任何問題，請通過以下方式聯繫我們：
          </p>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            電子郵件：support@wishhub.com<br />
            地址：台北市信義區信義路五段7號
          </p>
        </section>
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ textAlign: 'center', color: '#666' }}>
            通過使用我們的服務，您確認您已閱讀並理解這些條款，並同意受其約束。
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terms; 