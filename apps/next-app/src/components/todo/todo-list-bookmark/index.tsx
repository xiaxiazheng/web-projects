import { useEffect, useState } from "react";
import Header from "../../common/header";
import styles from "./index.module.scss";
import { getTodoBookMark } from "@xiaxiazheng/blog-libs";
import { Spin } from "antd";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoAllList from "../todo-all-list";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";

interface IProps {
    refreshFlag: number;
}

const TodoListBookmark: React.FC<IProps> = ({ refreshFlag }) => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoBookMark();
        if (res) {
            setTodoList(res.data.list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);
    
    const settings = useSettingsContext();

    return (
        <Spin spinning={loading}>
            <Header title={settings?.todoNameMap?.isBookMark} />
            <main className={styles.pool}>
                <TodoAllList list={todoList || []} getData={getData} title={settings?.todoNameMap?.isBookMark} />
            </main>
        </Spin>
    );
};

export default TodoListBookmark;