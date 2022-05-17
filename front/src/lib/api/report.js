import client from './client';

// 詳細
export const getRep = (id) => {
  return client.get(`/reports/${id}`);
};

// 更新
export const updateRep = (id, params) => {
  return client.patch(`/reports/${id}`, params);
};
