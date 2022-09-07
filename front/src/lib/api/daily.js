import client from './client';

// 勤務日報一覧（社員、年月指定）
export const getDailyReps = (emp_id, y, m) => {
  return client.get(`/dailyreports/index_by_emp?emp_id=${emp_id}&y=${y}&m=${m}`);
};

// 勤務日報詳細（勤務日報ID指定）
export const getDailyRep = (dailyId) => {
  return client.get(`/dailyreports/${dailyId}`);
};

// 勤務日報更新（勤務日報ID指定）
export const updateDailyRep = (dailyId, params) => {
  return client.patch(`/dailyreports/${dailyId}`, params);
}

// 作業日報一覧（勤務日報ID指定）
export const getWorkReps = (dailyId) => {
    return client.get(`/workreports/${dailyId}/index_by_daily`);
};

// 作業日報更新（勤務日報ID指定）
export const updateWorkReps = (dailyId, params) => {
    return client.patch(`/workreports/${dailyId}`, params);
}

// 勤務日報状態更新
export const updateStatus = (id, params) => {
  return client.patch(`/dailyreports/${id}/status_update`, params);
}

// 日報承認
export const approvalUpdate = (params) => {
  return client.patch(`/dailyreports/approval_update`, params);
}

// 日報承認取消
export const approvalCancel = (params) => {
  return client.patch(`/dailyreports/approval_cancel`, params);
}