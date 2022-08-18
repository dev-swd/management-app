// 事業部情報用API呼出

import client from './client';

// 事業部一覧取得
export const getDeps = () => {
  return client.get('/departments');
};

// 事業部情報取得（ID指定）
export const getDep = (id) => {
  return client.get(`/departments/${id}`);
};

// 事業部新規作成
export const createDep = (params) => {
  return client.post('/departments', params);
};

// 事業部更新（ID指定）
export const updateDep = (id, params) => {
  return client.patch(`/departments/${id}`, params);
};

// 事業部削除（ID指定）
export const deleteDep = (id) => {
  return client.delete(`/departments/${id}`);
};
