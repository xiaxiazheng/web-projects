import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { CalendarOutlined } from "@ant-design/icons";
import TodoTreeList from "../todo-tree-list";
import { getShowList } from "../utils";

interface IProps {
    list: TodoItemType[];
    getData: Function;
    title: string;
}

const TodoAllList = (props: IProps) => {
    const { list, getData, title } = props;

    useEffect(() => {
        if (list) {
            setTodoList(list);
            setTotal(list.length);
        }
    }, [list]);

    const [todoList, setTodoList] = useState<TodoItemType[]>();
    const [total, setTotal] = useState(0);
    const [isSortTime, setIsSortTime] = useState<boolean>(false);

    return (
        <>
            <h2 className={styles.h2}>
                <span>
                    {title}({total})
                </span>
                <Space size={8}>
                    {/* 排序方式 */}
                    <Button
                        style={{ width: 50 }}
                        icon={<CalendarOutlined />}
                        onClick={() => setIsSortTime((prev) => !prev)}
                        type={isSortTime ? "primary" : "default"}
                    />
                    {/* 刷新列表 */}
                    <Button style={{ width: 50 }} icon={<SyncOutlined />} onClick={() => getData()} type="default" />
                </Space>
            </h2>
            {/* 待办 todo 列表 */}
            <div className={styles.list}>
                {todoList && <TodoTreeList list={getShowList(todoList, { isSortTime })} onRefresh={getData} />}
            </div>
        </>
    );
};

export default TodoAllList;
