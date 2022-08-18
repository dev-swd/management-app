import client from './client';

// 一覧
export const getEmps = () => {
  return client.get('/employees');
};

// 詳細（社員ID指定）
export const getEmp = (emp_id) => {
  return client.get(`/employees/${emp_id}`);
};

// 詳細（Devise UserName付／社員ID指定）
export const getEmpWithDevise = (emp_id) => {
  return client.get(`/employees/${emp_id}/show_with_devise/`);
}

// 新規作成
export const createEmp = (params) => {
  return client.post('/employees', params);
};

// 更新（社員ID指定）
export const updateEmp = (id, params) => {
  return client.patch(`/employees/${id}`, params);
};

// 削除【再確認未実施】
export const deleteEmp = (id) => {
  return client.delete(`/employees/${id}`);
};

// 詳細（devise_id指定）
export const getEmpDevise = (devise_id) => {
return client.get(`/employees/${devise_id}/show_by_devise/`);
};

// 一覧（承認権限対象）【再確認未実施】
export const getEmpsByApproval = (emp_id) => {
  return client.get(`/employees/${emp_id}/index_by_approval/`)
}

// 一覧（課ID指定）
export const getEmpsByDivision = (div_id) => {
  return client.get(`/employees/${div_id}/index_by_div/`)
}

// 一覧（事業部直属／事業部ID指定）
export const getEmpsByDepDirect = (dep_id) => {
  return client.get(`/employees/${dep_id}/index_by_dep_direct/`)
}

// 一覧（未所属）
export const getEmpsByNotAssign = () => {
  return client.get(`/employees/index_by_not_assign/`)
}

// Deviseパスワード変更(社員ID指定)
export const updatePassword = (emp_id, params) => {
  return client.patch(`/employees/${emp_id}/update_devise_password/`, params);
}

// DEVISE一覧
export const getDeviseUsers = () => {
  return client.get(`/employees/index_devise/`)
}
