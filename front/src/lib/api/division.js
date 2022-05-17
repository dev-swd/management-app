import client from './client';

// 一覧
export const getDivs = () => {
  return client.get('/divisions');
};

// 詳細
export const getDiv = (id) => {
  return client.get(`/divisions/${id}`);
};

// 新規作成
export const createDiv = (params) => {
  return client.post('/divisions', params);
};

// 更新
export const updateDiv = (id, params) => {
  return client.patch(`/divisions/${id}`, params);
};

// 削除
export const deleteDiv = (id) => {
  return client.delete(`/divisions/${id}`);
};

// 一覧（事業部別）
export const getDivsFilterDepid = (dep_id) => {
  return client.get(`/divisions/filterdepid?depid=${dep_id}`);
}