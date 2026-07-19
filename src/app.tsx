import { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { getCurrentUser } from '@/services/auth';
import './app.scss';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: 'cloud1-6g9m5yjwef07da8c',
        traceUser: true
      });
    }

    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const user = await getCurrentUser();
      const target = user ? '/pages/home/index' : '/pages/login/index';
      Taro.reLaunch({ url: target });
    } catch (error) {
      console.error('[App] Failed to check login status:', error);
      Taro.reLaunch({ url: '/pages/login/index' });
    }
  };

  useDidShow(() => {});

  useDidHide(() => {});

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default App;
