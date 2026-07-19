import { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
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
  const { user } = useAuth();
  const [stats, setStats] = useState<StatData | null>(null);

  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    if (!userId) return;
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

  const menuItems = [
    { icon: settingsIcon, text: '设置' },
    { icon: helpIcon, text: '帮助与反馈' },
    { icon: privacyIcon, text: '隐私设置' },
    { icon: aboutIcon, text: '关于我们' }
  ];

  const handleMenuClick = (text: string) => {
    Taro.showToast({ title: `${text}功能开发中`, icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.pageContent}>
        <View className={styles.header}>
          <View className={styles.userInfo}>
            <View className={styles.avatar}>
              <Image className={styles.avatarIcon} src={userIcon} mode="aspectFit" />
            </View>
            <View>
              <Text className={styles.userName}>{user?.nickname || '未登录'}</Text>
              <Text className={styles.userDesc}>欢迎使用工作日志</Text>
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

        <View className={styles.aboutSection}>
          <Text className={styles.aboutText}>工作日志小程序</Text>
          <Text className={styles.aboutVersion}>版本 1.0.0</Text>
        </View>

        <TabBar current={3} onChange={() => {}} />
      </View>
    </View>
  );
}
