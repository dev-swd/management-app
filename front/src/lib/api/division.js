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

// 一覧（承認権限件数付き）
export const getDivsWithAuthcnt = () => {
  return client.get(`/divisions/index_with_authcnt/`);
}

// 一覧（事業部別）
export const getDivsByDep = (dep_id) => {
  return client.get(`/divisions/${dep_id}/index_by_dep/`);
}

// 一覧（承認管轄）
export const getDivsByApproval = (emp_id) => {
  return client.get(`/divisions/${emp_id}/index_by_approval/`);
}