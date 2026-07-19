import Taro from '@tarojs/taro';

const DB_PREFIX = 'work_log_db_';
const USERS_KEY = `${DB_PREFIX}users`;
const LOGS_KEY = `${DB_PREFIX}logs`;

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = Taro.getStorageSync(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  } catch (e) {
    console.error(`[DB] Failed to get ${key}:`, e);
  }
  return defaultValue;
}

function setStorage<T>(key: string, value: T): void {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[DB] Failed to set ${key}:`, e);
  }
}

export interface DBUser {
  _id: string;
  username?: string;
  password?: string;
  openid?: string;
  nickname: string;
  avatarUrl: string;
  loginType: 'wechat' | 'account';
  createdAt: string;
  updatedAt: string;
}

export interface DBLog {
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

function getUsers(): DBUser[] {
  return getStorage<DBUser[]>(USERS_KEY, []);
}

function saveUsers(users: DBUser[]): void {
  setStorage(USERS_KEY, users);
}

function addUser(user: DBUser): DBUser {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

function findUserByUsername(username: string): DBUser | undefined {
  return getUsers().find(u => u.username === username);
}

function findUserByOpenid(openid: string): DBUser | undefined {
  return getUsers().find(u => u.openid === openid);
}

function findUserById(id: string): DBUser | undefined {
  return getUsers().find(u => u._id === id);
}

function getLogs(): DBLog[] {
  return getStorage<DBLog[]>(LOGS_KEY, []);
}

function saveLogs(logs: DBLog[]): void {
  setStorage(LOGS_KEY, logs);
}

function getLogsByUserId(userId: string): DBLog[] {
  return getLogs()
    .filter(log => log.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function getLogsByUserIdAndDate(userId: string, date: string): DBLog[] {
  return getLogsByUserId(userId).filter(log => log.date === date);
}

function getLogById(id: string): DBLog | undefined {
  return getLogs().find(log => log._id === id);
}

function addLog(log: DBLog): DBLog {
  const logs = getLogs();
  logs.push(log);
  saveLogs(logs);
  return log;
}

function updateLog(id: string, updates: Partial<Omit<DBLog, '_id' | 'userId' | 'createdAt'>>): DBLog | null {
  const logs = getLogs();
  const index = logs.findIndex(log => log._id === id);
  if (index === -1) return null;
  logs[index] = {
    ...logs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveLogs(logs);
  return logs[index];
}

function deleteLog(id: string): boolean {
  const logs = getLogs();
  const index = logs.findIndex(log => log._id === id);
  if (index === -1) return false;
  logs.splice(index, 1);
  saveLogs(logs);
  return true;
}

export const db = {
  getUsers,
  saveUsers,
  addUser,
  findUserByUsername,
  findUserByOpenid,
  findUserById,
  getLogs,
  saveLogs,
  getLogsByUserId,
  getLogsByUserIdAndDate,
  getLogById,
  addLog,
  updateLog,
  deleteLog
};
