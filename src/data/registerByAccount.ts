import type { User } from '@/types';

export default function registerByAccountMock(data?: Record<string, any>): User {
  const { username } = data || {};
  return {
    _id: `account_${username || Date.now()}`,
    openid: '',
    nickname: username || '新用户',
    avatarUrl: ''
  };
}
