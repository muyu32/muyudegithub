import { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
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
  }, []);

  useDidShow(() => {});

  useDidHide(() => {});

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default App;
