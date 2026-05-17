import { getFetch } from ".";

/** 获取七牛云资源 */
export const getMediaList = async () => {
    const data = await getFetch(`/media/getMediaList`);
    return data && data.resultsCode === 'success' ? data.data : [];
};