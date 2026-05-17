'use client';
import { useEffect, useState } from "react";
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { getTodoTarget } from "@xiaxiazheng/blog-libs";
import { Spin } from "antd";
import TodoAllList from "../../components/todo/todo-all-list";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";

interface IProps {
    refreshFlag?: number;
}

export default function TodoListTarget({ refreshFlag = 0 }: IProps) {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const settings = useSettingsContext();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoTarget();
        if (res) {
            const list = res.data.list;
            setTodoList(list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    return (
        <Spin spinning={loading}>
            <Header title={settings?.todoNameMap?.isTarget} />
            <main className={styles.pool}>
                <TodoAllList list={todoList || []} getData={getData} title={settings?.todoNameMap?.isTarget} />
            </main>
        </Spin>
    );
}
