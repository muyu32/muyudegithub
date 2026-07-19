import type { User } from '@/types';

const MOCK_USERS: Record<string, { _id: string; username: string; password: string; nickname: string }> = {
  admin: {
    _id: 'account_admin',
    username: 'admin',
    password: '123456',
    nickname: '管理员'
  }
};

export default function loginByAccountMock(data?: Record<string, any>): User {
  const { username, password } = data || {};
  const account = MOCK_USERS[username];
  if (!account || account.password !== password) {
    throw new Error('用户名或密码错误');
  }
  return {
    _id: account._id,
    openid: '',
    nickname: account.nickname,
    avatarUrl: ''
  };
}
