import { getFetch, postFetch, postStaticFetch } from ".";
import { ImageType } from "../utils/types";

// 项目中使用的稍微拓展过的类型
export interface ImgType extends ImageType {
    imageMinUrl: string;
    imageUrl: string;
}

/** 操作图片 */
/** 用 other_id 获取图片列表 */
export const getImageListByOtherId = async (otherId: string, username: string): Promise<ImageType[] | false> => {
    const res = await getFetch(`/image/getImgListByOtherId?otherId=${otherId}&username=${username}`);
    if (res) {
        return res.data;
    } else {
        return false;
    }
};

// 获取某个类型的图片名称列表
export async function getImgList(
    type: string,
    username: string
): Promise<ImageType[]> {
    const res = await getFetch(`/image/getImgList?type=${type}&username=${username}`);
    if (res) {
        return res && res.resultsCode === "success" ? res.data : [];
    } else {
        return [];
    }
}

export async function getImgListByOtherId(
    otherId: string,
    username: string
): Promise<ImageType[]> {
    const res = await getFetch(
        `/image/getImgListByOtherId?otherId=${otherId}&username=${username}`
    );
    if (res) {
        return res && res.resultsCode === "success" ? res.data : [];
    } else {
        return [];
    }
}

// 获取图片的所有类型
export async function getImgTypeList(username: string): Promise<string[]> {
    const res = await getFetch(`/image/getImgTypeList?username=${username}`);
    if (res) {
        return res && res.resultsCode === "success" ? res.data : [];
    } else {
        return [];
    }
}

export async function switchImgOtherId(params: any): Promise<any> {
    const res = await postFetch(`/switchImgOtherId`, params);
    if (res) {
        return res && res.resultsCode === 'success' ? true : false;
    } else {
        return false;
    }
}


// 删除图片，这个比较特殊要操作图片，要访问静态资源服务
export async function deleteImg(params: any): Promise<boolean> {
    const res = await postStaticFetch(`/api/deleteImg`, params);
    if (res) {
        return res && res.resultsCode === "success" ? true : false;
    } else {
        return false;
    }
}

