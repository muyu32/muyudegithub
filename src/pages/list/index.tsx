import React, { useState, useEffect } from 'react';
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

export default function ListPage() {
  const { isLoggedIn, userInfo, checkLogin } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && userInfo) {
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, [filterType, isLoggedIn, userInfo]);

  const fetchLogs = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const allLogs = await getLogs(userInfo._id);
      let filteredLogs = allLogs;
      
      const today = new Date().toISOString().split('T')[0];
      const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      const oneMonthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

      switch (filterType) {
        case 'today':
          filteredLogs = allLogs.filter(log => log.date === today);
          break;
        case 'week':
          filteredLogs = allLogs.filter(log => log.date >= oneWeekAgo);
          break;
        case 'month':
          filteredLogs = allLogs.filter(log => log.date >= oneMonthAgo);
          break;
      }

      if (searchText) {
        filteredLogs = filteredLogs.filter(
          log => log.title.includes(searchText) || log.content.includes(searchText)
        );
      }

      setLogs(filteredLogs);
    } catch (error) {
      console.error('[List] Failed to fetch logs:', error);
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
      fetchLogs();
    } catch (error) {
      console.error('[List] Failed to add log:', error);
      Taro.showToast({ title: '添加失败', icon: 'none' });
    }
  };

  const handleLogClick = (log: Log) => {
    if (!checkLogin()) return;
    Taro.navigateTo({
      url: `/pages/detail/index?id=${log._id}`
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (isLoggedIn) {
      fetchLogs();
    }
  };

  const handleAddClick = () => {
    if (!checkLogin()) return;
    setModalVisible(true);
  };

  const handleGoLogin = () => {
    Taro.redirectTo({ url: '/pages/mine/index' });
  };

  const filterTabs = [
    { key: 'all', label: '全部' },
    { key: 'today', label: '今天' },
    { key: 'week', label: '本周' },
    { key: 'month', label: '本月' }
  ] as const;

  if (!isLoggedIn) {
    return (
      <View className={styles.page}>
        <View className={styles.pageContent}>
          <View className={styles.searchBar}>
            <View className={styles.searchInput}>
              <Image className={styles.searchIcon} src={searchIcon} mode="aspectFit" />
              <Input
                placeholder="搜索日志内容"
                disabled
                className={styles.input}
              />
            </View>
          </View>

          <View className={styles.dateTabs}>
            {filterTabs.map(tab => (
              <Text
                key={tab.key}
                className={`${styles.dateTab} ${filterType === tab.key ? styles.active : ''}`}
              >
                {tab.label}
              </Text>
            ))}
          </View>

          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>
              <Image className={styles.emptyIconImg} src={emptyLogIcon} mode="aspectFit" />
            </View>
            <Text className={styles.emptyText}>请登录后查看日志记录</Text>
            <Button className={styles.loginBtn} onClick={handleGoLogin}>
              立即登录
            </Button>
          </View>

          <TabBar current={1} onChange={() => {}} />
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.pageContent}>
      <View className={styles.searchBar}>
        <View className={styles.searchInput}>
          <Image className={styles.searchIcon} src={searchIcon} mode="aspectFit" />
          <Input
            placeholder="搜索日志内容"
            value={searchText}
            onChange={e => handleSearch(e.detail.value)}
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
        ) : logs.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无日志记录</Text>
          </View>
        ) : (
          logs.map(log => (
            <LogCard key={log._id} log={log} onClick={() => handleLogClick(log)} />
          ))
        )}
      </View>

      <View className={styles.addButton} onClick={handleAddClick}>
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