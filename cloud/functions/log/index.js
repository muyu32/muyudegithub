const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

async function getLogs(data) {
  const { userId, date } = data;
  const where = { userId };
  if (date) {
    where.date = date;
  }

  const { data: logs } = await db.collection('logs')
    .where(where)
    .orderBy('createdAt', 'desc')
    .get();

  return { success: true, logs };
}

async function getLogById(data) {
  const { userId, id } = data;
  const { data: logs } = await db.collection('logs').where({
    _id: id,
    userId
  }).get();

  return { success: true, log: logs[0] || null };
}

async function createLog(data) {
  const { userId, log } = data;
  const now = new Date().toISOString();
  const newLogData = {
    ...log,
    userId,
    createdAt: now,
    updatedAt: now
  };

  const result = await db.collection('logs').add({
    data: newLogData
  });

  return {
    success: true,
    log: {
      ...newLogData,
      _id: result._id
    }
  };
}

async function updateLog(data) {
  const { userId, id, updates } = data;
  const { data: existingLogs } = await db.collection('logs').where({
    _id: id,
    userId
  }).get();

  if (existingLogs.length === 0) {
    return { success: false, message: '日志不存在' };
  }

  const updateData = {
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await db.collection('logs').doc(id).update({
    data: updateData
  });

  const { data: updatedLogs } = await db.collection('logs').where({
    _id: id,
    userId
  }).get();

  return { success: true, log: updatedLogs[0] };
}

async function deleteLog(data) {
  const { userId, id } = data;
  const { data: existingLogs } = await db.collection('logs').where({
    _id: id,
    userId
  }).get();

  if (existingLogs.length === 0) {
    return { success: false, message: '日志不存在' };
  }

  await db.collection('logs').doc(id).remove();
  return { success: true };
}

async function getStats(data) {
  const { userId } = data;
  const { data: logs } = await db.collection('logs').where({
    userId
  }).get();

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === today);

  const totalDuration = logs.reduce((sum, l) => sum + l.duration, 0);
  const todayDuration = todayLogs.reduce((sum, l) => sum + l.duration, 0);

  const tagMap = new Map();
  logs.forEach(log => {
    log.tags.forEach(tag => {
      const existing = tagMap.get(tag) || { count: 0, duration: 0 };
      tagMap.set(tag, {
        count: existing.count + 1,
        duration: existing.duration + log.duration
      });
    });
  });

  const tagStats = Array.from(tagMap.entries())
    .map(([tag, tagData]) => ({ tag, ...tagData }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    success: true,
    stats: {
      totalLogs: logs.length,
      totalDuration,
      todayLogs: todayLogs.length,
      todayDuration,
      tagStats
    }
  };
}

exports.main = async (event, context) => {
  const { action, data } = event;

  try {
    switch (action) {
      case 'getLogs':
        return await getLogs(data);
      case 'getLogById':
        return await getLogById(data);
      case 'createLog':
        return await createLog(data);
      case 'updateLog':
        return await updateLog(data);
      case 'deleteLog':
        return await deleteLog(data);
      case 'getStats':
        return await getStats(data);
      default:
        return { success: false, message: '未知操作' };
    }
  } catch (error) {
    console.error('[log] Error:', error);
    return { success: false, message: '操作失败，请重试' };
  }
};