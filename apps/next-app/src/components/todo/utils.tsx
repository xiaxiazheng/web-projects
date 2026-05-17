import { TodoItemType } from "@xiaxiazheng/blog-libs";

// 用于获取单日的 todo 列表的排序
export const getShowList = (list: TodoItemType[], params: { isSortTime: boolean; keyword?: string }) => {
    const { isSortTime, keyword } = params;
    let l = [];
    if (!isSortTime) {
        const sortStatus = (list: TodoItemType[]) => { // 未完成放前面
            return list.filter((item) => item.status !== "1").concat(list.filter((item) => item.status === "1"));
        }
        const sortDoing = (list: TodoItemType[]) => { // doing 放那面
            return list.filter((item) => item.doing === "1").concat(list.filter((item) => item.doing !== "1")); // 这里不用 sort 因为用 sort 会打乱顺序
        }
        // 未完成放前面优先级 > doing 放前面
        l =  sortStatus(sortDoing(list));
    } else {
        l = [...list].sort(
            // sort 会改变原数组
            (a, b) => (b?.mTime ? new Date(b.mTime).getTime() : 0) - (a?.mTime ? new Date(a.mTime).getTime() : 0)
        );
    }

    return !keyword
        ? l
        : l.filter((item) => item.name.indexOf(keyword) !== -1 || item.description.indexOf(keyword) !== -1);
};