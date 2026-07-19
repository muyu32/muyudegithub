import { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAuth } from '@/contexts/AuthContext';

type LoginMode = 'account' | 'wechat';

export default function LoginPage() {
  const { loginByWechat, loginByAccount, registerByAccount } = useAuth();
  const [mode, setMode] = useState<LoginMode>('wechat');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWechatLogin = async () => {
    setLoading(true);
    try {
      await loginByWechat();
      Taro.showToast({ title: '登录成功', icon: 'success' });
      Taro.reLaunch({ url: '/pages/home/index' });
    } catch (error) {
      console.error('[Login] Wechat login failed:', error);
      Taro.showToast({ title: error instanceof Error ? error.message : '登录失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Taro.showToast({ title: '请输入用户名和密码', icon: 'none' });
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await registerByAccount(username.trim(), password.trim());
        Taro.showToast({ title: '注册成功', icon: 'success' });
      } else {
        await loginByAccount(username.trim(), password.trim());
        Taro.showToast({ title: '登录成功', icon: 'success' });
      }
      Taro.reLaunch({ url: '/pages/home/index' });
    } catch (error) {
      console.error('[Login] Account login failed:', error);
      Taro.showToast({ title: error instanceof Error ? error.message : '操作失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>工作日志</Text>
        <Text className={styles.subtitle}>记录每一天的工作点滴</Text>
      </View>

      <View className={styles.card}>
        <View className={styles.tabs}>
          <Text
            className={`${styles.tab} ${mode === 'wechat' ? styles.active : ''}`}
            onClick={() => setMode('wechat')}
          >
            微信登录
          </Text>
          <Text
            className={`${styles.tab} ${mode === 'account' ? styles.active : ''}`}
            onClick={() => setMode('account')}
          >
            账号登录
          </Text>
        </View>

        {mode === 'wechat' ? (
          <View className={styles.wechatSection}>
            <View className={styles.wechatIcon}>
              <Text className={styles.wechatIconText}>微信</Text>
            </View>
            <Text className={styles.wechatDesc}>一键授权，快速开始</Text>
            <Button
              className={styles.wechatBtn}
              onClick={handleWechatLogin}
              loading={loading}
            >
              微信授权登录
            </Button>
          </View>
        ) : (
          <View className={styles.form}>
            <View className={styles.formItem}>
              <Text className={styles.label}>用户名</Text>
              <Input
                className={styles.input}
                placeholder="请输入用户名"
                value={username}
                onInput={e => setUsername(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.label}>密码</Text>
              <Input
                className={styles.input}
                placeholder="请输入密码"
                value={password}
                password
                onInput={e => setPassword(e.detail.value)}
              />
            </View>
            <Button
              className={styles.submitBtn}
              onClick={handleAccountSubmit}
              loading={loading}
            >
              {isRegister ? '注册' : '登录'}
            </Button>
            <View className={styles.toggleRow}>
              <Text className={styles.toggleText} onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
