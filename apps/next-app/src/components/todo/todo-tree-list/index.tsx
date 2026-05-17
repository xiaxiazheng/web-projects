import { useState } from "react";
import { TodoItemType, TodoTree } from "@xiaxiazheng/blog-libs";
import TodoDetailDrawer from "../todo-detail-drawer";
import { handleTreeToList } from "@xiaxiazheng/blog-libs";

interface IProps {
    list: TodoItemType[];
    onRefresh: Function;
    showTime?: boolean;
    keyword?: string;
    dataMode?: 'flat' | 'tree';
    showDetailDrawer?: boolean;
    onClick?: (item: TodoItemType) => void;
}

/** todo 列表渲染的统一入口 */
const TodoTreeList: React.FC<IProps> = (props) => {
    const {
        list,
        onRefresh,
        showTime = false,
        keyword,
        dataMode = 'flat',
        showDetailDrawer = true,
        onClick
    } = props;

    const [activeId, setActiveId] = useState<string>('');

    return (
        <>
            <TodoTree
                dataMode={dataMode}
                todoList={list}
                onClick={(item) => {
                    setActiveId(item.todo_id);
                    onClick?.(item);
                }}
                keyword={keyword}
                getTodoItemProps={(item) => {
                    return {
                        showTime,
                    }
                }}
            />
            {/* 一个list，对应一个详情弹窗 */}
            {activeId !== '' && showDetailDrawer && <TodoDetailDrawer
                visible={true}
                onClose={() => setActiveId("")}
                activeTodo={handleTreeToList(list).filter(item => item.todo_id === activeId)?.[0]}
                onRefresh={() => onRefresh()}
                keyword={keyword}
            />}
        </>
    );
};

export default TodoTreeList;
