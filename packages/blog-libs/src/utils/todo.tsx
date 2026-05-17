import {
    AimOutlined,
    BookOutlined,
    BarsOutlined,
    ThunderboltFilled,
    AppleFilled,
    FireFilled,
    StarFilled,
    FieldTimeOutlined,
    CoffeeOutlined,
    EyeFilled,
    HeatMapOutlined
} from '@ant-design/icons';
import { TodoItemType } from './types';

export const TodoIconMap = {
    onlyToday: FieldTimeOutlined,
    life: CoffeeOutlined,
    isTarget: AimOutlined,
    isNote: BookOutlined,
    isDirectory: BarsOutlined,
    doing: ThunderboltFilled,
    isWork: AppleFilled,
    isEncode: HeatMapOutlined,
    isFollowUp: FireFilled,
    isBookMark: StarFilled,
    isShow: EyeFilled
};

/** 新增or编辑todo时用于识别的两种颜色 */
export const OperatorColorMap = {
    add: '#3fc93f',
    edit: "#eeaf3c"
}

// 直接筛选平铺的 todolist
export const handleTodoListFilterKeyword = (l: TodoItemType[], keyword: string | undefined) => {
    const list = [...l];
    if (keyword && keyword !== "") {
        if (keyword.includes(" ")) {
            const kList = keyword.split(" ");
            // 这里得多个关键字都包含才能返回
            return list.filter((item) => {
                return kList.every(
                    (key) =>
                        item.name
                            .toLowerCase()
                            .includes(key.toLowerCase()) ||
                        item.description
                            .toLowerCase()
                            .includes(key.toLowerCase())
                );
            });
        } else {
            return list.filter(
                (item) =>
                    item.name
                        .toLowerCase()
                        .includes(keyword.toLowerCase()) ||
                    item.description
                        .toLowerCase()
                        .includes(keyword.toLowerCase())
            );
        }
    }
    return list;
}

// 筛选 todo tree，如果子节点符合条件，父节点也会保留
export const handleTodoTreeFilterKeyword = (list: TodoItemType[], keyword: string | undefined) => {
    return list.map(item => {
        const childList: TodoItemType[] = handleTodoTreeFilterKeyword(item?.child_todo_list || [], keyword);
        if (handleTodoListFilterKeyword([item], keyword).length > 0 || childList.length > 0) {
            return { // 这里如果不用新对象，就会修改原对象的属性；所以这里才用了 map 和 filter 的组合，而不是直接用 filter
                ...item,
                child_todo_list: childList,
            }
        } else {
            return false;
        }
    }).filter(Boolean) as unknown as TodoItemType[];
}
