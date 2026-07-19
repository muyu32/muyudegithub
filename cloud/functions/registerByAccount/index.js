const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { username, password, nickname } = event;

  if (!username || username.length < 3) {
    return {
      success: false,
      message: '用户名至少3个字符'
    };
  }
  if (!password || password.length < 6) {
    return {
      success: false,
      message: '密码至少6个字符'
    };
  }
  if (!nickname || nickname.length < 1) {
    return {
      success: false,
      message: '请输入昵称'
    };
  }

  try {
    const userCollection = db.collection('users');
    const { data: existingUsers } = await userCollection.where({
      username
    }).get();

    if (existingUsers.length > 0) {
      return {
        success: false,
        message: '用户名已存在'
      };
    }

    const now = new Date().toISOString();
    const result = await userCollection.add({
      data: {
        username,
        password,
        nickname,
        avatarUrl: '',
        loginType: 'account',
        createdAt: now,
        updatedAt: now
      }
    });

    const user = {
      _id: result._id,
      username,
      nickname,
      avatarUrl: '',
      loginType: 'account',
      createdAt: now,
      updatedAt: now
    };

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('[registerByAccount] Error:', error);
    return {
      success: false,
      message: '注册失败，请重试'
    };
  }
};