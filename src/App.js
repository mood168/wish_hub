import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ServicesProvider } from './contexts/ServicesContext';
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
  const location = useLocation();

  // 檢查當前路由是否需要顯示導航欄
  const shouldShowNav = !['/login', '/register', '/onboarding', '/'].includes(location.pathname);

  return (
    <div className="iphone-simulator">
      <div className="app-container">
        <div className="content-container" style={{
          minHeight: '100vh'
        }}>
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
        {shouldShowNav && isAuthenticated && <BottomNav />}
        {shouldShowNav && isAuthenticated && <FloatingButton />}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <DatabaseProvider>
        <AuthProvider>
          <LanguageProvider>
            <NotificationProvider>
              <ServicesProvider>
                <AppContent />
              </ServicesProvider>
            </NotificationProvider>
          </LanguageProvider>
        </AuthProvider>
      </DatabaseProvider>
    </Router>
  );
}

export default App; 