const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { username, password } = event;

  if (!username || !password) {
    return {
      success: false,
      message: '请输入用户名和密码'
    };
  }

  try {
    const userCollection = db.collection('users');
    const { data: users } = await userCollection.where({
      username
    }).get();

    if (users.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    const user = users[0];
    if (user.password !== password) {
      return {
        success: false,
        message: '密码错误'
      };
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('[loginByAccount] Error:', error);
    return {
      success: false,
      message: '登录失败，请重试'
    };
  }
};