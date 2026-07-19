import React from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function Tag({ children, active = false, onClick }: TagProps) {
  return (
    <View className={`${styles.tag} ${active ? styles.active : ''}`} onClick={onClick}>
      {children}
    </View>
  );
}