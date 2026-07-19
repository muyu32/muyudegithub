import Taro from '@tarojs/taro';
import type { DBUser } from './db';

export interface LoginResult {
  success: boolean;
  user?: DBUser;
  message?: string;
}

function isWeapp(): boolean {
  return process.env.TARO_ENV === 'weapp';
}

async function callCloudFunction<T = any>(name: string, data?: Record<string, any>): Promise<T> {
  const res = await Taro.cloud.callFunction({ name, data });
  return res.result as T;
}

export async function loginByWechat(): Promise<LoginResult> {
  if (!isWeapp()) {
    return { success: false, message: '微信登录仅支持小程序环境' };
  }
  return callCloudFunction<LoginResult>('loginByWechat');
}

export async function registerByAccount(
  username: string,
  password: string,
  nickname: string
): Promise<LoginResult> {
  return callCloudFunction<LoginResult>('registerByAccount', { username, password, nickname });
}

export async function loginByAccount(
  username: string,
  password: string
): Promise<LoginResult> {
  return callCloudFunction<LoginResult>('loginByAccount', { username, password });
}