import React, { useEffect, useState } from "react";
import { message, DrawerProps, Input, Space } from "antd";
import { getTodoById, getTodoList, TodoItem } from "@xiaxiazheng/blog-libs";
import { TodoItemType, Loading } from "@xiaxiazheng/blog-libs";
import styles from "./index.module.scss";
import DrawerWrapper from "../../../common/drawer-wrapper";

interface IProps extends DrawerProps {
    todo_id: string;
    filterTodoId: string;
    handleChoice: (todo: TodoItemType) => void;
}

const SearchTodoDrawer: React.FC<IProps> = (props) => {
    const { todo_id, filterTodoId, handleChoice } = props;

    const [options, setOptions] = useState<TodoItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // 如果本来就有关联的 todo，就初始化
        if (!options.find((item) => item.todo_id === todo_id) && todo_id) {
            getTodoById(todo_id).then((res) => {
                if (res.data) {
                    setOptions((prev) => [res.data].concat(prev));
                }
            });
        }

        if (!todo_id && options?.length === 0) {
            handleSearch();
        }
    }, [todo_id]);

    // 搜索接口
    const handleSearch = async () => {
        setLoading(true);
        const req: any = {
            keyword,
            pageNo: 1,
            pageSize: 20,
        };
        if (!keyword) {
            req.status = '0';
            req.sortBy = [["isTarget", "DESC"], ["mTime", "DESC"], ["color"]];
        }

        const res = await getTodoList(req);
        if (res) {
            // 前置 todo 不能是自己
            setOptions(res.data.list.filter((item: TodoItemType) => item.todo_id !== filterTodoId));
            setLoading(false);
        } else {
            message.error("获取 todolist 失败");
        }
    };

    const [keyword, setKeyword] = useState<string>();

    return (
        <DrawerWrapper
            className={styles.TodoFormDrawer}
            title={"选择前置todo"}
            destroyOnClose
            {...props}
        >
            {loading && <Loading />}
            <Input
                value={keyword}
                style={{ marginBottom: 10 }}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => {
                    handleSearch();
                }}
            />
            <Space size={8} wrap>
                {options?.map((item) => {
                    return (
                        <div key={item.todo_id} onClick={() => handleChoice(item)}>
                            <TodoItem item={item} keyword={keyword} />
                        </div>
                    );
                })}                
            </Space>
        </DrawerWrapper>
    );
};

export default SearchTodoDrawer;
