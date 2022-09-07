// 課情報用API呼出

import client from './client';

// 一覧（未確認）
export const getDivs = () => {
  return client.get('/divisions');
};

// 詳細【未確認】
export const getDiv = (id) => {
  return client.get(`/divisions/${id}`);
};

// 詳細（事業部ダミー課）
export const getDivByDepDummy = (depId) => {
  return client.get(`/divisions/${depId}/show_by_depdummy/`);
}

// 新規作成
export const createDiv = (params) => {
  return client.post('/divisions', params);
};

// 更新（ID指定）
export const updateDiv = (id, params) => {
  return client.patch(`/divisions/${id}`, params);
};

// 削除（ID指定）
export const deleteDiv = (id) => {
  return client.delete(`/divisions/${id}`);
};

// 一覧（承認権限件数付き）
export const getDivsWithAuthcnt = () => {
  return client.get(`/divisions/index_with_authcnt/`);
}

// 一覧（事業部別/事業部ID指定）
export const getDivsByDepartment = (depId) => {
  return client.get(`/divisions/${depId}/index_by_department/`);
}

// 一覧（承認管轄/社員ID指定）
export const getDivsByApproval = (empId) => {
  return client.get(`/divisions/${empId}/index_by_approval/`);
}