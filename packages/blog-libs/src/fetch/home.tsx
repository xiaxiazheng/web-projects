import { postFetch, TodoRes } from ".";

/**
 * 这里的接口都是不需要鉴权的 
 */

/** 获取可见列表 */
export const getHomeTodoList = async (param: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        sortBy: [["time", "DESC"], ["color"], ["isWork", "DESC"], ["category"]],
        ...param,
    };

    return await postFetch(`/todo/getHomeTodoList`, params);
};

/** 获取可见的 categoryList，知识目录列表 */
export const getHomeTodoDirectoryList = async (param: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        sortBy: [["time", "DESC"], ["color"], ["isWork", "DESC"], ["category"]],
        ...param,
    };

    return await postFetch(`/todo/getHomeTodoDirectoryList`, params);
};

/** 根据类目 id，获取其下的 todo_id, 过滤掉了类目和不可见的子 todo */
export const getHomeTodoByDirectoryTodoId = async (params: { todo_id: string }): Promise<TodoRes | false> => {
    if (!params?.todo_id) {
        return false;
    }

    return await postFetch(`/todo/getHomeTodoByDirectoryTodoId`, params);
};

/** 获取 categoryList，知识目录列表 */
export const getTodoCategoryList = async (param: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        isDirectory: "1",
        sortBy: [["time", "DESC"], ["color"], ["isWork", "DESC"], ["category"]],
        pageSize: 200,
        ...param,
    };

    return await postFetch(`/todo/getTodoList`, params);
};

/** 根据类目 id，获取其下的 todo_id, 过滤掉了类目 */
export const getTodoByDirectoryTodoId = async (params: { todo_id: string }): Promise<TodoRes | false> => {
    if (!params?.todo_id) {
        return false;
    }

    return await postFetch(`/todo/getTodoByDirectoryTodoId`, params);
};