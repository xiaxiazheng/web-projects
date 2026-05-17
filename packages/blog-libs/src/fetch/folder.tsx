import { getFetch, postFetch } from ".";

/** 操作文件夹 */
// 获取文件夹
export const getFolder = async (parentId: string, username: string) => {
    return await getFetch(`/folder/getFolder?parentId=${parentId}&username=${username}`);
};

// 新增文件夹
export const addFolder = async (params: any) => {
    return await postFetch(`/folder/addFolder`, params);
};

// 获取所有文件夹（树状）
export async function getAllFolder(username: string): Promise<any> {
    const res = await getFetch(`/folder/getAllFolder?username=${username}`);
    if (res) {
        return res && res.resultsCode === "success" ? res.data : false;
    } else {
        return false;
    }
}

// 文件夹改名
export async function updateFolderName(params: any): Promise<any> {
    const res = await postFetch(`/folder/updateFolderName`, params);
    if (res) {
        return res && res.resultsCode === "success" ? res : false;
    } else {
        return false;
    }
}

// 切换文件夹父节点
export async function switchFolderParent(params: any): Promise<any> {
    const res = await postFetch(`/folder/switchFolderParent`, params);
    if (res) {
        return res && res.resultsCode === 'success' ? true : false;
    } else {
        return false;
    }
}

// 删除文件夹
export async function deleteFolder(params: any): Promise<any> {
    const res = await postFetch(`/folder/deleteFolder`, params);
    if (res) {
        return res && res.resultsCode === "success" ? res : false;
    } else {
        return false;
    }
}
