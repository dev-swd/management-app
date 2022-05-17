import client from './client';

// 一覧
export const getAudits = (project, kinds) => {
  return client.get(`/audits/index_by_project?project_id=${project}&kinds=${kinds}`);
};

// 更新
export const updateAudits = (id, params) => {
  return client.patch(`/audits/${id}`, params);
}