import client from './client';

// 詳細(プロジェクトID指定で完了報告書詳細を取得)
export const getRep = (id) => {
  return client.get(`/reports/${id}`);
};

// 更新(プロジェクトID指定で更新)
export const updateRep = (id, params) => {
  return client.patch(`/reports/${id}`, params);
};
