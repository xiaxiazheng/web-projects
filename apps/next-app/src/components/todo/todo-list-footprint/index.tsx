import { useEffect, useState } from "react";
import Header from "../../../components/common/header";
import styles from "./index.module.scss";
import { getTodoFootprint } from "@xiaxiazheng/blog-libs";
import { Button, Space, Spin } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import dayjs from "dayjs";
import TodoTreeList from "../../../components/todo/todo-tree-list";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";

// 如果是今天的，就不展示日期，只展示时间
const handleTime = (time: string) => {
    return dayjs(time).isSame(dayjs(), "d") ? time.split(" ")?.[1] : time;
};

interface NewTodoItemType extends TodoItemType {
    edit_time: string;
}

interface IProps {
}

const TodoFootprint: React.FC<IProps> = () => {
    const [todoList, setTodoList] = useState<NewTodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);
    
    const settings = useSettingsContext();

    const getData = async () => {
        setLoading(true);
        const res = await getTodoFootprint();
        if (res) {
            const list = res.data.list;
            setTodoList(
                list.map((item: TodoItemType) => {
                    return {
                        ...item,
                        edit_time: item.mTime || item.cTime || '',
                    };
                })
            );
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Spin spinning={loading}>
            <Header title={settings?.todoNameMap?.footprint} />
            <main className={styles.pool}>
                <h2 className={styles.h2}>
                    <span>{settings?.todoNameMap?.footprint}({todoList?.length})</span>
                    <Space size={8}>
                        {/* 刷新列表 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<SyncOutlined />}
                            onClick={() => getData()}
                            type="default"
                        />
                    </Space>
                </h2>
                <Space className={`${styles.content} ScrollBar`} orientation="vertical" size={5}>
                    {todoList?.map((item) => {
                        return (
                            <div key={item.todo_id} className={styles.item}>
                                <div className={styles.time}>{handleTime(item.edit_time)}</div>
                                <TodoTreeList list={[item]} onRefresh={getData} />
                            </div>
                        );
                    })}
                </Space>
            </main>
        </Spin>
    );
};

export default TodoFootprint;
