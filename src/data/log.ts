import type { Log, StatData } from '@/types';
import { generateId } from '@/utils';

const today = formatLocalDate(new Date());
const yesterday = formatLocalDate(new Date(Date.now() - 86400000));

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const mockLogs: Log[] = [
  {
    _id: '1',
    userId: 'user1',
    title: '完成项目需求文档',
    content: '完成了Q3产品需求文档的编写，包括功能需求、非功能需求和验收标准。与产品团队进行了评审，修改了部分需求优先级。',
    date: today,
    duration: 180,
    tags: ['文档', '需求'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    userId: 'user1',
    title: '代码审查',
    content: '审查了3个PR，提出了12条改进建议。主要涉及代码规范、性能优化和安全性方面。',
    date: today,
    duration: 90,
    tags: ['审查', '代码'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    userId: 'user1',
    title: '团队周会',
    content: '参加周会，汇报本周工作进展，讨论下周计划。团队决定加快项目进度，提前一周交付。',
    date: yesterday,
    duration: 60,
    tags: ['会议', '团队'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const mockStatData: StatData = {
  totalLogs: 45,
  totalDuration: 12600,
  todayLogs: 2,
  todayDuration: 270,
  tagStats: [
    { tag: '开发', count: 15, duration: 4500 },
    { tag: '文档', count: 10, duration: 2400 },
    { tag: '会议', count: 8, duration: 1200 },
    { tag: '测试', count: 5, duration: 1500 },
    { tag: '沟通', count: 7, duration: 1800 }
  ]
};

export const commonTags = ['开发', '文档', '会议', '测试', '沟通', '需求', '审查', '优化', '分享', '设计', 'Bug修复', 'API'];

export default function logMockHandler(payload: { action: string; data?: Record<string, any> }) {
  const { action, data = {} } = payload;
  const userId = data.userId || 'anonymous_user';

  const userLogs = mockLogs.filter(log => log.userId === userId);

  switch (action) {
    case 'getLogs': {
      let logs = userLogs;
      if (data.date) {
        logs = logs.filter(log => log.date === data.date);
      }
      return { success: true, logs };
    }

    case 'getLogById': {
      const log = userLogs.find(item => item._id === data.id);
      return { success: true, log: log || null };
    }

    case 'createLog': {
      const now = new Date().toISOString();
      const newLog: Log = {
        _id: generateId(),
        userId,
        ...data.log,
        createdAt: now,
        updatedAt: now
      };
      mockLogs.push(newLog);
      return { success: true, log: newLog };
    }

    case 'updateLog': {
      const index = mockLogs.findIndex(item => item._id === data.id && item.userId === userId);
      if (index === -1) {
        return { success: false, log: null, message: '日志不存在或无权限' };
      }
      mockLogs[index] = {
        ...mockLogs[index],
        ...data.updates,
        updatedAt: new Date().toISOString()
      };
      return { success: true, log: mockLogs[index] };
    }

    case 'deleteLog': {
      const index = mockLogs.findIndex(item => item._id === data.id && item.userId === userId);
      if (index === -1) {
        return { success: false, message: '日志不存在或无权限' };
      }
      mockLogs.splice(index, 1);
      return { success: true };
    }

    case 'getStats': {
      const todayStr = formatLocalDate(new Date());
      const todayList = userLogs.filter(log => log.date === todayStr);
      const tagMap: Record<string, { count: number; duration: number }> = {};
      userLogs.forEach(log => {
        log.tags.forEach(tag => {
          if (!tagMap[tag]) tagMap[tag] = { count: 0, duration: 0 };
          tagMap[tag].count += 1;
          tagMap[tag].duration += log.duration;
        });
      });
      const tagStats = Object.entries(tagMap).map(([tag, stat]) => ({ tag, ...stat }));
      return {
        success: true,
        stats: {
          totalLogs: userLogs.length,
          totalDuration: userLogs.reduce((sum, log) => sum + log.duration, 0),
          todayLogs: todayList.length,
          todayDuration: todayList.reduce((sum, log) => sum + log.duration, 0),
          tagStats
        }
      };
    }

    default:
      return { success: false, message: '未知操作' };
  }
}
