import client from './client';

// 一覧取得（プロジェクトIDと種別（plan or report）を指定）
export const getAudits = (prjId, kinds) => {
  return client.get(`/audits/index_by_project?project_id=${prjId}&kinds=${kinds}`);
};

// 更新（プロジェクトID指定）
export const updateAudits = (prjId, params) => {
  return client.patch(`/audits/${prjId}`, params);
}