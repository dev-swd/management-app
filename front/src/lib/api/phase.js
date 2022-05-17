import client from './client';

// 詳細
export const getPhase = (id) => {
  return client.get(`/phases/${id}`);
};

// 新規作成
export const createPhase = (params) => {
  return client.post('/phases', params);
};

// 更新
export const updatePhase = (id, params) => {
  return client.patch(`/phases/${id}`, params);
};

// 削除
export const deletePhase = (id) => {
  return client.delete(`/phases/${id}`);
};
