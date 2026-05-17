import { useEffect, useState } from "react";
import { TodoItemType } from "../../utils/types";
import { getHomeTodoByDirectoryTodoId, getTodoByDirectoryTodoId, getTodoById } from "../../fetch";
import Loading from "../loading";
import TodoTree, { handleTreeToList } from "../todo-tree";
import { Input } from "antd";
import { handleTodoTreeFilterKeyword } from "../../utils/todo";

interface IProps {
    type?: 'home' | 'all';
    flag?: number;
    categroy_todo_id?: string;
    onClick?: (item?: TodoItemType) => void;
    onKeywordChange?: (keyword?: string) => void;
}

/** home-todo 里列表的封装，包括了取数逻辑，就不用两个项目分别写了 */
const HomeTodoDirectoryChildList: React.FC<IProps> = (props) => {
    const { type = 'home', flag, onClick, categroy_todo_id, onKeywordChange } = props;

    const getHomeTodoCategoryChildData = async (todo_id: string) => {
        setLoading(true);
        try {
            const res = await getHomeTodoByDirectoryTodoId({ todo_id });
            if (res) {
                setTodoList(res.data.list);
                // setTotal(res.data.total);
            }
        } finally {
            setLoading(false);
        }
    }

    const getTodoDirectoryChildData = async (todo_id: string) => {
        setLoading(true);
        try {
            const res = await getTodoByDirectoryTodoId({ todo_id });
            if (res) {
                setTodoList(res.data.list);
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
        if (categroy_todo_id) {
            type === 'home'
                ? getHomeTodoCategoryChildData(categroy_todo_id)
                : getTodoDirectoryChildData(categroy_todo_id);
        }
    }, [categroy_todo_id, flag]);

    const [keyword, setKeyword] = useState<string>();
    useEffect(() => {
        setShowList(handleTodoTreeFilterKeyword(todoList, keyword));
    }, [keyword, todoList]);

    useEffect(() => {
        onKeywordChange?.(keyword);
    }, [keyword, onKeywordChange]);

    if (!categroy_todo_id) {
        return null;
    }

    return (
        <>
            {loading && <Loading />}
            <div style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg_color)' }}>
                <Input.Search
                    style={{ marginBottom: 5 }}
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                />
                {type === 'all'
                    ? <div style={{ display: 'flex', justifyContent: 'center', color: '#ccc', paddingBottom: 5 }}>
                        这里过滤掉了同为类目的子 todo
                    </div>
                    : ''
                }                
            </div>
            <TodoTree
                todoList={showList}
                onClick={(item) => {
                    onClick?.(item);
                }}
                keyword={keyword}
                dataMode="tree"
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

export default HomeTodoDirectoryChildList;