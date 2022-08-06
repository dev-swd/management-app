import client from './client';

// 一覧
export const getChangelogs = (prj_id) => {
  return client.get(`/changelogs/${prj_id}/index_by_project`);
};

// 新規作成
export const createChangelog = (params) => {
  return client.post('/changelogs', params);
};
