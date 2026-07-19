import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Log, StatData } from '@/types';
import { getLogs, getStats, createLog } from '@/services/log';
import { formatDuration, getWeekDays } from '@/utils';
import LogCard from '@/components/LogCard';
import Tag from '@/components/Tag';
import AddLogModal from '@/components/AddLogModal';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/contexts/AuthContext';
import { commonTags } from '@/data/log';
import loginIcon from '@/assets/icons/login.svg';
import emptyLogIcon from '@/assets/icons/empty-log.svg';
import plusIcon from '@/assets/icons/plus.svg';

export default function HomePage() {
  const { isLoggedIn, userInfo, checkLogin } = useAuth();
  const [stats, setStats] = useState<StatData | null>(null);
  const [todayLogs, setTodayLogs] = useState<Log[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && userInfo) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, userInfo]);

  const fetchData = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const [logs, statData] = await Promise.all([
        getLogs(userInfo._id, new Date().toISOString().split('T')[0]),
        getStats(userInfo._id)
      ]);
      console.log('[Home] fetchData logs:', logs, 'stats:', statData);
      setTodayLogs(logs || []);
      setStats(statData || {
        totalLogs: 0,
        totalDuration: 0,
        todayLogs: 0,
        todayDuration: 0,
        tagStats: []
      });
    } catch (error) {
      console.error('[Home] Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (data: { title: string; content: string; duration: number; tags: string[] }) => {
    if (!checkLogin() || !userInfo) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await createLog(userInfo._id, {
        ...data,
        date: today
      });
      setModalVisible(false);
      Taro.showToast({ title: '日志添加成功', icon: 'success' });
      fetchData();
    } catch (error) {
      console.error('[Home] Failed to add log:', error);
      Taro.showToast({ title: '添加失败', icon: 'none' });
    }
  };

  const handleLogClick = (log: Log) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${log._id}`
    });
  };

  const weekDays = getWeekDays();

  const handleGoLogin = () => {
    Taro.redirectTo({ url: '/pages/mine/index' });
  };

  if (!isLoggedIn) {
    return (
      <View className={styles.page}>
        <View className={styles.pageContent}>
          <View className={styles.header}>
            <Text className={styles.greeting}>工作日志</Text>
            <Text className={styles.date}>请登录后使用</Text>
          </View>
          <View className={styles.loginPrompt}>
            <View className={styles.loginIcon}>
              <Image className={styles.loginIconImg} src={loginIcon} mode="aspectFit" />
            </View>
            <Text className={styles.loginTitle}>登录后查看工作日志</Text>
            <Text className={styles.loginDesc}>记录每日工作内容，追踪工作进度，提升工作效率</Text>
            <Button className={styles.loginBtn} onClick={handleGoLogin}>
              立即登录
            </Button>
          </View>
          <TabBar current={0} onChange={() => {}} />
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.pageContent}>
      <View className={styles.header}>
        <Text className={styles.greeting}>你好，今天也要加油哦！</Text>
        <Text className={styles.date}>
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats?.todayLogs || 0}</Text>
          <Text className={styles.statLabel}>今日日志</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats?.todayDuration || 0}</Text>
          <Text className={styles.statLabel}>今日时长(分钟)</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats?.totalLogs || 0}</Text>
          <Text className={styles.statLabel}>总日志数</Text>
        </View>
      </View>

      <View className={styles.tagSection}>
        <Text className={styles.sectionTitle}>本周概览</Text>
        <View className={styles.weekList}>
          {weekDays.map(day => (
            <View
              key={day.date}
              className={`${styles.dayItem} ${day.isToday ? styles.today : ''}`}
            >
              <Text className={styles.dayLabel}>{day.day}</Text>
              <Text className={styles.dayDate}>{day.date.slice(8)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.todayLogs}>
        <View className={styles.sectionTitle}>
          <Text>今日工作</Text>
          <Text className={styles.sectionMore} onClick={() => Taro.redirectTo({ url: '/pages/list/index' })}>
            查看全部
          </Text>
        </View>
        {loading ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>加载中...</Text>
          </View>
        ) : todayLogs.length === 0 ? (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>
              <Image className={styles.emptyIconImg} src={emptyLogIcon} mode="aspectFit" />
            </View>
            <Text className={styles.emptyText}>今天还没有记录工作内容</Text>
            <Button className={styles.addBtn} onClick={() => setModalVisible(true)}>
              立即记录
            </Button>
          </View>
        ) : (
          todayLogs.map(log => (
            <LogCard key={log._id} log={log} onClick={() => handleLogClick(log)} />
          ))
        )}
      </View>

      <View className={styles.tagSection}>
        <Text className={styles.sectionTitle}>常用标签</Text>
        <View className={styles.tagList}>
          {commonTags.slice(0, 6).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </View>
      </View>

      <View className={styles.addButton} onClick={() => setModalVisible(true)}>
        <Image className={styles.addIcon} src={plusIcon} mode="aspectFit" />
      </View>

      <AddLogModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddLog}
      />

      <TabBar current={0} onChange={() => {}} />
      </View>
    </View>
  );
}