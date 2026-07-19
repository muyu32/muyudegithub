export interface Log {
  _id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  duration: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  openid: string;
  nickname: string;
  avatarUrl: string;
}

export interface StatData {
  totalLogs: number;
  totalDuration: number;
  todayLogs: number;
  todayDuration: number;
  tagStats: { tag: string; count: number; duration: number }[];
}