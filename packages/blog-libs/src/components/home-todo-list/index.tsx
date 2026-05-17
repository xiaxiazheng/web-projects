import { useEffect, useState } from "react";
import { TodoItemType } from "../../utils/types";
import { getHomeTodoList } from "../../fetch";
import Loading from "../loading";
import TodoItem from "../todo-item";
import { Pagination, PaginationProps } from "antd";

interface IProps {
    keyword?: string;
    onClick?: (item: TodoItemType) => void;
    /** 刷新列表用的 flag，数字变化就会重新取数 */
    refreshFlag?: number;
    /** 单独搞这个是因为内部封装了 activeTodo 的状态
     * 除了 click，还有可能因为数据刷新而更新，所以直接数据驱动了
     */
    getActiveTodo?: (item?: TodoItemType | null) => void;
    defaultPageSize?: number;
    PaginationComp?: typeof Pagination;
    paginationProps?: PaginationProps;
}

let lastKeyword: string | undefined = '';
let lastPageSize = 15;
/** home-todo 里列表的封装，包括了取数逻辑，就不用两个项目分别写了 */
const HomeTodoList: React.FC<IProps> = (props) => {
    const { keyword, refreshFlag, onClick, defaultPageSize = 15, getActiveTodo, paginationProps = {} } = props;

    const getHomeTodoData = async () => {
        setLoading(true);
        try {
            const res = await getHomeTodoList({
                pageNo,
                pageSize,
                keyword
            });
            if (res) {
                setTodoList(res.data.list);
                setTotal(res.data.total);
                if (activeTodo) {
                    const todo = res.data.list.find(item => item.todo_id === activeTodo.todo_id);
                    if (todo) {
                        setActiveTodo(todo);
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    }

    const [loading, setLoading] = useState<boolean>(false);
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [total, setTotal] = useState<number>(0);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [activeTodo, setActiveTodo] = useState<TodoItemType | null>(null);

    useEffect(() => {
        getActiveTodo?.(activeTodo);
    }, [activeTodo]);

    const handleSearch = () => {
        // keyword 或 pageSize 变化引起的刷新才需要更改 pageNo
        if ((lastKeyword !== keyword || lastPageSize !== pageSize) && pageNo !== 1) {
            setPageNo(1);
        } else {
            getHomeTodoData();
        }
        lastKeyword = keyword;
        lastPageSize = pageSize;
    }

    useEffect(() => {
        handleSearch();
    }, [pageSize, refreshFlag, pageNo]);

    const Comp = props.PaginationComp || Pagination;

    return (
        <>
            {loading && <Loading />}
            {todoList?.map(item => {
                return (
                    <TodoItem
                        key={item.todo_id}
                        item={item}
                        keyword={keyword}
                        showDoneStrinkLine={false}
                        showFootPrint={false}
                        showCanShowInHomeTodoIcon={false}
                        wrapperStyle={{
                            marginBottom: '12px',
                            cursor: 'pointer',
                        }}
                        onClick={(item) => {
                            setActiveTodo(item);
                            onClick?.(item);
                        }}
                    />
                )
            })}
            <Comp
                current={pageNo}
                pageSize={pageSize}
                total={total}
                onChange={(page, pageSize) => {
                    setPageNo(page);
                    setPageSize(pageSize || 15);
                }}
                pageSizeOptions={["10", "15", "20"]}
                showTotal={() => `${total}`}
                {...paginationProps}
            />
        </>
    )
}

export default HomeTodoList;