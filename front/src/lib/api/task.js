import client from './client';

// 一覧（ToDoリスト／empId指定）
export const getTasksToDo = (empId) => {
  return client.get(`/tasks/${empId}/index_todo`);  
};


// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑　再確認済

//一覧
export const getTasks = (phase_id) => {
  return client.get(`/tasks/${phase_id}/index_by_phase/`);
};

// 更新
export const updateTasksForPlan = (phase_id, params) => {
  return client.patch(`/tasks/${phase_id}/update_for_planned/`, params);
};

// 一覧（工程条件）
export const getTasksByPhase = (id) => {
  return client.get(`/tasks/${id}/index_by_phase/`);
};

// 一覧（プロジェクト条件）
export const getTasksByProject = (id) => {
  return client.get(`/tasks/${id}/index_by_project/`);
};

// 実績日付更新
export const updateTasksActualDate = (prj_id, params) => {
  return client.patch(`/tasks/${prj_id}/update_for_actualdate/`, params);
};
