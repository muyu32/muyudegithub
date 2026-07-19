import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, unit, icon }: StatCardProps) {
  return (
    <View className={styles.statCard}>
      {icon && <View className={styles.icon}>{icon}</View>}
      <View className={styles.content}>
        <Text className={styles.value}>{value}</Text>
        {unit && <Text className={styles.unit}>{unit}</Text>}
        <Text className={styles.title}>{title}</Text>
      </View>
    </View>
  );
}