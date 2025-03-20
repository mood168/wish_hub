import React, { createContext, useState, useEffect, useContext } from 'react';

// 語言文本對象
const translations = {
  'zh-TW': {
    // 底部導航欄
    nav: {
      home: '首頁',
      wishlist: '願望清單',
      community: '社群',
      notifications: '通知',
      settings: '設定',
      rewards: '獎勵'
    },
    // 設定頁
    settings: {
      title: '設定',
      userProfile: {
        editProfile: '編輯個人資料',
        joinTime: '加入時間'
      },
      appSettings: {
        title: '應用設定',
        save: '儲存',
        saving: '儲存中...',
        themeColor: '系統主色調',
        darkMode: {
          title: '深色模式',
          desc: '切換應用的顯示主題'
        },
        fontSize: {
          title: '字型大小',
          desc: '調整應用文字大小',
          small: '小',
          medium: '中',
          large: '大',
          xlarge: '特大'
        },
        notifications: {
          title: '通知',
          desc: '接收應用通知',
          types: {
            title: '通知類型',
            wishUpdates: '願望更新提醒',
            friendActivity: '好友活動提醒',
            systemUpdates: '系統更新提醒'
          }
        },
        language: {
          title: '語言',
          desc: '選擇應用顯示語言'
        }
      },
      about: {
        title: '關於與支援',
        privacy: '隱私政策',
        terms: '使用條款',
        contact: '聯絡我們',
        about: '關於 WishHub',
        version: '版本'
      },
      logout: '登出',
      saveSuccess: '設定已儲存'
    },
    // 編輯個人資料頁
    editProfile: {
      title: '編輯個人資料',
      save: '儲存',
      saving: '儲存中...',
      back: '返回',
      avatar: '個人頭像',
      uploadCustomAvatar: '上傳專屬頭像',
      chooseDefaultAvatar: '選擇預設頭像',
      chooseFile: '選擇檔案',
      nickname: '暱稱',
      nicknamePlaceholder: '輸入您的暱稱',
      bio: {
        title: '背景故事',
        desc: '分享一些關於您自己的資訊，讓其他用戶更了解您',
        placeholder: '分享您的故事、興趣或目標...',
        charCount: '字元'
      },
      interests: {
        title: '興趣',
        desc: '選擇您感興趣的類別，我們將為您推薦相關內容'
      },
      cancel: '取消',
      saveChanges: '儲存變更'
    },
    // 首頁
    home: {
      title: '首頁',
      tabs: {
        all: '全部',
        inProgress: '進行中',
        completed: '已完成',
        notStarted: '未開始'
      },
      popularWishes: '熱門願望',
      todayTasks: '今日待辦',
      addWish: '新增願望',
      quickAddWish: '快速新增',
      quickAddDesc: '立即記錄靈感',
      addWishDesc: '創建詳細的願望',
      noWishes: '目前沒有願望',
      noTasks: '今天沒有待辦任務',
      greeting: {
        morning: '早安',
        afternoon: '午安',
        evening: '晚安'
      },
      welcomeMessage: '今天是個美好的一天，繼續追尋你的願望吧！',
      seeAll: '查看全部'
    },
    // 通知頁
    notifications: {
      title: '通知',
      tabs: {
        all: '全部',
        unread: '未讀',
        social: '社交',
        system: '系統'
      },
      notificationTypes: {
        like: '喜歡了你的願望',
        comment: '評論了你的願望',
        follow: '關注了你',
        badge: '恭喜你獲得「{badge}」徽章！',
        progress: '你的願望進度已達到 {progress}%',
        welcome: '歡迎加入願望中心！開始創建你的第一個願望吧。'
      },
      noNotifications: '目前沒有通知',
      markAllAsRead: '標記全部為已讀'
    },
    // 社群頁
    community: {
      title: '社群',
      search: '搜尋',
      trending: '熱門話題',
      following: '關注中',
      discover: '探索',
      noContent: '目前沒有內容'
    },
    // 獎勵頁
    rewards: {
      title: '獎勵中心',
      currentLevel: '當前等級',
      pointsToNextLevel: '還需 {points} 積分升級',
      tabs: {
        collection: '收藏',
        shop: '商店',
        competition: '競賽',
        history: '歷史'
      },
      badges: {
        title: '徽章收藏',
        unlocked: '已解鎖',
        locked: '未解鎖',
        progress: '進度'
      },
      titles: {
        title: '稱號',
        equip: '裝備',
        equipped: '已裝備',
        explorer: {
          name: '願望探索者',
          description: '創建第一個願望'
        },
        persistent: {
          name: '堅持達人',
          description: '連續打卡30天'
        },
        socialStar: {
          name: '社群之星',
          description: '獲得50個讚'
        },
        achiever: {
          name: '願望實現家',
          description: '完成10個願望'
        },
        planner: {
          name: '頂級規劃師',
          description: '創建並完成20個計劃'
        }
      },
      points: {
        title: '積分',
        history: '積分歷史',
        earn: '獲得方式',
        spend: '使用方式'
      },
      shop: {
        title: '獎勵商店',
        virtual: '虛擬獎勵',
        physical: '實體獎勵',
        redeem: '兌換',
        redeemed: '已兌換',
        pointsRequired: '所需積分'
      },
      competition: {
        title: '社群競賽',
        active: '進行中',
        upcoming: '即將開始',
        past: '已結束',
        join: '參加',
        joined: '已參加',
        leaderboard: '排行榜',
        rank: '排名',
        user: '用戶',
        score: '分數'
      }
    },
    // 會員等級頁面
    memberLevel: {
      title: '會員等級說明',
      about: {
        title: '關於會員等級',
        description: '願望中心提供不同的會員等級，每個等級都有專屬特權和功能，幫助您更有效地實現願望和目標。升級會員等級可以解鎖更多強大功能，讓您的願望追蹤體驗更加豐富和個人化。',
        regular: '一般會員',
        gold: '金牌會員',
        diamond: '鑽石會員'
      },
      levels: {
        regular: {
          name: '一般會員',
          description: '基本會員',
          howToGet: '',
          privileges: [
            '創建最多 5 個願望清單',
            '使用基本願望追蹤功能',
            '參與社區討論',
            '獲取每週進度報告'
          ]
        },
        gold: {
          name: '金牌會員',
          description: '進階會員',
          howToGet: '完成至少 10 個願望，或在設定頁面中升級您的會員等級。',
          privileges: [
            '創建無限願望清單',
            '高級數據分析和視覺化',
            '獲取專屬金牌會員徽章',
            '優先參與新功能測試',
            '每月收到專業建議和指導',
            '無廣告體驗'
          ]
        },
        diamond: {
          name: '鑽石會員',
          description: '尊榮會員',
          howToGet: '完成至少 20 個願望，或在設定頁面中升級您的會員等級。',
          privileges: [
            '包含所有金牌會員特權',
            '獲取專屬鑽石會員徽章',
            '個人化願望達成策略',
            '專屬客服支援',
            '獲取獨家社區活動邀請',
            '每週收到專業教練指導',
            '可使用高級自定義主題'
          ]
        }
      },
      faq: {
        title: '常見問題',
        questions: [
          {
            question: '如何升級我的會員等級？',
            answer: '您可以在「設定」頁面中的「會員等級」部分選擇您想要的會員等級。在實際應用中，這可能需要支付相應的費用或達成特定成就。'
          },
          {
            question: '會員等級有效期是多久？',
            answer: '在此示範應用中，會員等級永久有效。在實際應用中，高級會員可能需要按月或按年訂閱。'
          },
          {
            question: '我可以降級我的會員等級嗎？',
            answer: '是的，您可以隨時在「設定」頁面中更改您的會員等級。'
          },
          {
            question: '會員等級會影響我已創建的願望嗎？',
            answer: '降級會員等級可能會限制某些功能的使用，但不會刪除您已創建的願望和數據。如果您超出了較低等級的限制（例如願望清單數量），您將無法創建新的內容，但現有內容會保留。'
          }
        ]
      },
      goToSettings: '前往設定管理會員等級'
    },
    // 願望清單頁
    wishlist: {
      title: '願望清單',
      createNewList: '創建新列表',
      listName: '列表名稱',
      enterListName: '輸入列表名稱',
      create: '創建',
      cancel: '取消',
      addWish: '添加願望',
      noWishes: '這個列表還沒有願望',
      noWishesDesc: '點擊"添加願望"按鈕開始創建願望',
      priority: '優先級',
      dueDate: '截止日期',
      progress: '進度',
      priorityLevels: {
        high: '高',
        medium: '中',
        low: '低',
        none: '無'
      },
      stats: {
        total: '總願望',
        completed: '已完成',
        inProgress: '進行中',
        notStarted: '未開始'
      }
    },
    // 社群頁
    communityPage: {
      title: '社群',
      search: '搜索願望、標籤或用戶...',
      searchButton: '搜索',
      tabs: {
        trending: '熱門',
        latest: '最新',
        following: '關注',
        search: '搜索結果'
      },
      trendingTags: '熱門標籤',
      recommendedFollow: '推薦關注',
      follow: '關注',
      noFollowing: '你還沒有關注任何人',
      noFollowingDesc: '關注其他用戶以查看他們的願望和進度',
      explorePopular: '探索熱門願望',
      noSearchResults: '沒有找到相關結果',
      noSearchResultsDesc: '嘗試使用不同的關鍵詞搜索',
      createdAt: '創建於',
      challenge: {
        title: '用戶發起挑戰',
        description: '加入其他用戶發起的挑戰，一起實現目標',
        create: '發起挑戰',
        join: '加入挑戰',
        participants: '參與者',
        days: '天',
        viewAll: '查看全部'
      },
      support: {
        title: '心願支援者',
        description: '為他人提供建議、教學資源或幫助',
        offer: '提供支援',
        request: '尋求支援',
        viewAll: '查看全部'
      },
      friendActivity: {
        title: '好友動態',
        description: '查看你的好友最近的心願進度與成就',
        viewMore: '查看更多',
        noActivity: '暫無好友動態',
        noActivityDesc: '關注更多用戶以查看他們的動態',
        achievedProgress: '達成了 {progress}% 的進度',
        completed: '完成了願望',
        started: '開始了新願望',
        achieved: '獲得了成就'
      }
    },
    // 添加願望頁
    addWish: {
      title: '新增願望',
      cancel: '取消',
      fields: {
        title: {
          label: '標題',
          placeholder: '輸入願望標題'
        },
        description: {
          label: '描述',
          placeholder: '描述您的願望'
        },
        category: {
          label: '分類',
          placeholder: '選擇分類'
        },
        priority: {
          label: '計畫優先等級',
          placeholder: '選擇優先等級',
          high: '高',
          medium: '中',
          low: '低',
          highDesc: '需要立即關注和行動的重要目標',
          mediumDesc: '需要持續關注但不緊急的目標',
          lowDesc: '可以慢慢進行的次要目標'
        },
        goals: {
          label: '目標設定',
          dailyLabel: '每日目標',
          weeklyLabel: '每週目標',
          placeholder: '輸入目標內容',
          add: '新增目標',
          aiSuggestion: 'AI建議',
          aiSettings: {
            label: 'AI建議設定',
            mode: {
              label: '難度安排',
              easyToHard: '由簡入難',
              average: '平均難度',
              hardToEasy: '由難入簡'
            }
          }
        },
        tags: {
          label: '標籤',
          placeholder: '新增標籤',
          add: '新增'
        },
        dueDate: {
          label: '截止日期'
        },
        visibility: {
          label: '公開設定',
          public: '公開',
          private: '私人',
          publicDesc: '其他用戶可以看到您的願望',
          privateDesc: '只有您能看到這個願望'
        }
      },
      submit: '創建願望',
      submitting: '創建中...',
      requiredFields: '請填寫必填欄位'
    },
    // 顏色選項
    colorOptions: {
      blue: '柔和藍',
      green: '柔和綠',
      purple: '柔和紫',
      pink: '柔和粉',
      orange: '柔和橙',
      gray: '灰色調'
    },
    // 分類選項
    categories: {
      learning: '學習',
      fitness: '健身',
      travel: '旅行',
      career: '職業',
      finance: '財務',
      hobby: '興趣',
      other: '其他',
      health: '健康',
      creative: '創意',
      relationship: '關係',
      personalGrowth: '個人成長'
    },
    // 願望列表名稱
    wishlistNames: {
      learning: '學習目標',
      fitness: '健身計劃',
      travel: '旅行願望',
      career: '職業發展'
    }
  },
  'en-US': {
    // Bottom Navigation
    nav: {
      home: 'Home',
      wishlist: 'Wishlist',
      community: 'Community',
      notifications: 'Notifications',
      settings: 'Settings',
      rewards: 'Rewards'
    },
    // Settings Page
    settings: {
      title: 'Settings',
      userProfile: {
        editProfile: 'Edit Profile',
        joinTime: 'Join Time'
      },
      appSettings: {
        title: 'App Settings',
        save: 'Save',
        saving: 'Saving...',
        themeColor: 'Theme Color',
        darkMode: {
          title: 'Dark Mode',
          desc: 'Toggle app display theme'
        },
        fontSize: {
          title: 'Font Size',
          desc: 'Adjust app text size',
          small: 'Small',
          medium: 'Medium',
          large: 'Large',
          xlarge: 'Extra Large'
        },
        notifications: {
          title: 'Notifications',
          desc: 'Receive app notifications',
          types: {
            title: 'Notification Types',
            wishUpdates: 'Wish Updates',
            friendActivity: 'Friend Activity',
            systemUpdates: 'System Updates'
          }
        },
        language: {
          title: 'Language',
          desc: 'Select app display language'
        }
      },
      about: {
        title: 'About & Support',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        contact: 'Contact Us',
        about: 'About WishHub',
        version: 'Version'
      },
      logout: 'Logout',
      saveSuccess: 'Settings saved'
    },
    // Edit Profile Page
    editProfile: {
      title: 'Edit Profile',
      save: 'Save',
      saving: 'Saving...',
      back: 'Back',
      avatar: 'Avatar',
      uploadCustomAvatar: 'Upload Custom Avatar',
      chooseDefaultAvatar: 'Choose Default Avatar',
      chooseFile: 'Choose File',
      nickname: 'Nickname',
      nicknamePlaceholder: 'Enter your nickname',
      bio: {
        title: 'Bio',
        desc: 'Share some information about yourself to let other users know you better',
        placeholder: 'Share your story, interests, or goals...',
        charCount: 'characters'
      },
      interests: {
        title: 'Interests',
        desc: 'Choose categories you are interested in, we will recommend related content'
      },
      cancel: 'Cancel',
      saveChanges: 'Save Changes'
    },
    // Home Page
    home: {
      title: 'Home',
      tabs: {
        all: 'All',
        inProgress: 'In Progress',
        completed: 'Completed',
        notStarted: 'Not Started'
      },
      popularWishes: 'Popular Wishes',
      todayTasks: 'Today\'s Tasks',
      addWish: 'Add Wish',
      quickAddWish: 'Quick Add',
      quickAddDesc: 'Record inspiration instantly',
      addWishDesc: 'Create detailed wish',
      noWishes: 'No wishes yet',
      noTasks: 'No tasks for today',
      greeting: {
        morning: 'Good Morning',
        afternoon: 'Good Afternoon',
        evening: 'Good Evening'
      },
      welcomeMessage: 'Today is a beautiful day, keep pursuing your wishes!',
      seeAll: 'See All'
    },
    // Notifications Page
    notifications: {
      title: 'Notifications',
      tabs: {
        all: 'All',
        unread: 'Unread',
        social: 'Social',
        system: 'System'
      },
      notificationTypes: {
        like: 'liked your wish',
        comment: 'commented on your wish',
        follow: 'followed you',
        badge: 'Congratulations! You\'ve earned the "{badge}" badge!',
        progress: 'Your wish progress has reached {progress}%',
        welcome: 'Welcome to WishHub! Start creating your first wish.'
      },
      noNotifications: 'No notifications yet',
      markAllAsRead: 'Mark All as Read'
    },
    // Community Page
    community: {
      title: 'Community',
      search: 'Search',
      trending: 'Trending',
      following: 'Following',
      discover: 'Discover',
      noContent: 'No content yet'
    },
    // Rewards Page
    rewards: {
      title: 'Rewards Center',
      currentLevel: 'Current Level',
      pointsToNextLevel: '{points} points to next level',
      tabs: {
        collection: 'Collection',
        shop: 'Shop',
        competition: 'Competition',
        history: 'History'
      },
      badges: {
        title: 'Badge Collection',
        unlocked: 'Unlocked',
        locked: 'Locked',
        progress: 'Progress'
      },
      titles: {
        title: 'Titles',
        equip: 'Equip',
        equipped: 'Equipped',
        explorer: {
          name: 'Wish Explorer',
          description: 'Create your first wish'
        },
        persistent: {
          name: 'Persistence Master',
          description: 'Check in for 30 consecutive days'
        },
        socialStar: {
          name: 'Community Star',
          description: 'Receive 50 likes'
        },
        achiever: {
          name: 'Wish Achiever',
          description: 'Complete 10 wishes'
        },
        planner: {
          name: 'Top Planner',
          description: 'Create and complete 20 plans'
        }
      },
      points: {
        title: 'Points',
        history: 'Points History',
        earn: 'How to Earn',
        spend: 'How to Spend'
      },
      shop: {
        title: 'Rewards Shop',
        virtual: 'Virtual Rewards',
        physical: 'Physical Rewards',
        redeem: 'Redeem',
        redeemed: 'Redeemed',
        pointsRequired: 'Points Required'
      },
      competition: {
        title: 'Community Competitions',
        active: 'Active',
        upcoming: 'Upcoming',
        past: 'Past',
        join: 'Join',
        joined: 'Joined',
        leaderboard: 'Leaderboard',
        rank: 'Rank',
        user: 'User',
        score: 'Score'
      }
    },
    // Member Level Page
    memberLevel: {
      title: 'Member Level Information',
      about: {
        title: 'About Member Levels',
        description: 'WishHub offers different membership levels, each with exclusive privileges and features to help you achieve your wishes and goals more effectively. Upgrading your membership level unlocks more powerful features, making your wish tracking experience richer and more personalized.',
        regular: 'Regular Member',
        gold: 'Gold Member',
        diamond: 'Diamond Member'
      },
      levels: {
        regular: {
          name: 'Regular Member',
          description: 'Basic Membership',
          howToGet: '',
          privileges: [
            'Create up to 5 wishlists',
            'Use basic wish tracking features',
            'Participate in community discussions',
            'Receive weekly progress reports'
          ]
        },
        gold: {
          name: 'Gold Member',
          description: 'Advanced Membership',
          howToGet: 'Complete at least 10 wishes, or upgrade your membership level in the Settings page.',
          privileges: [
            'Create unlimited wishlists',
            'Advanced data analysis and visualization',
            'Get exclusive gold member badge',
            'Priority access to new feature testing',
            'Receive monthly professional advice and guidance',
            'Ad-free experience'
          ]
        },
        diamond: {
          name: 'Diamond Member',
          description: 'Premium Membership',
          howToGet: 'Complete at least 20 wishes, or upgrade your membership level in the Settings page.',
          privileges: [
            'Includes all Gold Member privileges',
            'Get exclusive diamond member badge',
            'Personalized wish achievement strategies',
            'Dedicated customer support',
            'Exclusive community event invitations',
            'Weekly professional coaching guidance',
            'Access to premium custom themes'
          ]
        }
      },
      faq: {
        title: 'Frequently Asked Questions',
        questions: [
          {
            question: 'How do I upgrade my membership level?',
            answer: 'You can select your desired membership level in the "Member Level" section of the Settings page. In a real application, this might require payment or achieving specific accomplishments.'
          },
          {
            question: 'How long is the membership level valid?',
            answer: 'In this demo application, membership levels are permanently valid. In a real application, premium memberships might require monthly or annual subscriptions.'
          },
          {
            question: 'Can I downgrade my membership level?',
            answer: 'Yes, you can change your membership level at any time in the Settings page.'
          },
          {
            question: 'Will the membership level affect my created wishes?',
            answer: 'Downgrading your membership level may limit the use of certain features, but will not delete your created wishes and data. If you exceed the limits of a lower level (e.g., number of wishlists), you will not be able to create new content, but existing content will be preserved.'
          }
        ]
      },
      goToSettings: 'Go to Settings to manage membership level'
    },
    // Wishlist Page
    wishlist: {
      title: 'Wishlist',
      createNewList: 'Create New List',
      listName: 'List Name',
      enterListName: 'Enter list name',
      create: 'Create',
      cancel: 'Cancel',
      addWish: 'Add Wish',
      noWishes: 'No wishes in this list yet',
      noWishesDesc: 'Click the "Add Wish" button to start creating wishes',
      priority: 'Priority',
      dueDate: 'Due Date',
      progress: 'Progress',
      priorityLevels: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        none: 'None'
      },
      stats: {
        total: 'Total',
        completed: 'Completed',
        inProgress: 'In Progress',
        notStarted: 'Not Started'
      }
    },
    // Community Page
    communityPage: {
      title: 'Community',
      search: 'Search wishes, tags or users...',
      searchButton: 'Search',
      tabs: {
        trending: 'Trending',
        latest: 'Latest',
        following: 'Following',
        search: 'Search Results'
      },
      trendingTags: 'Trending Tags',
      recommendedFollow: 'Recommended to Follow',
      follow: 'Follow',
      noFollowing: 'You are not following anyone yet',
      noFollowingDesc: 'Follow other users to see their wishes and progress',
      explorePopular: 'Explore Popular Wishes',
      noSearchResults: 'No results found',
      noSearchResultsDesc: 'Try searching with different keywords',
      createdAt: 'Created at',
      challenge: {
        title: 'User Challenges',
        description: 'Join challenges initiated by other users to achieve goals together',
        create: 'Create Challenge',
        join: 'Join Challenge',
        participants: 'participants',
        days: 'days',
        viewAll: 'View All'
      },
      support: {
        title: 'Wish Supporters',
        description: 'Provide advice, resources or help to others',
        offer: 'Offer Support',
        request: 'Request Support',
        viewAll: 'View All'
      },
      friendActivity: {
        title: 'Friend Activity',
        description: 'See your friends\' recent wish progress and achievements',
        viewMore: 'View More',
        noActivity: 'No friend activity yet',
        noActivityDesc: 'Follow more users to see their activities',
        achievedProgress: 'achieved {progress}% progress',
        completed: 'completed a wish',
        started: 'started a new wish',
        achieved: 'earned an achievement'
      }
    },
    // Add Wish Page
    addWish: {
      title: 'Add Wish',
      cancel: 'Cancel',
      fields: {
        title: {
          label: 'Title',
          placeholder: 'Enter wish title'
        },
        description: {
          label: 'Description',
          placeholder: 'Describe your wish'
        },
        category: {
          label: 'Category',
          placeholder: 'Select category'
        },
        priority: {
          label: '計畫優先等級',
          placeholder: '選擇優先等級',
          high: '高',
          medium: '中',
          low: '低',
          highDesc: '需要立即關注和行動的重要目標',
          mediumDesc: '需要持續關注但不緊急的目標',
          lowDesc: '可以慢慢進行的次要目標'
        },
        goals: {
          label: '目標設定',
          dailyLabel: '每日目標',
          weeklyLabel: '每週目標',
          placeholder: '輸入目標內容',
          add: '新增目標',
          aiSuggestion: 'AI建議',
          aiSettings: {
            label: 'AI建議設定',
            mode: {
              label: '難度安排',
              easyToHard: '由簡入難',
              average: '平均難度',
              hardToEasy: '由難入簡'
            }
          }
        },
        tags: {
          label: 'Tags',
          placeholder: 'Add tag',
          add: 'Add'
        },
        dueDate: {
          label: 'Due Date'
        },
        visibility: {
          label: 'Visibility',
          public: 'Public',
          private: 'Private',
          publicDesc: 'Other users can see your wish',
          privateDesc: 'Only you can see this wish'
        }
      },
      submit: 'Create Wish',
      submitting: 'Creating...',
      requiredFields: 'Please fill in the required fields'
    },
    // Color Options
    colorOptions: {
      blue: 'Soft Blue',
      green: 'Soft Green',
      purple: 'Soft Purple',
      pink: 'Soft Pink',
      orange: 'Soft Orange',
      gray: 'Gray Tone'
    },
    // Category Options
    categories: {
      learning: 'Learning',
      fitness: 'Fitness',
      travel: 'Travel',
      career: 'Career',
      finance: 'Finance',
      hobby: 'Hobby',
      other: 'Other',
      health: 'Health',
      creative: 'Creative',
      relationship: 'Relationship',
      personalGrowth: 'Personal Growth'
    },
    // Wishlist Names
    wishlistNames: {
      learning: 'Learning Goals',
      fitness: 'Fitness Plan',
      travel: 'Travel Wishes',
      career: 'Career Development'
    }
  },
  'ja-JP': {
    // 下部ナビゲーション
    nav: {
      home: 'ホーム',
      wishlist: 'ウィッシュリスト',
      community: 'コミュニティ',
      notifications: '通知',
      settings: '設定',
      rewards: '報酬'
    },
    // 設定ページ
    settings: {
      title: '設定',
      userProfile: {
        editProfile: 'プロフィール編集',
        joinTime: '登録日'
      },
      appSettings: {
        title: 'アプリ設定',
        save: '保存',
        saving: '保存中...',
        themeColor: 'テーマカラー',
        darkMode: {
          title: 'ダークモード',
          desc: 'アプリの表示テーマを切り替える'
        },
        fontSize: {
          title: 'フォントサイズ',
          desc: 'アプリのテキストサイズを調整する',
          small: '小',
          medium: '中',
          large: '大',
          xlarge: '特大'
        },
        notifications: {
          title: '通知',
          desc: 'アプリの通知を受け取る',
          types: {
            title: '通知タイプ',
            wishUpdates: 'ウィッシュ更新',
            friendActivity: '友達の活動',
            systemUpdates: 'システム更新'
          }
        },
        language: {
          title: '言語',
          desc: 'アプリの表示言語を選択'
        }
      },
      about: {
        title: '情報とサポート',
        privacy: 'プライバシーポリシー',
        terms: '利用規約',
        contact: 'お問い合わせ',
        about: 'WishHubについて',
        version: 'バージョン'
      },
      logout: 'ログアウト',
      saveSuccess: '設定が保存されました'
    },
    // プロフィール編集ページ
    editProfile: {
      title: 'プロフィール編集',
      save: '保存',
      saving: '保存中...',
      back: '戻る',
      avatar: 'アバター',
      uploadCustomAvatar: 'カスタムアバターをアップロード',
      chooseDefaultAvatar: 'デフォルトアバターを選択',
      chooseFile: 'ファイルを選択',
      nickname: 'ニックネーム',
      nicknamePlaceholder: 'ニックネームを入力',
      bio: {
        title: '自己紹介',
        desc: '自分自身についての情報を共有して、他のユーザーにあなたを知ってもらいましょう',
        placeholder: 'あなたの物語、興味、または目標を共有...',
        charCount: '文字'
      },
      interests: {
        title: '興味',
        desc: '興味のあるカテゴリを選択すると、関連コンテンツをおすすめします'
      },
      cancel: 'キャンセル',
      saveChanges: '変更を保存'
    },
    // ホームページ
    home: {
      title: 'ホーム',
      tabs: {
        all: 'すべて',
        inProgress: '進行中',
        completed: '完了',
        notStarted: '未開始'
      },
      popularWishes: '人気の願い',
      todayTasks: '今日のタスク',
      addWish: '願いを追加',
      quickAddWish: 'クイック追加',
      quickAddDesc: 'すぐにインスピレーションを記録',
      addWishDesc: '詳細な願いを作成',
      noWishes: 'まだ願いがありません',
      noTasks: '今日のタスクはありません',
      greeting: {
        morning: 'おはようございます',
        afternoon: 'こんにちは',
        evening: 'こんばんは'
      },
      welcomeMessage: '今日は素晴らしい日です。願いを追求し続けましょう！',
      seeAll: 'すべて見る'
    },
    // 通知ページ
    notifications: {
      title: '通知',
      tabs: {
        all: 'すべて',
        unread: '未読',
        social: 'ソーシャル',
        system: 'システム'
      },
      notificationTypes: {
        like: 'あなたの願いにいいねしました',
        comment: 'あなたの願いにコメントしました',
        follow: 'あなたをフォローしました',
        badge: 'おめでとうございます！「{badge}」バッジを獲得しました！',
        progress: 'あなたの願いの進捗が{progress}%に達しました',
        welcome: 'WishHubへようこそ！最初の願いを作成しましょう。'
      },
      noNotifications: '通知はまだありません',
      markAllAsRead: 'すべて既読にする'
    },
    // コミュニティページ
    community: {
      title: 'コミュニティ',
      search: '検索',
      trending: 'トレンド',
      following: 'フォロー中',
      discover: '発見',
      noContent: 'コンテンツはまだありません'
    },
    // 報酬ページ
    rewards: {
      title: '報酬センター',
      currentLevel: '現在のレベル',
      pointsToNextLevel: '次のレベルまで {points} ポイント必要',
      tabs: {
        collection: 'コレクション',
        shop: 'ショップ',
        competition: '競争',
        history: '履歴'
      },
      badges: {
        title: 'バッジコレクション',
        unlocked: 'ロック解除済み',
        locked: 'ロック中',
        progress: '進捗'
      },
      titles: {
        title: '称号',
        equip: '装備',
        equipped: '装備中',
        explorer: {
          name: 'ウィッシュエクスプローラー',
          description: '最初の願いを作成'
        },
        persistent: {
          name: '継続マスター',
          description: '30日連続でチェックイン'
        },
        socialStar: {
          name: 'コミュニティスター',
          description: '50いいねを獲得'
        },
        achiever: {
          name: 'ウィッシュアチーバー',
          description: '10個の願いを達成'
        },
        planner: {
          name: 'トッププランナー',
          description: '20個の計画を作成し完了'
        }
      },
      points: {
        title: 'ポイント',
        history: 'ポイント履歴',
        earn: '獲得方法',
        spend: '使用方法'
      },
      shop: {
        title: '報酬ショップ',
        virtual: '仮想報酬',
        physical: '実物報酬',
        redeem: '交換',
        redeemed: '交換済み',
        pointsRequired: '必要ポイント'
      },
      competition: {
        title: 'コミュニティ競争',
        active: '進行中',
        upcoming: '近日開始',
        past: '終了',
        join: '参加',
        joined: '参加中',
        leaderboard: 'リーダーボード',
        rank: 'ランク',
        user: 'ユーザー',
        score: 'スコア'
      }
    },
    // 會員レベルページ
    memberLevel: {
      title: '会員レベル情報',
      about: {
        title: '会員レベルについて',
        description: 'WishHubでは、異なる会員レベルを提供しており、各レベルには願いや目標をより効果的に達成するための特典や機能があります。会員レベルをアップグレードすることで、より強力な機能が解放され、願い事の追跡体験がより豊かで個人的なものになります。',
        regular: '一般會員',
        gold: '金牌會員',
        diamond: '鑽石會員'
      },
      levels: {
        regular: {
          name: '一般會員',
          description: '基本會員',
          howToGet: '',
          privileges: [
            '創建最多 5 個願望清單',
            '使用基本願望追蹤功能',
            '參與社區討論',
            '獲取每週進度報告'
          ]
        },
        gold: {
          name: '金牌會員',
          description: '進階會員',
          howToGet: '完成至少 10 個願望，或在設定頁面中升級您的會員等級。',
          privileges: [
            '創建無限願望清單',
            '高級數據分析和視覺化',
            '獲取專屬金牌會員徽章',
            '優先參與新功能測試',
            '每月收到專業建議和指導',
            '無廣告體驗'
          ]
        },
        diamond: {
          name: '鑽石會員',
          description: '尊榮會員',
          howToGet: '完成至少 20 個願望，或在設定頁面中升級您的會員等級。',
          privileges: [
            '包含所有金牌會員特權',
            '獲取專屬鑽石會員徽章',
            '個人化願望達成策略',
            '專屬客服支援',
            '獲取獨家社區活動邀請',
            '每週收到專業教練指導',
            '可使用高級自定義主題'
          ]
        }
      },
      faq: {
        title: 'よくある質問',
        questions: [
          {
            question: '会員レベルをアップグレードするにはどうすればいいですか？',
            answer: '設定ページの「会員レベル」セクションで希望の会員レベルを選択できます。実際のアプリケーションでは、支払いや特定の成果の達成が必要になる場合があります。'
          },
          {
            question: '会員レベルの有効期間はどれくらいですか？',
            answer: 'このデモアプリケーションでは、会員レベルは永久に有効です。実際のアプリケーションでは、プレミアム会員は月額または年額のサブスクリプションが必要になる場合があります。'
          },
          {
            question: '会員レベルをダウングレードできますか？',
            answer: 'はい、設定ページでいつでも会員レベルを変更できます。'
          },
          {
            question: '会員レベルは作成した願い事に影響しますか？',
            answer: '会員レベルをダウングレードすると、特定の機能の使用が制限される場合がありますが、作成した願い事やデータは削除されません。下位レベルの制限（ウィッシュリストの数など）を超えた場合、新しいコンテンツを作成できなくなりますが、既存のコンテンツは保持されます。'
          }
        ]
      },
      goToSettings: '設定に移動して会員レベルを管理する'
    },
    // 願望清單頁
    wishlist: {
      title: '願望清單',
      createNewList: '新しいリストを作成',
      listName: 'リスト名',
      enterListName: 'リスト名を入力',
      create: '作成',
      cancel: 'キャンセル',
      addWish: 'ウィッシュを追加',
      noWishes: 'このリストにはまだウィッシュがありません',
      noWishesDesc: '「ウィッシュを追加」ボタンをクリックして、ウィッシュの作成を開始します',
      priority: '優先度',
      dueDate: '期限',
      progress: '進捗',
      priorityLevels: {
        high: '高',
        medium: '中',
        low: '低',
        none: 'なし'
      },
      stats: {
        total: '合計',
        completed: '完了',
        inProgress: '進行中',
        notStarted: '未開始'
      }
    },
    // コミュニティページ
    communityPage: {
      title: 'コミュニティ',
      search: 'ウィッシュ、タグ、ユーザーを検索...',
      searchButton: '検索',
      tabs: {
        trending: '人気',
        latest: '最新',
        following: 'フォロー中',
        search: '検索結果'
      },
      trendingTags: '人気のタグ',
      recommendedFollow: 'おすすめユーザー',
      follow: 'フォロー',
      noFollowing: 'まだ誰もフォローしていません',
      noFollowingDesc: '他のユーザーをフォローして彼らの願いと進捗を見てみましょう',
      explorePopular: '人気の願いを探索',
      noSearchResults: '結果が見つかりません',
      noSearchResultsDesc: '別のキーワードで検索してみてください',
      createdAt: '作成日',
      challenge: {
        title: 'ユーザーチャレンジ',
        description: '他のユーザーが開始したチャレンジに参加して、一緒に目標を達成しましょう',
        create: 'チャレンジを作成',
        join: '参加する',
        participants: '参加者',
        days: '日間',
        viewAll: 'すべて見る'
      },
      support: {
        title: 'ウィッシュサポーター',
        description: '他の人にアドバイス、リソース、または助けを提供する',
        offer: 'サポートを提供',
        request: 'サポートを求める',
        viewAll: 'すべて見る'
      },
      friendActivity: {
        title: '友達の活動',
        description: '友達の最近の願いの進捗と達成を見る',
        viewMore: 'もっと見る',
        noActivity: 'まだ友達の活動はありません',
        noActivityDesc: 'もっとユーザーをフォローして彼らの活動を見てみましょう',
        achievedProgress: '{progress}%の進捗を達成しました',
        completed: '願いを完了しました',
        started: '新しい願いを始めました',
        achieved: '達成を獲得しました'
      }
    },
    // ウィッシュ追加ページ
    addWish: {
      title: 'ウィッシュを追加',
      cancel: 'キャンセル',
      fields: {
        title: {
          label: 'タイトル',
          placeholder: 'ウィッシュのタイトルを入力'
        },
        description: {
          label: '説明',
          placeholder: 'ウィッシュの説明を入力'
        },
        category: {
          label: 'カテゴリ',
          placeholder: 'カテゴリを選択'
        },
        priority: {
          label: '計畫優先等級',
          placeholder: '選擇優先等級',
          high: '高',
          medium: '中',
          low: '低',
          highDesc: '需要立即關注和行動的重要目標',
          mediumDesc: '需要持續關注但不緊急的目標',
          lowDesc: '可以慢慢進行的次要目標'
        },
        goals: {
          label: '目標設定',
          dailyLabel: '每日目標',
          weeklyLabel: '每週目標',
          placeholder: '輸入目標內容',
          add: '新增目標',
          aiSuggestion: 'AI建議',
          aiSettings: {
            label: 'AI建議設定',
            mode: {
              label: '難度安排',
              easyToHard: '由簡入難',
              average: '平均難度',
              hardToEasy: '由難入簡'
            }
          }
        },
        tags: {
          label: 'タグ',
          placeholder: 'タグを追加',
          add: '追加'
        },
        dueDate: {
          label: '期限'
        },
        visibility: {
          label: '公開設定',
          public: '公開',
          private: '非公開',
          publicDesc: '他のユーザーがあなたのウィッシュを見ることができます',
          privateDesc: 'あなただけがこのウィッシュを見ることができます'
        }
      },
      submit: 'ウィッシュを作成',
      submitting: '作成中...',
      requiredFields: '必須フィールドを入力してください'
    },
    // カラーオプション
    colorOptions: {
      blue: 'ソフトブルー',
      green: 'ソフトグリーン',
      purple: 'ソフトパープル',
      pink: 'ソフトピンク',
      orange: 'ソフトオレンジ',
      gray: 'グレートーン'
    },
    // カテゴリーオプション
    categories: {
      learning: '学習',
      fitness: 'フィットネス',
      travel: '旅行',
      career: 'キャリア',
      finance: '財務',
      hobby: '趣味',
      other: 'その他',
      health: '健康',
      creative: '創造的',
      relationship: '人間関係',
      personalGrowth: '自己成長'
    },
    // ウィッシュリスト名
    wishlistNames: {
      learning: '学習目標',
      fitness: 'フィットネスプラン',
      travel: '旅行の願い',
      career: 'キャリア開発'
    }
  }
};

// 創建語言上下文
const LanguageContext = createContext();

// 語言提供者組件
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('zh-TW');
  const [texts, setTexts] = useState(translations['zh-TW']);

  useEffect(() => {
    // 從 localStorage 獲取語言設定
    const savedLanguage = localStorage.getItem('language') || 'zh-TW';
    setLanguage(savedLanguage);
    setTexts(translations[savedLanguage] || translations['zh-TW']);
  }, []);

  // 更新語言
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setTexts(translations[newLanguage] || translations['zh-TW']);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, texts, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定義 Hook 以便在組件中使用語言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext; 