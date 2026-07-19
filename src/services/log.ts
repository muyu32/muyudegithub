import type { Log, StatData } from '@/types';
import { callFunction } from './cloud';

interface LogResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  logs?: Log[];
  log?: Log | null;
  stats?: StatData;
}

function assertSuccess<T>(result: LogResponse<T>): void {
  if (!result.success) {
    throw new Error(result.message || '请求失败');
  }
}

export async function getLogs(userId: string, date?: string): Promise<Log[]> {
  const result = await callFunction<LogResponse<{ logs: Log[] }>>('log', {
    action: 'getLogs',
    data: { userId, date }
  });
  assertSuccess(result);
  return result.logs || [];
}

export async function getLogById(userId: string, id: string): Promise<Log | undefined> {
  const result = await callFunction<LogResponse<{ log: Log | null }>>('log', {
    action: 'getLogById',
    data: { userId, id }
  });
  assertSuccess(result);
  return result.log || undefined;
}

export async function createLog(
  userId: string,
  log: Omit<Log, '_id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Log> {
  const result = await callFunction<LogResponse<{ log: Log }>>('log', {
    action: 'createLog',
    data: { userId, log }
  });
  assertSuccess(result);
  return result.log!;
}

export async function updateLog(
  userId: string,
  id: string,
  updates: Partial<Omit<Log, '_id' | 'userId' | 'createdAt'>>
): Promise<Log | null> {
  const result = await callFunction<LogResponse<{ log: Log | null }>>('log', {
    action: 'updateLog',
    data: { userId, id, updates }
  });
  assertSuccess(result);
  return result.log || null;
}

export async function deleteLog(userId: string, id: string): Promise<boolean> {
  const result = await callFunction<LogResponse<undefined>>('log', {
    action: 'deleteLog',
    data: { userId, id }
  });
  assertSuccess(result);
  return result.success;
}

export async function getStats(userId: string): Promise<StatData> {
  const result = await callFunction<LogResponse<{ stats: StatData }>>('log', {
    action: 'getStats',
    data: { userId }
  });
  assertSuccess(result);
  return result.stats!;
}
