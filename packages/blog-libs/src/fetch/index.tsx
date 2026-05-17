import { message, notification } from "antd";
import { ConcurrentN } from "../utils/concurrentN"; // 这里得用具体路径，不然用 ../ 会有循环依赖

export * from "./blog";
export * from "./cmd";
export * from "./file";
export * from "./folder";
export * from "./home";
export * from "./image";
export * from "./login";
export * from "./logs";
export * from "./mao";
export * from "./media";
export * from "./note";
export * from './settings';
export * from "./tag";
export * from "./todo";
export * from "./translate";
export * from "./tree";
export * from "./treecont";

// console.log('blog-libs process.env', process.env);

const serverUrl =
    process.env.REACT_APP_IS_LocalHost === "yes" ||
    process.env.NEXT_PUBLIC_IS_LOCAL === "YES" ? "http://localhost:300/api" : "https://www.xiaxiazheng.cn/api";
export const staticUrl =
    process.env.REACT_APP_IS_LOCALSTATIC === "yes" ||
    process.env.NEXT_PUBLIC_IS_LOCAL_STATIC === "YES"
        ? "https://www.xiaxiazheng.cn:2333"
        : "https://www.xiaxiazheng.cn/static-server";

// 并发器
const concurrentN = ConcurrentN(4);

export const getFetch = async (path: string): Promise<any> => {
    return await concurrentN.add(() => fetchHelper('get', serverUrl, path));
};

export const postFetch = async (path: string, params: any) => {
    return await concurrentN.add(() => fetchHelper('post', serverUrl, path, params));
};

export const postStaticFetch = async (path: string, params: any) => {
    return await fetchHelper('post', staticUrl, path, params);
};

/** 发请求的辅助函数 */
export const fetchHelper = async (method: 'post' | 'get', url: string, path: string, params?: any): Promise<any> => {
    try {
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const token = localStorage.getItem("token");
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }

        const res: any = await fetch(`${url}${path}`, {
            method,
            headers,
            body: method === 'post' ? JSON.stringify(params) : undefined,
            mode: "cors",
        });

        if (res.status === 401) {
            // 但这里有另一种情况，就是密码错误，这种情况就不需要重试了
            if (path === "/auth/login") {
                message.error(`账号或密码错误`, 1);
                return false;
            }

            // 401 说明 token 失效，尝试用 refresh_token 获取新的 access_token
            if (await handleResponse401(url)) {
                // 重发请求
                return await fetchHelper(method, url, path, params);
            }
        }

        if (res.status === 200 || res.status === 201) {
            if (res) {
                const data = await res.json();
                return data;
            } else {
                return false;
            }
        }

        message.warning(`${res.status}: ${res.statusText}`);
        return false;
    } catch (err: any) {
        handleError(err, url, `${method}Fetch`);
        return false;
    }
};

const handleError = (err: any, url: string, type: 'getFetch' | 'postFetch') => {
    notification.error({
        message: url,
        description: err?.message,
    });
    console.error(`${type} error`, url, err);
}


/**
 * 处理 401 的情况，会尝试用 refresh_token 获取新的 access_token
 * 如果 refresh_token 也失效，重定向到登录页
 *  */
const handleResponse401 = async (host: string) => {
    const res = await getAccessTokenByRefreshToken(host);
    if (res) {
        localStorage.setItem('token', res);
        return true;
    }

    message.warning("401: 登录已过期，请重新登录", 2);
    setTimeout(() => {
        if (location.href.indexOf('/m') !== -1) {
            location.href = `${location.origin}/m/login`;
        } else {
            location.href = `${location.origin}/login`;
        }
    }, 1000);
    return false;
};

/**
 * 尝试用 refresh_token 获取新的 access_token
 */
export const getAccessTokenByRefreshToken = async (host: string) => {
    try {
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const token = localStorage.getItem("refresh_token");
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }

        const res: any = await fetch(`${host}/auth/refresh`, {
            method: "post",
            headers,
            body: JSON.stringify({}),
            mode: "cors",
        });

        if (res.status === 401) {
            // 这个 token 也失效，那就无了，跳转到登录页
            return false;
        }

        if (res.status === 200 || res.status === 201) {
            // 成功则返回新的 access_token
            if (res) {
                const data = await res.json();
                return data?.access_token;
            } else {
                return false;
            }
        }

        message.warning(`${res.status}: refresh_token 失效`);
        return false;
    } catch (err: any) {
        notification.error(err);
        return false;
    }
};
