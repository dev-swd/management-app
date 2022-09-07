import client from './client';

// プロジェクトIDを条件とした一覧取得
export const getProgsByProject = (id) => {
  return client.get(`/progressreports/${id}/index_by_project`);
}

// 進捗集計処理
export const createProgReport = (id,params) => {
  return client.patch(`/progressreports/${id}/create_report`, params);
}


// Test
//export const getTest = (id) => {
//  return client.get(`/progressreports/${id}`);
//}

