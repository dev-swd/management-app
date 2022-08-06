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

// 詳細（権限ID指定）
export const getEmpDevise = (devise_id) => {
//  return client.get(`/employees/show_by_devise?id=${id}`);
return client.get(`/employees/${devise_id}/show_by_devise/`);
};

// 一覧（承認権限対象）
export const getEmpsByApproval = (emp_id) => {
  return client.get(`/employees/${emp_id}/index_by_approval/`)
}

// 一覧（課ID指定）
export const getEmpsByDivision = (div_id) => {
  return client.get(`/employees/${div_id}/index_by_div/`)
}
