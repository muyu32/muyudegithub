import { useState, useEffect } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Log, StatData } from '@/types';
import { getLogs, getStats, createLog } from '@/services/log';
import { getWeekDays } from '@/utils';
import LogCard from '@/components/LogCard';
import Tag from '@/components/Tag';
import AddLogModal from '@/components/AddLogModal';
import TabBar from '@/components/TabBar';
import { commonTags } from '@/data/log';
import { useAuth } from '@/contexts/AuthContext';
import emptyLogIcon from '@/assets/icons/empty-log.svg';
import plusIcon from '@/assets/icons/plus.svg';

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatData | null>(null);
  const [todayLogs, setTodayLogs] = useState<Log[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = user?._id;
  const todayStr = formatLocalDate(new Date());

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [logs, statData] = await Promise.all([
        getLogs(userId, todayStr),
        getStats(userId)
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
    if (!userId) {
      Taro.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    try {
      await createLog(userId, {
        ...data,
        date: todayStr
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
