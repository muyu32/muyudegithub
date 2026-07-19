const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    return {
      success: false,
      message: '获取微信用户信息失败'
    };
  }

  try {
    const userCollection = db.collection('users');
    const { data: users } = await userCollection.where({
      openid
    }).get();

    let user;
    if (users.length === 0) {
      const now = new Date().toISOString();
      const result = await userCollection.add({
        data: {
          openid,
          nickname: '微信用户',
          avatarUrl: '',
          loginType: 'wechat',
          createdAt: now,
          updatedAt: now
        }
      });

      user = {
        _id: result._id,
        openid,
        nickname: '微信用户',
        avatarUrl: '',
        loginType: 'wechat',
        createdAt: now,
        updatedAt: now
      };
    } else {
      user = users[0];
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('[loginByWechat] Error:', error);
    return {
      success: false,
      message: '微信登录失败，请重试'
    };
  }
};