import type { User } from '@/types';

const MOCK_USERS: Record<string, { _id: string; username: string; password: string; nickname: string }> = {
  admin: {
    _id: 'account_admin',
    username: 'admin',
    password: '123456',
    nickname: '管理员'
  }
};

export default function loginByAccountMock(data?: Record<string, any>): { success: boolean; user?: User; message?: string } {
  const { username, password } = data || {};
  const account = MOCK_USERS[username];
  if (!account || account.password !== password) {
    return { success: false, message: '用户名或密码错误' };
  }
  const user: User = {
    _id: account._id,
    openid: '',
    nickname: account.nickname,
    avatarUrl: ''
  };
  return { success: true, user };
}
