import { getFetch, postFetch } from '.';

/** 操作节点 */
// 操作子节点内容
export async function getNodeCont(id: any): Promise<any> {
  const data = await getFetch(`/treeCont/cont?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addNodeCont(params: any): Promise<boolean> {
  const data = await postFetch(`/treeCont/addnodecont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyNodeCont(params: any): Promise<any> {
  const data = await postFetch(`/treeCont/modifynodecont`, params);
  return data && data.resultsCode === 'success' ? data.message : false;
}

export async function deleteNodeCont(params: any): Promise<boolean> {
  const data = await postFetch(`/treeCont/deleteNodeCont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeContSort(params: any): Promise<boolean> {
  const data = await postFetch(`/treeCont/changecontsort`, params);
  return data && data.resultsCode === 'success' ? true : false;
}