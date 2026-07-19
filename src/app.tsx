import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { AuthProvider } from './contexts/AuthContext';
import './app.scss';

function App(props) {
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

  return <AuthProvider>{props.children}</AuthProvider>;
}

export default App;
