import client from './client';

// 一覧
export const getEmps = () => {
  return client.get('/employees');
};

// 詳細
export const getEmp = (id) => {
  return client.get(`/employees/${id}`);
};

// 新規作成
export const createEmp = (params) => {
  return client.post('/employees', params);
};

// 更新
export const updateEmp = (id, params) => {
  return client.patch(`/employees/${id}`, params);
};

// 削除
export const deleteEmp = (id) => {
  return client.delete(`/employees/${id}`);
};

// 
export const getEmpDevise = (id) => {
  return client.get(`/employees/show_by_devise?id=${id}`);
};
