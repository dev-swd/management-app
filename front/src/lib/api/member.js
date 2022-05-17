import client from './client';

// 詳細
export const getMember = (id) => {
  return client.get(`/members/${id}`);
};

// 新規作成
export const createMember = (params) => {
  return client.post('/members', params);
};

// 更新
export const updateMember = (id, params) => {
  return client.patch(`/members/${id}`, params);
};

// 削除
export const deleteMember = (id) => {
  return client.delete(`/members/${id}`);
};
