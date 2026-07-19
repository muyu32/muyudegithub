import type { User } from '@/types';

export default function registerByAccountMock(data?: Record<string, any>): { success: boolean; user: User; message?: string } {
  const { username } = data || {};
  const user: User = {
    _id: `account_${username || Date.now()}`,
    openid: '',
    nickname: username || '新用户',
    avatarUrl: ''
  };
  return { success: true, user };
}
