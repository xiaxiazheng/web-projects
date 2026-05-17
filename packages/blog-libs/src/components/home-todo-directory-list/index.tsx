import { useEffect, useState } from "react";
import { TodoItemType } from "../../utils/types";
import { getHomeTodoDirectoryList, getTodoCategoryList } from "../../fetch";
import Loading from "../loading";
import TodoTree, { handleListToTree } from "../todo-tree";
import { Input } from "antd";
import { handleTodoTreeFilterKeyword } from "../../utils/todo";

interface IProps {
    type?: 'home' | 'all';
    flag?: number;
    onClick?: (item: TodoItemType) => void;
}

/** home-todo 里列表的封装，包括了取数逻辑，就不用两个项目分别写了 */
const HomeTodoDirectoryList: React.FC<IProps> = (props) => {
    const { type = 'home', flag, onClick } = props;

    // 获取可见
    const getHomeTodoDirectoryData = async () => {
        setLoading(true);
        try {
            const res = await getHomeTodoDirectoryList();
            if (res) {
                setTodoList(res.data.list);
                // setTotal(res.data.total);
            }
        } finally {
            setLoading(false);
        }
    }

    // 获取全部
    const getTodoCategoryData = async () => {
        setLoading(true);
        try {
            const res = await getTodoCategoryList();
            if (res) {
                setTodoList(handleListToTree(res.data.list, 'child_todo_list'));
                // setTotal(res.data.total);
            }
        } finally {
            setLoading(false);
        }
    }

    const [loading, setLoading] = useState<boolean>(false);
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [showList, setShowList] = useState<TodoItemType[]>([]);

    useEffect(() => {
        type === 'home'
            ? getHomeTodoDirectoryData()
            : getTodoCategoryData();
    }, [flag, type]);

    const [keyword, setKeyword] = useState<string>();
    useEffect(() => {
        setShowList(handleTodoTreeFilterKeyword(todoList, keyword));
    }, [keyword, todoList]);

    return (
        <>
            {loading && <Loading />}
            <Input.Search
                style={{ marginBottom: 5, position: 'sticky', top: 0 }}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
            />
            <TodoTree
                todoList={showList}
                onClick={onClick}
                keyword={keyword}
                dataMode={"tree"}
                getTodoItemProps={() => {
                    return {
                        showDoneStrinkLine: false,
                        showFootPrint: type === 'all',
                        showCanShowInHomeTodoIcon: type === 'all',
                        wrapperStyle: {
                            marginBottom: '12px',
                            cursor: 'pointer',
                        }
                    }
                }}
            />
        </>
    )
}

export default HomeTodoDirectoryList;