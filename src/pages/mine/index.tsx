import React, { useState, useEffect } from 'react';
import { View, Text, Button, Input, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { StatData } from '@/types';
import { getStats } from '@/services/log';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/contexts/AuthContext';
import userIcon from '@/assets/icons/user.svg';
import settingsIcon from '@/assets/icons/settings.svg';
import helpIcon from '@/assets/icons/help.svg';
import privacyIcon from '@/assets/icons/privacy.svg';
import aboutIcon from '@/assets/icons/about.svg';
import arrowRightIcon from '@/assets/icons/arrow-right.svg';

export default function MinePage() {
  const { isLoggedIn, userInfo, loginByWechat, loginByAccount, registerByAccount, logout } = useAuth();
  const [stats, setStats] = useState<StatData | null>(null);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userInfo) {
      fetchStats(userInfo._id);
    }
  }, [isLoggedIn, userInfo]);

  const fetchStats = async (userId: string) => {
    try {
      const statData = await getStats(userId);
      console.log('[Mine] fetchStats:', statData);
      setStats(statData || {
        totalLogs: 0,
        totalDuration: 0,
        todayLogs: 0,
        todayDuration: 0,
        tagStats: []
      });
    } catch (error) {
      console.error('[Mine] Failed to fetch stats:', error);
    }
  };

  const handleWechatLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await loginByWechat();
      if (result.success) {
        Taro.showToast({ title: '登录成功', icon: 'success' });
      } else {
        Taro.showToast({ title: result.message || '登录失败', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '登录失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountLogin = async () => {
    if (!username) {
      Taro.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    if (!password) {
      Taro.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const result = await loginByAccount(username, password);
      if (result.success) {
        Taro.showToast({ title: '登录成功', icon: 'success' });
        setUsername('');
        setPassword('');
      } else {
        Taro.showToast({ title: result.message || '登录失败', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '登录失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountRegister = async () => {
    if (!username) {
      Taro.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    if (!password) {
      Taro.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (!nickname) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const result = await registerByAccount(username, password, nickname);
      if (result.success) {
        Taro.showToast({ title: '注册成功', icon: 'success' });
        setUsername('');
        setPassword('');
        setNickname('');
      } else {
        Taro.showToast({ title: result.message || '注册失败', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '注册失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout();
          Taro.showToast({ title: '已退出登录', icon: 'none' });
        }
      }
    });
  };

  const menuItems = [
    { icon: settingsIcon, text: '设置' },
    { icon: helpIcon, text: '帮助与反馈' },
    { icon: privacyIcon, text: '隐私设置' },
    { icon: aboutIcon, text: '关于我们' }
  ];

  const handleMenuClick = (text: string) => {
    Taro.showToast({ title: `${text}功能开发中`, icon: 'none' });
  };

  if (!isLoggedIn) {
    return (
      <View className={styles.page}>
        <View className={styles.pageContent}>
          <View className={styles.loginHeader}>
            <View className={styles.loginLogo}>
              <Image className={styles.loginLogoImg} src={userIcon} mode="aspectFit" />
            </View>
            <Text className={styles.loginTitle}>工作日志</Text>
            <Text className={styles.loginSubtitle}>记录每一天的工作与成长</Text>
          </View>

          <View className={styles.loginCard}>
            <View className={styles.loginTabs}>
              <Text
                className={`${styles.loginTab} ${loginMode === 'login' ? styles.active : ''}`}
                onClick={() => setLoginMode('login')}
              >
                登录
              </Text>
              <Text
                className={`${styles.loginTab} ${loginMode === 'register' ? styles.active : ''}`}
                onClick={() => setLoginMode('register')}
              >
                注册
              </Text>
            </View>

            <View className={styles.loginForm}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>用户名</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入用户名"
                  value={username}
                  onInput={e => setUsername(e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>密码</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入密码"
                  password
                  value={password}
                  onInput={e => setPassword(e.detail.value)}
                />
              </View>

              {loginMode === 'register' && (
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>昵称</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="请输入昵称"
                    value={nickname}
                    onInput={e => setNickname(e.detail.value)}
                  />
                </View>
              )}

              <Button
                className={styles.primaryBtn}
                loading={loading}
                onClick={loginMode === 'login' ? handleAccountLogin : handleAccountRegister}
              >
                {loginMode === 'login' ? '登录' : '注册'}
              </Button>

              <View className={styles.divider}>
                <View className={styles.dividerLine} />
                <Text className={styles.dividerText}>或</Text>
                <View className={styles.dividerLine} />
              </View>

              <Button className={styles.wechatBtn} onClick={handleWechatLogin} loading={loading}>
                微信一键登录
              </Button>
            </View>
          </View>

          <View className={styles.guestMenuList}>
            {menuItems.map((item, index) => (
              <View key={index} className={styles.menuItem} onClick={() => handleMenuClick(item.text)}>
                <Image className={styles.menuIcon} src={item.icon} mode="aspectFit" />
                <Text className={styles.menuText}>{item.text}</Text>
                <Image className={styles.menuArrow} src={arrowRightIcon} mode="aspectFit" />
              </View>
            ))}
          </View>

          <View className={styles.aboutSection}>
            <Text className={styles.aboutText}>工作日志小程序</Text>
            <Text className={styles.aboutVersion}>版本 1.0.0</Text>
          </View>

          <TabBar current={3} onChange={() => {}} />
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.pageContent}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Image className={styles.avatarIcon} src={userIcon} mode="aspectFit" />
          </View>
          <View>
            <Text className={styles.userName}>{userInfo?.nickname || '用户'}</Text>
            <Text className={styles.userDesc}>
              {userInfo?.loginType === 'wechat' ? '微信登录' : `账号: ${userInfo?.username || ''}`}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats?.totalLogs || 0}</Text>
          <Text className={styles.statLabel}>总日志</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>
            {Math.floor((stats?.totalDuration || 0) / 60)}
          </Text>
          <Text className={styles.statLabel}>总时长(小时)</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats?.todayLogs || 0}</Text>
          <Text className={styles.statLabel}>今日日志</Text>
        </View>
      </View>

      <View className={styles.menuList}>
        {menuItems.map((item, index) => (
          <View key={index} className={styles.menuItem} onClick={() => handleMenuClick(item.text)}>
            <Image className={styles.menuIcon} src={item.icon} mode="aspectFit" />
            <Text className={styles.menuText}>{item.text}</Text>
            <Image className={styles.menuArrow} src={arrowRightIcon} mode="aspectFit" />
          </View>
        ))}
      </View>

      <View className={styles.logoutSection}>
        <Button className={styles.logoutBtn} onClick={handleLogout}>
          退出登录
        </Button>
      </View>

      <View className={styles.aboutSection}>
        <Text className={styles.aboutText}>工作日志小程序</Text>
        <Text className={styles.aboutVersion}>版本 1.0.0</Text>
      </View>

      <TabBar current={3} onChange={() => {}} />
      </View>
    </View>
  );
}
