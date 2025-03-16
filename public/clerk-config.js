// Clerk 配置
window.clerkConfig = {
  // 設置 Clerk 的回調 URL
  afterSignInUrl: '/wish_hub/home',
  afterSignUpUrl: '/wish_hub/home',
  signInUrl: '/wish_hub/login',
  signUpUrl: '/wish_hub/register',
  // 添加基本 URL 配置
  baseUrl: '/wish_hub',
  // 添加重定向 URL 配置
  redirectUrl: '/wish_hub',
  redirectUrlComplete: '/wish_hub/home'
}; 