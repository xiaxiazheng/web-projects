import { TodoItemType } from "../../utils/types";

export interface TodoTreeItemType extends TodoItemType {
    key: string;
    lable: string;
    children: TodoTreeItemType[];
}

// 把平铺的数据变成树, childrenKey 用来指定子属性的键名
export function handleListToTree(prelist: TodoItemType[], childrenKey = 'children'): TodoTreeItemType[] {
    const list = [...prelist];
    const map = list.reduce((prev: any, cur: any) => {
        prev[cur.todo_id] = cur;
        cur[childrenKey] = [];
        return prev;
    }, {});
    const l: TodoTreeItemType[] = [];
    list.forEach((item: any) => {
        item.key = item.todo_id;
        item.label = item.name;
        if (item?.other_id && map[item?.other_id]) {
            map[item?.other_id][childrenKey].push(item);
        } else {
            l.push(item);
        }
    });
    return l;
}

// 把树平铺，把子节点都抽出来
export function handleTreeToList(prelist: TodoItemType[]): TodoItemType[] {
    return prelist?.reduce((prev: TodoItemType[], item: TodoItemType) => {
        return prev
            .concat(item)
            ?.concat(handleTreeToList(item?.child_todo_list || []));
    }, []);
}