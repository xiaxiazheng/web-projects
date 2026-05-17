import { ReactNode, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { editTodoItem, formatArrayToTimeMap, getRangeFormToday, getWeek } from "@xiaxiazheng/blog-libs";
import { Button, message, Space } from "antd";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import MyModal from "../../common/my-modal";
import { getShowList } from "../utils";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoTreeList from "../todo-tree-list";

interface IProps {
    list: any[];
    getData: Function;
    isReverse?: boolean;
    timeStyle?: Object;
    isSortTime?: boolean;
}

const TodoDayList: React.FC<IProps> = (props) => {
    const { list, getData, isReverse = false, isSortTime = false } = props;

    const [todoMap, setTodoMap] = useState<{ [k in string]: TodoItemType[] }>({});

    useEffect(() => {
        if (list) {
            setTodoMap(formatArrayToTimeMap(list));
        }
    }, [list]);

    const today = dayjs().format("YYYY-MM-DD");

    // 把过期任务的日期调整成今天
    const [showChangeExpire, setShowChangeExpire] = useState<boolean>(false);
    const [changeExpireList, setChangeExpireList] = useState<TodoItemType[]>();
    const handleChangeExpire = (todoList: TodoItemType[]) => {
        setChangeExpireList(todoList);
        setShowChangeExpire(true);
    };
    const changeExpireToToday = async () => {
        if (!changeExpireList || changeExpireList.length === 0) {
            return;
        }
        const promiseList = changeExpireList.map((item) => {
            return editTodoItem({
                ...item,
                time: dayjs().format("YYYY-MM-DD"),
            });
        });
        const res = await Promise.all(promiseList);
        if (res) {
            message.success(`Todo 日期调整成功`);
            getData();
            setShowChangeExpire(false);
        }
    };

    return (
        <>
            <div className={styles.list}>
                {(isReverse ? Object.keys(todoMap).sort() : Object.keys(todoMap).sort().reverse()).map((time) => (
                    <div key={time}>
                        {/* 日期 */}
                        <div
                            className={`${styles.time} ${
                                time === today ? styles.today : time < today ? styles.previously : styles.future
                            }`}
                            style={props.timeStyle || {}}
                        >
                            <span>
                                {time} ({getRangeFormToday(time)}, {getWeek(time)})
                                {todoMap[time]?.length > 5 ? ` ${todoMap[time]?.length}` : null}
                            </span>
                            {time < today && (
                                <Button
                                    size="small"
                                    title="调整日期"
                                    icon={<VerticalAlignTopOutlined />}
                                    onClick={() => handleChangeExpire(todoMap[time])}
                                    type="primary"
                                />
                            )}
                        </div>
                        {/* 当日 todo */}
                        <div className={styles.one_day}>
                            <TodoTreeList list={getShowList(todoMap[time], { isSortTime })} onRefresh={getData} />
                        </div>
                    </div>
                ))}
            </div>
            {/* 批量调整过期 todo 日期的弹窗 */}
            <MyModal
                visible={showChangeExpire}
                title={"调整日期"}
                onOk={() => changeExpireToToday()}
                onCancel={() => {
                    setShowChangeExpire(false);
                }}
            >
                是否将 {changeExpireList?.[0].time} 的 Todo 日期调整成今天
            </MyModal>
        </>
    );
};

export default TodoDayList;
