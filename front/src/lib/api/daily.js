import client from './client';

// 勤務日報一覧（社員、年月指定）
export const getDailyReps = (emp_id, y, m) => {
  return client.get(`/dailyreports/index_by_emp?emp_id=${emp_id}&y=${y}&m=${m}`);
};

// 勤務日報詳細
export const getDailyRep = (id) => {
  return client.get(`/dailyreports/${id}`);
};

// 勤務日報更新
export const updateDailyRep = (id, params) => {
  return client.patch(`/dailyreports/${id}`, params);
}

// 作業日報一覧
//export const getDailyRepChildren = (daily_id) => {
export const getWorkReps = (daily_id) => {
    return client.get(`/workreports/${daily_id}/index_by_daily`);
};

// 作業日報更新
//export const updateDailyRepChildren = (daily_id, params) => {
export const updateWorkReps = (daily_id, params) => {
    return client.patch(`/workreports/${daily_id}`, params);
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