import client from './client';

// 一覧取得（プロジェクトID指定）
// 工程情報の一覧とプロジェクト情報の作業費、作業工数、外注費、外注工数を取得
export const getPhases = (prjId) => {
  return client.get(`/phases/${prjId}/index_by_project/`);
};

// 更新
export const updatePhase = (id, params) => {
  return client.patch(`/phases/${id}`, params);
};

// 工程別予実データ取得
export const getPhase_PlanAndActual = (prgId) => {
  return client.get(`/phases/${prgId}/index_plan_and_actual/`);
};

//// 詳細
//export const getPhase = (id) => {
//  return client.get(`/phases/${id}`);
//};

//// 新規作成
//export const createPhase = (params) => {
//  return client.post('/phases', params);
//};

//// 削除
//export const deletePhase = (id) => {
//  return client.delete(`/phases/${id}`);
//};
