import client from './client';

// 一覧（ToDoリスト／empId指定）
export const getPrjsToDo = (empId) => {
  return client.get(`/projects/${empId}/index_todo`);  
};

// 一覧（ToDoリスト／内部監査）
export const getPrjsToDoAudit = () => {
  return client.get(`/projects/index_audit_todo`);
}

// PL一覧（条件：not_project）
export const getPls = (not_project) => {
  return client.get(`/projects/index_pl?not_project=${not_project}`);
}

// 一覧（条件：not_project,status,pl_id　並び順指定）
export const getPrjsByConditional = (not_project, status, pl, order, desc) => {
  return client.get(`/projects/index_by_conditional?not_project=${not_project}&status=${status}&pl=${pl}&order=${order}&desc=${desc}`);
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
export const getPrjsByMem = (empId, divId, depId, thisDate) => {
  return client.get(`/projects/index_by_member?emp_id=${empId}&div_id=${divId}&dep_id=${depId}&thisDate=${thisDate}`);
}

// 一覧（プロジェクトメンバーになっている推進中のプロジェクト）
export const getPrjsByMemRunning = (id) => {
  return client.get(`/projects/${id}/index_by_member_running/`);
}

// プロジェクト外タスク登録（タスクグループ以下を登録）
export const createNoProject = (params) => {
  return client.post('/projects/create_no_project', params);
}

// タスクグループ詳細取得
export const getNoProject = (prjId) => {
  return client.get(`/projects/${prjId}/show_no_project/`);
}

// タスクグループ更新
export const updateNoProject = (prjId, params) => {
  return client.patch(`/projects/${prjId}/update_no_project/`, params);
}

// 一覧【未使用】
export const getPrjs = () => {
  return client.get('/projects');
};

