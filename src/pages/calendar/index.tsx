import { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Log } from '@/types';
import { getLogs } from '@/services/log';
import { formatDuration } from '@/utils';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/contexts/AuthContext';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import emptyCalendarIcon from '@/assets/icons/empty-calendar.svg';

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logsByDate, setLogsByDate] = useState<Record<string, Log[]>>({});

  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;
    fetchLogs();
  }, [userId, currentDate]);

  const fetchLogs = async () => {
    if (!userId) return;
    try {
      const allLogs = await getLogs(userId);
      const grouped: Record<string, Log[]> = {};
      allLogs.forEach(log => {
        if (!grouped[log.date]) {
          grouped[log.date] = [];
        }
        grouped[log.date].push(log);
      });
      setLogsByDate(grouped);
    } catch (error) {
      console.error('[Calendar] Failed to fetch logs:', error);
    }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: { date: Date; isCurrentMonth: boolean; isToday: boolean; hasLog: boolean }[] = [];

    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        hasLog: false
      });
    }

    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = formatLocalDate(date);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        hasLog: !!logsByDate[dateStr]
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        hasLog: false
      });
    }

    return days;
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (day: { date: Date }) => {
    setSelectedDate(day.date);
  };

  const handleLogClick = (log: Log) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${log._id}` });
  };

  const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
  const days = getCalendarDays();

  const selectedDateStr = formatLocalDate(selectedDate);
  const selectedLogs = logsByDate[selectedDateStr] || [];

  return (
    <View className={styles.page}>
      <View className={styles.pageContent}>
        <View className={styles.header}>
          <View className={styles.headerBtn} onClick={() => changeMonth('prev')}>
            <Image className={styles.headerIcon} src={chevronLeftIcon} mode="aspectFit" />
          </View>
          <Text className={styles.headerTitle}>
            {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
          </Text>
          <View className={styles.headerBtn} onClick={() => changeMonth('next')}>
            <Image className={styles.headerIcon} src={chevronRightIcon} mode="aspectFit" />
          </View>
        </View>

        <View className={styles.weekdayRow}>
          {weekdayNames.map(day => (
            <Text key={day} className={styles.weekday}>{day}</Text>
          ))}
        </View>

        <View className={styles.calendarGrid}>
          {days.map((day, index) => {
            const isSelected = day.date.toDateString() === selectedDate.toDateString();
            return (
              <View
                key={index}
                className={`${styles.dayCell} ${!day.isCurrentMonth ? styles.otherMonth : ''} ${day.isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <Text className={styles.dayNum}>{day.date.getDate()}</Text>
                {day.hasLog && <View className={styles.hasLog} />}
              </View>
            );
          })}
        </View>

        <View className={styles.selectedDate}>
          <Text className={styles.selectedDateTitle}>
            {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
          </Text>
          <View className={styles.selectedDateLogs}>
            {selectedLogs.length === 0 ? (
              <View className={styles.emptyState}>
                <View className={styles.emptyIcon}>
                  <Image className={styles.emptyIconImg} src={emptyCalendarIcon} mode="aspectFit" />
                </View>
                <Text className={styles.emptyText}>当天没有日志记录</Text>
              </View>
            ) : (
              selectedLogs.map(log => (
                <View
                  key={log._id}
                  className={styles.logItem}
                  onClick={() => handleLogClick(log)}
                >
                  <View className={styles.logDot} />
                  <Text className={styles.logTitle}>{log.title}</Text>
                  <Text className={styles.logDuration}>{formatDuration(log.duration)}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <TabBar current={2} onChange={() => {}} />
      </View>
    </View>
  );
}
