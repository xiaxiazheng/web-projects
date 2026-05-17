import { getFetch, postFetch } from ".";

export const getMaoList = async (): Promise<any> => {
    return await getFetch(`/maopu/getMaoPuList`);
};

export async function addMaoPu(params: any): Promise<any> {
  const data = await postFetch(`/maopu/addMaoPu`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function updateMaoPu(params: any): Promise<any> {
  const data = await postFetch(`/maopu/updateMaoPu`, params);
  return data && data.resultsCode === 'success' ? true : false;
}