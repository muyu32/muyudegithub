import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import type { Log } from '@/types';
import { formatDuration, formatDate } from '@/utils';
import Tag from '@/components/Tag';

interface LogCardProps {
  log: Log;
  onClick: () => void;
}

export default function LogCard({ log, onClick }: LogCardProps) {
  return (
    <View className={styles.logCard} onClick={onClick}>
      <View className={styles.header}>
        <Text className={styles.date}>{formatDate(log.date)}</Text>
        <Text className={styles.duration}>{formatDuration(log.duration)}</Text>
      </View>
      <Text className={styles.title}>{log.title}</Text>
      <Text className={styles.content}>{log.content}</Text>
      {log.tags.length > 0 && (
        <View className={styles.tags}>
          {log.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </View>
      )}
    </View>
  );
}