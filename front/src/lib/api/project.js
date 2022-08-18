import client from './client';

// 一覧（ToDoリスト／empId指定）
export const getPrjsToDo = (empId) => {
  return client.get(`/projects/${empId}/index_todo`);  
};


// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑　再確認済

// 一覧
export const getPrjs = () => {
  return client.get('/projects');
};

// 詳細
export const getPrj = (id) => {
  return client.get(`/projects/${id}`);
};

// 新規作成
export const createPrj = (params) => {
  return client.post('/projects', params);
};

// 更新
export const updatePrj = (id, params) => {
  return client.patch(`/projects/${id}`, params);
};

// 削除
export const deletePrj = (id) => {
  return client.delete(`/projects/${id}`);
};

// 一覧（プロジェクトメンバーになっている開発期間中のプロジェクト）
export const getPrjsByMem = (emp_id, thisDate) => {
  return client.get(`/projects/index_by_member?emp_id=${emp_id}&thisDate=${thisDate}`);
}

// 一覧（プロジェクトメンバーになっている推進中のプロジェクト）
export const getPrjsByMemRunning = (id) => {
  return client.get(`/projects/${id}/index_by_member_running/`);
}

// 一覧（条件：status,pl_id　並び順指定）
export const getPrjsByConditional = (status, pl, order) => {
  return client.get(`/projects/index_by_conditional?status=${status}&pl=${pl}&order=${order}`);
}
