import client from './client';

// 一覧
export const getPrjs = () => {
  return client.get('/projects');
};

// 詳細
export const getPrj = (id) => {
  return client.get(`/projects/${id}`);
};

// 新規作成
export const createPrj = (params) => {
  return client.post('/projects', params);
};

// 更新
export const updatePrj = (id, params) => {
  return client.patch(`/projects/${id}`, params);
};

// 削除
export const deletePrj = (id) => {
  return client.delete(`/projects/${id}`);
};
