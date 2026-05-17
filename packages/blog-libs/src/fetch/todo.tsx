import { useEffect } from "react";
import { getFetch, postFetch } from ".";
import { CreateTodoItemReq, EditTodoItemReq, TodoItemType, TodoStatus } from "../utils/types";

export interface TodoRes {
    data: { list: TodoItemType[]; total: number };
}

export const getIsWork = () => {
    try {
        if (localStorage.getItem("WorkOrLife")) {
            return localStorage.getItem("WorkOrLife");
        }
    } catch(e) {
        console.log('localStorage error')
        return ""
    }
    return "";
};

export const getTodo = async (param: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        status: TodoStatus.todo,
        isTarget: "0",
        isBookMark: "0",
        isFollowUp: "0",
        pageSize: 300,
        sortBy: [["time", "DESC"], ["color"], ["isWork", "DESC"], ["category"]],
        ...param,
    };

    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    return await postFetch(`/todo/getTodoList`, params);
};

export const getTodoById = async (todo_id: string, isFindAllLevelChild: boolean = false) => {
    return await getFetch(
        `/todo/getTodoById?todo_id=${todo_id}${
            isFindAllLevelChild ? `&isFindAllLevelChild=${isFindAllLevelChild}` : ""
        }`
    );
};

/** 获取所有前置 todo，根据 other_id 一路往上查 */
export async function getTodoChainById(todo_id: string): Promise<any> {
    return await getFetch(`/todo/getTodoChainById?todo_id=${todo_id}`);
}

export const getTodoList = async (params: any): Promise<TodoRes | false> => {
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    return await postFetch(`/todo/getTodoList`, params);
};

export const getTodoDone = async (obj: any): Promise<TodoRes | false> => {
    const { status, keyword, pageNo, category, ...rest } = obj;
    const params = {
        keyword,
        pageNo,
        ...rest,
    };
    if (status) {
        params["status"] = status;
    }
    if (category) {
        params["category"] = category;
    }
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    return await postFetch(`/todo/getTodoList`, params);
};

export const getTodoFollowUp = async () => {
    const params: any = {
        isFollowUp: "1",
        pageNo: 1,
        pageSize: 60,
        // status: TodoStatus["todo"],
    };

    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    return await postFetch(`/todo/getTodoList`, params);
};

export const getTodoBookMark = async (): Promise<TodoRes | false> => {
    const params: any = {
        isBookMark: "1",
        pageNo: 1,
        pageSize: 300,
    };
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    return await postFetch(`/todo/getTodoList`, params);
};

export const getTodoHabit = async (obj: any = {}): Promise<TodoRes | false> => {
    const { status, ...rest } = obj;
    const params: any = {
        isDirectory: "1",
        pageNo: 1,
        pageSize: 60,
        ...rest
    };
    if (typeof status === "number") {
        params["status"] = status;
    }
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    return await postFetch(`/todo/getTodoList`, params);
};

export const getTodoTarget = async (obj: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        isTarget: "1",
        pageNo: 1,
        pageSize: 60,
        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
    };
    const { status } = obj;
    if (typeof status === "number") {
        params["status"] = status;
    }
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    return await postFetch(`/todo/getTodoList`, params);
};

export const getTodoFootprint = async (rest: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        pageNo: 1,
        pageSize: 30,
        sortBy: [["mTime", "DESC"]],
        ...rest,
    };
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    return await postFetch(`/todo/getTodoList`, params);
};

export const getTodoCategory = async (params?: { isNote?: string, isWork?: string }) => {
    const isWork = getIsWork();
    return await getFetch(
        `/todo/getTodoCategory?${params?.isNote ? `isNote=${params.isNote}&` : ""}${isWork ? `isWork=${params?.isWork || isWork}` : ""}`
    );
};

export const addTodoItem = async (params: CreateTodoItemReq) => {
    return await postFetch(`/todo/addTodoItem`, params);
};

export const editTodoItem = async (params: EditTodoItemReq) => {
    return await postFetch(`/todo/editTodoItem`, params);
};

export const doneTodoItem = async (params: { todo_id: string }) => {
    return await postFetch(`/todo/doneTodoItem`, params);
};

export async function getTodoByIdList(params: any): Promise<any> {
    const data = await postFetch(`/todo/getTodoByIdList`, params);
    return data && data.resultsCode === "success" ? data : false;
}

export async function getTodoDoneCountList(params: any): Promise<any> {
    const data = await postFetch(`/todo/getTodoDoneCountList`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 删除 todo */
export async function deleteTodoItem(params: any): Promise<any> {
    const data = await postFetch(`/todo/deleteTodoItem`, params);
    return data && data.resultsCode === "success" ? data : false;
}

// 批量修改 todo 的 Category
export async function modifyTodoCategory(params: { category: string, newCategory: string }): Promise<any> {
    const data = await postFetch(`/todo/modifyTodoCategory`, params);
    return data && data.resultsCode === "success" ? data : false;
}