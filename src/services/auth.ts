import Taro from '@tarojs/taro';
import type { User } from '@/types';
import { callFunction } from './cloud';

const STORAGE_KEY = 'worklog_user';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const stored = Taro.getStorageSync<User>(STORAGE_KEY);
    if (stored && stored._id) {
      return stored;
    }
  } catch (e) {
    console.error('[Auth] Failed to get current user:', e);
  }
  return null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    Taro.setStorageSync(STORAGE_KEY, user);
  } else {
    Taro.removeStorageSync(STORAGE_KEY);
  }
}

function assertSuccess(result: { success: boolean; message?: string }): void {
  if (!result.success) {
    throw new Error(result.message || '请求失败');
  }
}

export async function loginByWechat(): Promise<User> {
  const { code } = await Taro.login();
  const result = await callFunction<{ success: boolean; user: User; message?: string }>('loginByWechat', { code });
  assertSuccess(result);
  setCurrentUser(result.user);
  return result.user;
}

export async function loginByAccount(username: string, password: string): Promise<User> {
  const result = await callFunction<{ success: boolean; user: User; message?: string }>('loginByAccount', {
    username,
    password
  });
  assertSuccess(result);
  setCurrentUser(result.user);
  return result.user;
}

export async function registerByAccount(username: string, password: string): Promise<User> {
  const result = await callFunction<{ success: boolean; user: User; message?: string }>('registerByAccount', {
    username,
    password
  });
  assertSuccess(result);
  setCurrentUser(result.user);
  return result.user;
}

export async function logout(): Promise<void> {
  setCurrentUser(null);
}
