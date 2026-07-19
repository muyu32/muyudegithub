import { useState, useEffect } from 'react';
import { View, Text, Input, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Log } from '@/types';
import { getLogs, createLog } from '@/services/log';
import LogCard from '@/components/LogCard';
import AddLogModal from '@/components/AddLogModal';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/contexts/AuthContext';
import searchIcon from '@/assets/icons/search.svg';
import emptyLogIcon from '@/assets/icons/empty-log.svg';
import plusIcon from '@/assets/icons/plus.svg';

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function ListPage() {
  const { user } = useAuth();
  const [allLogs, setAllLogs] = useState<Log[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = user?._id;
  const todayStr = formatLocalDate(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (!userId) return;
    fetchLogs();
  }, [userId, filterType]);

  const fetchLogs = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const logs = await getLogs(userId);
      setAllLogs(logs || []);
    } catch (error) {
      console.error('[List] Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = (() => {
    const oneWeekAgo = formatLocalDate(new Date(Date.now() - 7 * 86400000));
    const oneMonthAgo = formatLocalDate(new Date(Date.now() - 30 * 86400000));

    let logs = allLogs;
    switch (filterType) {
      case 'today':
        logs = logs.filter(log => log.date === todayStr);
        break;
      case 'week':
        logs = logs.filter(log => log.date >= oneWeekAgo);
        break;
      case 'month':
        logs = logs.filter(log => log.date >= oneMonthAgo);
        break;
    }

    if (debouncedSearchText) {
      const keyword = debouncedSearchText.toLowerCase();
      logs = logs.filter(
        log => log.title.toLowerCase().includes(keyword) || log.content.toLowerCase().includes(keyword)
      );
    }

    return logs;
  })();

  const handleAddLog = async (data: { title: string; content: string; duration: number; tags: string[] }) => {
    console.log('[List] handleAddLog userId:', userId, 'data:', data);
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
      fetchLogs();
    } catch (error) {
      console.error('[List] Failed to add log:', error);
      Taro.showToast({ title: error instanceof Error ? error.message : '添加失败', icon: 'none' });
    }
  };

  const handleLogClick = (log: Log) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${log._id}`
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filterTabs = [
    { key: 'all', label: '全部' },
    { key: 'today', label: '今天' },
    { key: 'week', label: '本周' },
    { key: 'month', label: '本月' }
  ] as const;

  return (
    <View className={styles.page}>
      <View className={styles.pageContent}>
        <View className={styles.searchBar}>
          <View className={styles.searchInput}>
            <Image className={styles.searchIcon} src={searchIcon} mode="aspectFit" />
            <Input
              placeholder="搜索日志内容"
              value={searchText}
              onInput={e => handleSearch(e.detail.value)}
              className={styles.input}
            />
          </View>
        </View>

        <View className={styles.dateTabs}>
          {filterTabs.map(tab => (
            <Text
              key={tab.key}
              className={`${styles.dateTab} ${filterType === tab.key ? styles.active : ''}`}
              onClick={() => setFilterType(tab.key)}
            >
              {tab.label}
            </Text>
          ))}
        </View>

        <View className={styles.logList}>
          {loading ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyText}>加载中...</Text>
            </View>
          ) : filteredLogs.length === 0 ? (
            <View className={styles.emptyState}>
              <View className={styles.emptyIcon}>
                <Image className={styles.emptyIconImg} src={emptyLogIcon} mode="aspectFit" />
              </View>
              <Text className={styles.emptyText}>暂无日志记录</Text>
              <Button className={styles.recordBtn} onClick={() => setModalVisible(true)}>
                立即记录
              </Button>
            </View>
          ) : (
            filteredLogs.map(log => (
              <LogCard key={log._id} log={log} onClick={() => handleLogClick(log)} />
            ))
          )}
        </View>

        <View className={styles.addButton} onClick={() => setModalVisible(true)}>
          <Image className={styles.addIcon} src={plusIcon} mode="aspectFit" />
        </View>

        <AddLogModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleAddLog}
        />

        <TabBar current={1} onChange={() => {}} />
      </View>
    </View>
  );
}
