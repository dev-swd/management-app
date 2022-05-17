import client from './client';

// 詳細
export const getRisk = (id) => {
  return client.get(`/risks/${id}`);
};

// 新規作成
export const createRisk = (params) => {
  return client.post('/risks', params);
};

// 更新
export const updateRisk = (id, params) => {
  return client.patch(`/risks/${id}`, params);
};

// 削除
export const deleteRisk = (id) => {
  return client.delete(`/risks/${id}`);
};
