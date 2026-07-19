import type { Log, StatData } from '@/types';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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
  },
  {
    _id: '4',
    userId: 'user1',
    title: '修复登录页面bug',
    content: '修复了登录页面在移动端的显示问题，包括键盘弹出时页面被遮挡、密码输入框无法粘贴等问题。',
    date: yesterday,
    duration: 120,
    tags: ['开发', 'Bug修复'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: '5',
    userId: 'user1',
    title: '编写单元测试',
    content: '为用户模块编写了20个单元测试用例，覆盖率达到85%。',
    date: yesterday,
    duration: 150,
    tags: ['测试', '代码'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: '6',
    userId: 'user1',
    title: '客户需求沟通',
    content: '与客户进行了需求沟通，了解了他们对新版本的期望和反馈。整理了需求变更文档。',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    duration: 90,
    tags: ['沟通', '需求'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: '7',
    userId: 'user1',
    title: '性能优化',
    content: '对首页加载速度进行了优化，通过懒加载和代码分割，将首屏加载时间从3秒降到1.5秒。',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    duration: 240,
    tags: ['优化', '开发'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: '8',
    userId: 'user1',
    title: '技术分享',
    content: '准备了关于React Hooks最佳实践的技术分享，在团队内部进行了交流。',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    duration: 60,
    tags: ['分享', '技术'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    _id: '9',
    userId: 'user1',
    title: '设计稿评审',
    content: '参加设计稿评审会，对新功能的UI设计提出了修改建议。',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    duration: 90,
    tags: ['评审', '设计'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    _id: '10',
    userId: 'user1',
    title: '文档更新',
    content: '更新了API文档，补充了新接口的说明和示例代码。',
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    duration: 120,
    tags: ['文档', 'API'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString()
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