import client from './client';

// 一覧（条件：prog,level,phase）
export const getEvmsByConditional = (prog_id, level, phase_id) => {
  return client.get(`/evms/index_by_conditional?prog=${prog_id}&level=${level}&phase=${phase_id}`);
}
