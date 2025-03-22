import React from 'react';
import { Link } from 'react-router-dom';

function Privacy() {
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
        
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>隱私政策</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>最後更新日期：2023年12月1日</p>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>1. 引言</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            願望中心（"我們"，"我們的"，"服務"）尊重您的隱私。本隱私政策解釋了我們如何收集、使用、披露和保護您的個人信息。通過使用我們的服務，您同意本隱私政策中描述的數據實踐。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>2. 我們收集的信息</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們可能收集以下類型的信息：
          </p>
          <h3 style={{ fontSize: '18px', marginBottom: '10px', marginTop: '20px' }}>2.1 您提供的信息</h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '10px' }}>帳戶信息：當您註冊帳戶時，我們收集您的姓名、電子郵件地址和密碼。</li>
            <li style={{ marginBottom: '10px' }}>個人資料信息：您可能選擇提供其他信息，如頭像、生物信息、位置和社交媒體鏈接。</li>
            <li style={{ marginBottom: '10px' }}>內容：您在服務上創建的願望、目標、計劃和其他內容。</li>
            <li style={{ marginBottom: '10px' }}>通信：當您與我們聯繫時，我們收集您提供的信息。</li>
          </ul>
          
          <h3 style={{ fontSize: '18px', marginBottom: '10px', marginTop: '20px' }}>2.2 自動收集的信息</h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '10px' }}>使用數據：我們收集有關您如何使用服務的信息，包括訪問時間、瀏覽頁面和互動。</li>
            <li style={{ marginBottom: '10px' }}>設備信息：我們收集有關您使用的設備的信息，包括設備類型、操作系統、瀏覽器類型和設備標識符。</li>
            <li style={{ marginBottom: '10px' }}>位置信息：根據您的設備設置，我們可能收集您的大致位置。</li>
            <li style={{ marginBottom: '10px' }}>Cookies和類似技術：我們使用cookies和類似技術來收集信息並改善您的體驗。</li>
          </ul>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>3. 我們如何使用信息</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們使用收集的信息用於以下目的：
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '10px' }}>提供、維護和改進我們的服務</li>
            <li style={{ marginBottom: '10px' }}>處理和完成交易</li>
            <li style={{ marginBottom: '10px' }}>發送技術通知、更新、安全警報和支持消息</li>
            <li style={{ marginBottom: '10px' }}>回應您的評論、問題和請求</li>
            <li style={{ marginBottom: '10px' }}>開發新產品和服務</li>
            <li style={{ marginBottom: '10px' }}>監控服務的使用情況，以防止和解決問題</li>
            <li style={{ marginBottom: '10px' }}>保護服務的安全和完整性</li>
            <li style={{ marginBottom: '10px' }}>遵守法律義務</li>
          </ul>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>4. 信息共享和披露</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們可能在以下情況下共享您的信息：
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '10px' }}>經您同意：我們可能在獲得您的同意時共享您的信息。</li>
            <li style={{ marginBottom: '10px' }}>與服務提供商：我們可能與幫助我們運營服務的第三方服務提供商共享信息。</li>
            <li style={{ marginBottom: '10px' }}>出於法律原因：如果我們認為披露是遵守適用法律、法規或法律程序所必需的，我們可能會披露您的信息。</li>
            <li style={{ marginBottom: '10px' }}>在業務轉變的情況下：如果我們參與合併、收購或資產出售，您的信息可能會作為該交易的一部分被轉讓。</li>
          </ul>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>5. 數據安全</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們採取合理措施保護您的個人信息免受未經授權的訪問、使用或披露。然而，沒有任何安全系統是不可滲透的，我們無法保證您的信息的絕對安全。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>6. 您的選擇和權利</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            您可能擁有以下權利：
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '10px' }}>訪問和更新您的個人信息</li>
            <li style={{ marginBottom: '10px' }}>刪除您的帳戶和個人信息</li>
            <li style={{ marginBottom: '10px' }}>選擇退出某些數據收集和使用</li>
            <li style={{ marginBottom: '10px' }}>限制我們如何處理您的數據</li>
          </ul>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            要行使這些權利，請通過下面提供的聯繫信息與我們聯繫。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>7. 兒童隱私</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們的服務不針對13歲以下的兒童。我們不會故意收集13歲以下兒童的個人信息。如果您發現我們可能收集了13歲以下兒童的信息，請聯繫我們，我們將採取措施刪除該信息。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>8. 國際數據傳輸</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            您的信息可能會被傳輸到並在台灣以外的國家/地區進行處理，這些國家/地區的數據保護法律可能與您所在國家/地區的法律不同。通過使用我們的服務，您同意將您的信息傳輸到這些國家/地區。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>9. 隱私政策變更</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            我們可能會不時更新本隱私政策。如果我們進行重大更改，我們將通過在服務上發布新的隱私政策或通過其他方式通知您。
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>10. 聯繫我們</h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            如果您對本隱私政策有任何問題或疑慮，請通過以下方式聯繫我們：
          </p>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            電子郵件：privacy@wishhub.com<br />
            地址：台北市信義區信義路五段7號
          </p>
        </section>
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ textAlign: 'center', color: '#666' }}>
            通過使用我們的服務，您確認您已閱讀並理解本隱私政策。
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy; 