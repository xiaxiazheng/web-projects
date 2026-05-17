import { postFetch } from ".";

export const getTranslate = async (keyword: string) => {
    const params = {
        keyword
    }
    return await postFetch(`/translate/translate`, params);
};

export const getTranslateList = async (params: {
    keyword?: string,
    pageNo: number,
    pageSize?: number
    isMark?: number
}) => {
     return await postFetch(`/translate/getTranslateList`, params);
};

export const switchTranslateMark = async (translate_id: string, isMark: number) => {
    const params = {
        translate_id,
        isMark
    };
     return await postFetch(`/translate/switchTranslateMark`, params);
};

export const deleteTranslateItem = async (translate_id: string) => {
    const params = {
        translate_id
    };
     return await postFetch(`/translate/deleteTranslateItem`, params);
};
