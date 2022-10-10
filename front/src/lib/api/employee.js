import client from './client';

// 一覧
export const getEmps = () => {
  return client.get('/employees');
};

// 詳細（社員ID指定）
export const getEmp = (empId) => {
  return client.get(`/employees/${empId}`);
};

// 詳細（Devise UserName付／社員ID指定）
export const getEmpWithDevise = (empId) => {
  return client.get(`/employees/${empId}/show_with_devise/`);
}

// 新規作成
export const createEmp = (params) => {
  return client.post('/employees', params);
};

// 新規作成（システム管理者用）
export const createEmpWithPassword = (params) => {
  return client.post('/employees/create_with_password', params);
};

// 更新（社員ID指定）
export const updateEmp = (id, params) => {
  return client.patch(`/employees/${id}`, params);
};

// 削除（社員ID指定）
export const deleteEmp = (id) => {
  return client.delete(`/employees/${id}`);
};

// 詳細（devise_id指定）
export const getEmpDevise = (deviseId) => {
return client.get(`/employees/${deviseId}/show_by_devise/`);
};

// 一覧（承認権限対象）
export const getEmpsByApproval = (empId) => {
  return client.get(`/employees/${empId}/index_by_approval/`)
}

// 一覧（課ID指定）
export const getEmpsByDivision = (divId) => {
  return client.get(`/employees/${divId}/index_by_div/`)
}

// 一覧（事業部直属／事業部ID指定）
export const getEmpsByDepDirect = (depId) => {
  return client.get(`/employees/${depId}/index_by_dep_direct/`)
}

// 一覧（未所属）
export const getEmpsByNotAssign = () => {
  return client.get(`/employees/index_by_not_assign/`)
}

// Deviseパスワード変更(社員ID指定／現在のパスワード必要)
export const updatePassword = (empId, params) => {
  return client.patch(`/employees/${empId}/update_password_with_currentpassword/`, params);
}

// Deviseパスワード変更(社員ID指定／現在のパスワード不要)
export const updatePasswordReset = (empId, params) => {
  return client.patch(`/employees/${empId}/update_password_without_currentpassword/`, params);
}

// DEVISE一覧
export const getDeviseUsers = () => {
  return client.get(`/employees/index_devise/`)
}
