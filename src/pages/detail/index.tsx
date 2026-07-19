import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Log } from '@/types';
import { getLogById, deleteLog } from '@/services/log';
import { formatDuration, formatDate } from '@/utils';
import Tag from '@/components/Tag';
import { useAuth } from '@/contexts/AuthContext';

export default function DetailPage() {
  const { userInfo } = useAuth();
  const [log, setLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as unknown as { options: { id: string } }).options;
    if (options?.id && userInfo) {
      fetchLog(options.id);
    }
  }, [userInfo]);

  const fetchLog = async (id: string) => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const logData = await getLogById(userInfo._id, id);
      if (logData) {
        setLog(logData);
      } else {
        Taro.showToast({ title: '日志不存在', icon: 'none' });
        setTimeout(() => Taro.navigateBack(), 1500);
      }
    } catch (error) {
      console.error('[Detail] Failed to fetch log:', error);
      Taro.showToast({ title: '获取日志失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' });
  };

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条日志吗？',
      confirmColor: '#F53F3F',
      success: async (res) => {
        if (res.confirm && log && userInfo) {
          try {
            const result = await deleteLog(userInfo._id, log._id);
            if (result) {
              Taro.showToast({ title: '删除成功', icon: 'success' });
              setTimeout(() => Taro.navigateBack(), 1500);
            } else {
              Taro.showToast({ title: '删除失败', icon: 'none' });
            }
          } catch (error) {
            console.error('[Detail] Failed to delete log:', error);
            Taro.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <View className={styles.page}>
        <View className={styles.pageContent}>
          <View className={styles.card}>
            <Text className={styles.title}>加载中...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!log) {
    return null;
  }

  return (
    <View className={styles.page}>
      <View className={styles.pageContent}>
        <View className={styles.card}>
          <Text className={styles.title}>{log.title}</Text>
          <View className={styles.meta}>
            <Text className={styles.date}>{formatDate(log.date)}</Text>
            <Text className={styles.duration}>{formatDuration(log.duration)}</Text>
          </View>
          {log.tags.length > 0 && (
            <View className={styles.tags}>
              {log.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </View>
          )}
          <Text className={styles.content}>{log.content || '暂无详细内容'}</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={`${styles.btn} ${styles.editBtn}`} onClick={handleEdit}>
          编辑
        </Button>
        <Button className={`${styles.btn} ${styles.deleteBtn}`} onClick={handleDelete}>
          删除
        </Button>
      </View>
    </View>
  );
}
