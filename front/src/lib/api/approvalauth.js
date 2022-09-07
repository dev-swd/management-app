import client from './client';

// 承認者一覧取得（課ID指定）
export const getAuthsByDiv = (div_id) => {
  return client.get(`/approvalauths/${div_id}/index_by_division/`);
};

// 承認者一覧取得（事業部直轄／事業部ID指定）
export const getAuthsByDepDirect = (dep_id) => {
  return client.get(`/approvalauths/${dep_id}/index_by_dep_direct/`);
};


// 新規作成
export const createAuth = (params) => {
  return client.post('/approvalauths', params);
};

// 削除（ID指定）
export const deleteAuth = (id) => {
  return client.delete(`/approvalauths/${id}`);
};

// 以下、未使用　＊＊＊＊＊＊＊＊＊＊＊
// 一覧
export const getAuths = () => {
  return client.get('/approvalauths');
};
