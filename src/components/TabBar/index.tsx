import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import homeIcon from '@/assets/tabbar/home.svg';
import homeSelectedIcon from '@/assets/tabbar/home-selected.svg';
import listIcon from '@/assets/tabbar/list.svg';
import listSelectedIcon from '@/assets/tabbar/list-selected.svg';
import calendarIcon from '@/assets/tabbar/calendar.svg';
import calendarSelectedIcon from '@/assets/tabbar/calendar-selected.svg';
import mineIcon from '@/assets/tabbar/mine.svg';
import mineSelectedIcon from '@/assets/tabbar/mine-selected.svg';

interface TabBarProps {
  current: number;
  onChange: (index: number) => void;
}

const tabs = [
  { path: '/pages/home/index', text: '首页', icon: homeIcon, selectedIcon: homeSelectedIcon },
  { path: '/pages/list/index', text: '日志', icon: listIcon, selectedIcon: listSelectedIcon },
  { path: '/pages/calendar/index', text: '日历', icon: calendarIcon, selectedIcon: calendarSelectedIcon },
  { path: '/pages/mine/index', text: '我的', icon: mineIcon, selectedIcon: mineSelectedIcon }
];

export default function TabBar({ current, onChange }: TabBarProps) {
  const handleClick = (index: number) => {
    if (index !== current) {
      onChange(index);
      Taro.reLaunch({
        url: tabs[index].path
      });
    }
  };

  return (
    <View className={styles.tabBar}>
      {tabs.map((tab, index) => (
        <View
          key={index}
          className={`${styles.tabItem} ${current === index ? styles.active : ''}`}
          onClick={() => handleClick(index)}
        >
          <Image
            className={styles.icon}
            src={current === index ? tab.selectedIcon : tab.icon}
            mode="aspectFit"
          />
          <Text className={`${styles.text} ${current === index ? styles.activeText : ''}`}>{tab.text}</Text>
        </View>
      ))}
    </View>
  );
}