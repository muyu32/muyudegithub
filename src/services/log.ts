import Taro from '@tarojs/taro';
import type { Log, StatData } from '@/types';

async function callLogFunction<T = any>(
  action: string,
  data?: Record<string, any>
): Promise<T> {
  const res = await Taro.cloud.callFunction({
    name: 'log',
    data: { action, data }
  });
  return res.result as T;
}

export async function getLogs(userId: string, date?: string): Promise<Log[]> {
  const result = await callLogFunction<{ success: boolean; logs: Log[] }>('getLogs', {
    userId,
    date
  });
  return result.logs || [];
}

export async function getLogById(userId: string, id: string): Promise<Log | undefined> {
  const result = await callLogFunction<{ success: boolean; log: Log | null }>('getLogById', {
    userId,
    id
  });
  return result.log || undefined;
}

export async function createLog(
  userId: string,
  log: Omit<Log, '_id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Log> {
  const result = await callLogFunction<{ success: boolean; log: Log }>('createLog', {
    userId,
    log
  });
  return result.log;
}

export async function updateLog(
  userId: string,
  id: string,
  updates: Partial<Omit<Log, '_id' | 'userId' | 'createdAt'>>
): Promise<Log | null> {
  const result = await callLogFunction<{ success: boolean; log: Log | null; message?: string }>(
    'updateLog',
    { userId, id, updates }
  );
  return result.log || null;
}

export async function deleteLog(userId: string, id: string): Promise<boolean> {
  const result = await callLogFunction<{ success: boolean; message?: string }>('deleteLog', {
    userId,
    id
  });
  return result.success;
}

export async function getStats(userId: string): Promise<StatData> {
  const result = await callLogFunction<{ success: boolean; stats: StatData }>('getStats', {
    userId
  });
  return result.stats;
}