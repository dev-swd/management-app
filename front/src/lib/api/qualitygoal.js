import client from './client';

// 詳細
export const getGoal = (id) => {
  return client.get(`/qualitygoals/${id}`);
};

// 新規作成
export const createGoal = (params) => {
  return client.post('/qualitygoals', params);
};

// 更新
export const updateGoal = (id, params) => {
  return client.patch(`/qualitygoals/${id}`, params);
};

// 削除
export const deleteGoal = (id) => {
  return client.delete(`/qualitygoals/${id}`);
};
