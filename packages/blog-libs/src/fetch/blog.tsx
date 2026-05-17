import { getFetch, postFetch } from ".";

export const GetBlogList = async (params: any) => {
    return await postFetch(`/blog/getAllBlogList`, params);  
};

export const GetBlogCont = async (id: string) => {
    return await getFetch(`/blog/getBlogcont?id=${id}`);
};

/** 操作日志 */
export async function getAllBlogList(params: any): Promise<any> {
    return await postFetch(`/blog/getAllBlogList`, params);
}

export async function getShowBlogList(params: any): Promise<any> {
    return await postFetch(`/blog/getShowBlogList`, params);
}

export async function isStickBlog(params: any): Promise<any> {
    const res = await postFetch(`/blog/isStickBlog`, params);
    if (res) {
        return res && res.resultsCode === "success" ? true : false;
    } else {
        return false;
    }
}

export async function isShowBlog(params: any): Promise<any> {
    const res = await postFetch(`/blog/isShowBlog`, params);
    if (res) {
        return res && res.resultsCode === "success" ? true : false;
    } else {
        return false;
    }
}

export async function getBlogCont(id: string): Promise<any> {
    return await getFetch(`/blog/getBlogcont?id=${id}`);
}

export async function addBlogCont(params: any): Promise<boolean> {
    return await postFetch(`/blog/addBlogcont`, params);
}

export async function modifyBlogCont(params: any): Promise<string | false> {
    const res = await postFetch(`/blog/modifyBlogcont`, params);
    if (res) {
        return res && res.resultsCode === "success" ? res.message : false;
    } else {
        return false;
    }
}

export async function deleteBlogCont(params: any): Promise<boolean> {
    const res = await postFetch(`/blog/deleteBlogcont`, params);
    if (res) {
        return res && res.resultsCode === "success" ? true : false;
    } else {
        return false;
    }
}

export async function searchBlogList(params: any): Promise<any> {
    return await postFetch(`/blog/searchBlogList`, params);
}
