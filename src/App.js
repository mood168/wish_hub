import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { DatabaseProvider } from './context/DatabaseContext';
<<<<<<< HEAD
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
=======
import { ThemeProvider } from './context/ThemeContext';
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
import BottomNav from './components/BottomNav';
import FloatingButton from './components/FloatingButton';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Community from './pages/Community';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import WishDetail from './pages/WishDetail';
import AddWish from './pages/AddWish';
import Plan from './pages/Plan';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import EditProfile from './pages/EditProfile';
import Rewards from './pages/Rewards';
import MemberLevelInfo from './pages/MemberLevelInfo';
import CreateChallenge from './pages/CreateChallenge';
import CreateSupport from './pages/CreateSupport';

// 保護路由組件
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 主要應用內容組件
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const isNewUser = localStorage.getItem('isNewUser') === 'true';

  return (
    <div className="iphone-simulator">
      <div className="app-container">
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={
              isAuthenticated ? <Onboarding /> : <Navigate to="/login" />
            } />
            
            {/* 受保護的路由 */}
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/wishlist" element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            } />
            <Route path="/community" element={
              <PrivateRoute>
                <Community />
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            } />
            <Route path="/rewards" element={
              <PrivateRoute>
                <Rewards />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/wish-detail/:wishId" element={
              <PrivateRoute>
                <WishDetail />
              </PrivateRoute>
            } />
            <Route path="/add-wish" element={
              <PrivateRoute>
                <AddWish />
              </PrivateRoute>
            } />
            <Route path="/plan/:wishId" element={
              <PrivateRoute>
                <Plan />
              </PrivateRoute>
            } />
            <Route path="/edit-profile" element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            } />
            <Route path="/member-level-info" element={
              <PrivateRoute>
                <MemberLevelInfo />
              </PrivateRoute>
            } />
            <Route path="/create-challenge" element={<CreateChallenge />} />
            <Route path="/create-support" element={<CreateSupport />} />
            
            {/* 未匹配的路由重定向到登入頁面 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        
        {/* 使用 isAuthenticated 來控制底部導航和浮動按鈕的顯示 */}
        {isAuthenticated && !isNewUser && (
          <>
            <BottomNav />
            <FloatingButton />
          </>
        )}
      </div>
    </div>
  );
};

<<<<<<< HEAD
function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <AppContent />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </DatabaseProvider>
=======
// Clerk 公鑰
const clerkPubKey = 'pk_test_d2VsY29tZS1iZWFnbGUtMjUuY2xlcmsuYWNjb3VudHMuZGV2JA';

// 浮動按鈕包裝組件，根據當前路徑決定是否顯示
function FloatingButtonWrapper() {
  const location = useLocation();
  
  // 不需要顯示浮動按鈕的頁面路徑列表
  const hideButtonPaths = ['/settings', '/add-wish', '/login', '/register', '/'];
  
  // 檢查當前路徑是否在隱藏列表中
  const shouldShow = !hideButtonPaths.includes(location.pathname) && 
                     !location.pathname.startsWith('/plan/');
  
  return shouldShow ? <FloatingButton /> : null;
}

// 受保護的路由組件
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}

// 主應用佈局組件
function AppLayout() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  return (
    <div className="app-container">
      <div className="content-container">
        <Routes>
          {/* 歡迎頁面作為默認路由 */}
          <Route path="/" element={<Welcome />} />
          
          {/* 登入和註冊頁面 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 受保護的路由 */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/wish-detail/:wishId" element={
            <ProtectedRoute>
              <WishDetail />
            </ProtectedRoute>
          } />
          <Route path="/add-wish" element={
            <ProtectedRoute>
              <AddWish />
            </ProtectedRoute>
          } />
          <Route path="/plan/:wishId" element={
            <ProtectedRoute>
              <Plan />
            </ProtectedRoute>
          } />
          
          {/* 未匹配的路由重定向到歡迎頁面 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      
      {/* 只在登入後顯示底部導航和浮動按鈕 */}
      {isLoggedIn && (
        <>
          <BottomNav />
          <FloatingButtonWrapper />
        </>
      )}
    </div>
  );
}

function App() {
  // 獲取 Clerk 配置
  const clerkConfig = window.clerkConfig || {
    afterSignInUrl: '/home',
    afterSignUpUrl: '/home',
    signInUrl: '/login',
    signUpUrl: '/register'
  };
  
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      navigate={(to) => window.location.href = `${window.location.origin}/wish_hub${to}`}
      routing="path"
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
    >
      <DatabaseProvider>
        <ThemeProvider>
          <Router basename="/wish_hub">
            <AppLayout />
          </Router>
        </ThemeProvider>
      </DatabaseProvider>
    </ClerkProvider>
>>>>>>> ee3b1abbeb0576ed117d76794f70f7cf5168bc3a
  );
}

export default App; 