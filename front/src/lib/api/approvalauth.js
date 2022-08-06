import client from './client';

// 一覧
export const getAuths = () => {
  return client.get('/approvalauths');
};

// 削除
export const deleteAuth = (id) => {
  return client.delete(`/approvalauths/${id}`);
};

// 新規作成
export const createAuth = (params) => {
  return client.post('/approvalauths', params);
};
