import client from './client';

// 一覧
export const getChangelogs = (project) => {
  return client.get(`/changelogs/index_by_project?project_id=${project}`);
};

// 新規作成
export const createChangelog = (params) => {
  return client.post('/changelogs', params);
};
