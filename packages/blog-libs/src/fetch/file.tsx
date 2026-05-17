import { getFetch, postFetch, postStaticFetch } from ".";
import { FileType } from "../utils/types";

export interface FType extends FileType {
    fileUrl: string;
}

/** 操作文件 */
// 获取某个类型的文件名称列表
export async function getFileList(type: string, username: string): Promise<FileType[]> {
    const res = await getFetch(`/file/getFileList?type=${type}&username=${username}`);
    if (res) {
        return res && res.resultsCode === 'success' ? res.data : [];
    } else {
        return [];
    }
}

export const getFileListByOtherId = async (otherId: string, username: string): Promise<FileType[] | boolean> => {
    const res = await getFetch(`/file/getFileListByOtherId?otherId=${otherId}&username=${username}`);
    if (res) {
        return res.data;
    } else {
        return false;
    }
};

export async function switchFileOtherId(params: any): Promise<any> {
    const res = await postFetch(`/file/switchFileOtherId`, params);
    return res && res.resultsCode === 'success' ? true : false;
}


// 删除图片，这个比较特殊要操作图片，要访问静态资源服务去删除文件
export async function deleteFile(params: any): Promise<boolean> {
    const res = await postStaticFetch(`/api/deleteFile`, params);
    return res && res.resultsCode === 'success' ? true : false;
}
