import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { loginByWechat, registerByAccount, loginByAccount } from '@/services/auth';
import type { DBUser } from '@/services/db';

interface UserInfo {
  _id: string;
  openid?: string;
  username?: string;
  nickname: string;
  avatarUrl: string;
  loginType: 'wechat' | 'account';
}

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  loginByWechat: () => Promise<{ success: boolean; message?: string }>;
  loginByAccount: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerByAccount: (username: string, password: string, nickname: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkLogin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'work_log_user_info';

function toUserInfo(dbUser: DBUser): UserInfo {
  return {
    _id: dbUser._id,
    openid: dbUser.openid,
    username: dbUser.username,
    nickname: dbUser.nickname,
    avatarUrl: dbUser.avatarUrl,
    loginType: dbUser.loginType
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const stored = Taro.getStorageSync(STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserInfo(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('[Auth] Failed to parse stored user info:', e);
      }
    }
  }, []);

  const handleLoginSuccess = (user: DBUser) => {
    console.log('[AuthContext] login success user:', user);
    const userInfoData = toUserInfo(user);
    setUserInfo(userInfoData);
    setIsLoggedIn(true);
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(userInfoData));
  };

  const wechatLogin = async (): Promise<{ success: boolean; message?: string }> => {
    const result = await loginByWechat();
    if (result.success && result.user) {
      handleLoginSuccess(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const accountLogin = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const result = await loginByAccount(username, password);
    if (result.success && result.user) {
      handleLoginSuccess(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const accountRegister = async (username: string, password: string, nickname: string): Promise<{ success: boolean; message?: string }> => {
    const result = await registerByAccount(username, password, nickname);
    if (result.success && result.user) {
      handleLoginSuccess(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const logout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    Taro.removeStorageSync(STORAGE_KEY);
  };

  const checkLogin = (): boolean => {
    if (!isLoggedIn) {
      Taro.showModal({
        title: '提示',
        content: '请先登录后使用',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            Taro.redirectTo({ url: '/pages/mine/index' });
          }
        }
      });
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userInfo,
      loginByWechat: wechatLogin,
      loginByAccount: accountLogin,
      registerByAccount: accountRegister,
      logout,
      checkLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
