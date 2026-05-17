import { getFetch, postFetch } from ".";

/** 操作树 */
export const getAllTreeList = async () => {
    return await getFetch(`/tree/getAllTreeList`);
};

export const modifyNodeContItem = async (params: any) => {
    return await postFetch(`/treeCont/modifyNodeContItem`, params);
};

export async function getShowTreeList(username: string): Promise<any[]> {
  const data = await getFetch(`/tree/getShowTreeList?username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function searchTree(keyword: string): Promise<any[]> {
  const data = await getFetch(`/tree/searchtree?keyword=${keyword}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function getChildName(id: string): Promise<any> {
  const data = await getFetch(`/tree/getchildname?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addTreeNode(params: any): Promise<boolean> {
  const data = await postFetch(`/tree/addtreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyTreeNode(params: any): Promise<boolean> {
  const data = await postFetch(`/tree/modifytreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function deleteTreeNode(params: any): Promise<boolean> {
  const data = await postFetch(`/tree/deletetreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeSort(params: any): Promise<boolean> {
  const data = await postFetch(`/tree/changesort`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeFather(params: any) {
  const data = await postFetch(`/tree/changefather`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function updateIsShow(params: any) {
  const data = await postFetch(`/tree/updateIsShow`, params);
  return data && data.resultsCode === 'success' ? true : false;
}