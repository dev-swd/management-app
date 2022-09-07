import client from './client';

// 一覧（ToDoリスト／empId指定）
export const getPrjsToDo = (empId) => {
  return client.get(`/projects/${empId}/index_todo`);  
};

// PL一覧
export const getPls = () => {
  return client.get(`/projects/index_pl`);
}

// 一覧（条件：status,pl_id　並び順指定）
export const getPrjsByConditional = (status, pl, order, desc) => {
  return client.get(`/projects/index_by_conditional?status=${status}&pl=${pl}&order=${order}&desc=${desc}`);
}

// 新規作成
export const createPrj = (params) => {
  return client.post('/projects', params);
};

// 削除（プロジェクトID指定）
export const deletePrj = (id) => {
  return client.delete(`/projects/${id}`);
};

// 詳細（プロジェクトID指定／工程・リスク・目標・メンバーも取得）
export const getPrj = (id) => {
  return client.get(`/projects/${id}`);
};

// 更新（プロジェクトID指定／工程・リスク・目標・メンバーも更新）
export const updatePrj = (id, params) => {
  return client.patch(`/projects/${id}`, params);
};

// 一覧（プロジェクトメンバーになっている開発期間中のプロジェクト）
export const getPrjsByMem = (empId, thisDate) => {
  return client.get(`/projects/index_by_member?emp_id=${empId}&thisDate=${thisDate}`);
}

// 一覧（プロジェクトメンバーになっている推進中のプロジェクト）
export const getPrjsByMemRunning = (id) => {
  return client.get(`/projects/${id}/index_by_member_running/`);
}


// 一覧【未使用】
export const getPrjs = () => {
  return client.get('/projects');
};

