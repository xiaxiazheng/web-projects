import React, { useEffect, useState } from "react";
import { TodoItemType, TodoItem, TodoItemProps } from "@xiaxiazheng/blog-libs";
import Tree from "./tree";
import { handleListToTree, handleTreeToList, TodoTreeItemType } from "./utils";

export * from './utils';

export interface TodoTreeProps {
    todoList: TodoItemType[];
    /**
     * flat 的话就是给一个平铺的数组，只展示这些数组的数据，会用这些数据自动组成一棵树
     * tree 的话就是直接展示这个节点以及该节点以下的所有 child 数据，可能不止一层
     */
    dataMode?: "flat" | "tree";
    onClick?: (
        item: TodoItemType,
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => void;
    /** 透传给 todo-item 的 props */
    getTodoItemProps?: (item: TodoItemType) => Partial<TodoItemProps>;
    keyword?: string;
    /** 默认用 TodoItem，也支持拓展替换 */
    TodoItemCompent?: React.FC<TodoItemProps>;
    /** 外部传入，可对树结构进行筛选，筛选规则外面自定义 */
    handleFilterTree?: (list: TodoTreeItemType[]) => TodoTreeItemType[];
}

/** 基于 todo-item 的上层封装，提供树形展示 todo-item 的能力
 * 可自由替换 todoItem 的扩展组件
 * 同样不包含逻辑，纯展示组件 */
const TodoTree: React.FC<TodoTreeProps> = (props) => {
    const {
        todoList,
        dataMode = "flat",
        onClick,
        getTodoItemProps,
        keyword,
        TodoItemCompent,
        handleFilterTree = (list) => list
    } = props;

    const [treeList, setTreeList] = useState<TodoItemType[]>([]);
    useEffect(() => {
        let list: TodoItemType[] = [];
        if (dataMode === "flat") {
            list = todoList;
        }
        if (dataMode === "tree") {
            list = handleTreeToList(todoList);
        }
        setTreeList(handleFilterTree(handleListToTree(list)));
    }, [todoList]);

    // 默认用 TodoItem，也支持拓展替换
    const Comp = TodoItemCompent || TodoItem;

    return (
        <Tree
            treeList={treeList}
            renderTitle={(item) => (
                <Comp
                    item={item}
                    onClick={onClick}
                    keyword={keyword}
                    {...getTodoItemProps?.(item)}
                />
            )}
            renderChildren={(item) => (
                <Comp
                    item={item}
                    onClick={onClick}
                    keyword={keyword}
                    {...getTodoItemProps?.(item)}
                />
            )}
        />
    );
};

export default TodoTree;
