import { getFetch } from '.';

/** 获取后台错误日志 */
export async function getLog() {
  return await getFetch(`/log`);
}