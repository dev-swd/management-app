import client from './client';

// 一覧
export const getDeps = () => {
  return client.get('/departments');
};

// 詳細
export const getDep = (id) => {
  return client.get(`/departments/${id}`);
};

// 新規作成
export const createDep = (params) => {
  return client.post('/departments', params);
};

// 更新
export const updateDep = (id, params) => {
  return client.patch(`/departments/${id}`, params);
};

// 削除
export const deleteDep = (id) => {
  return client.delete(`/departments/${id}`);
};
