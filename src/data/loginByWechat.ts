import type { User } from '@/types';

export default function loginByWechatMock(data?: Record<string, any>): { success: boolean; user: User } {
  const user: User = {
    _id: `wechat_${Date.now()}`,
    openid: `openid_${Date.now()}`,
    nickname: '微信用户',
    avatarUrl: ''
  };
  return { success: true, user };
}
