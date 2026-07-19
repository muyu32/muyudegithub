import type { User } from '@/types';

export default function loginByWechatMock(data?: Record<string, any>): User {
  return {
    _id: `wechat_${Date.now()}`,
    openid: `openid_${Date.now()}`,
    nickname: '微信用户',
    avatarUrl: ''
  };
}
