import { ReactNode, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, message, Space } from "antd";
import { SyncOutlined, CalendarOutlined } from "@ant-design/icons";
import TodoDayList from "../todo-day-list";

interface IProps {
    list: any[];
    getData: Function;
    title: string;
    isReverse?: boolean;
    btn?: ReactNode;
    search?: ReactNode;
    timeStyle?: Object;
}

const TodoDayListWrapper: React.FC<IProps> = (props) => {
    const { list, getData, title, isReverse = false, btn, search, timeStyle } = props;

    const [isSortTime, setIsSortTime] = useState<boolean>(false);

    return (
        <>
            <h2 className={styles.h2}>
                <span>
                    {title}({list?.length})
                </span>
                <Space size={8}>
                    {btn}
                    {/* 排序方式 */}
                    <Button
                        style={{ width: 50 }}
                        icon={<CalendarOutlined />}
                        onClick={() => {
                            message.info(isSortTime ? '按重要程度排序' : '按修改时间排序', 1);
                            setIsSortTime((prev) => !prev);
                        }}
                        type={isSortTime ? "primary" : "default"}
                    />
                    {/* 刷新列表 */}
                    <Button style={{ width: 50 }} icon={<SyncOutlined />} onClick={() => getData()} type="default" />
                </Space>
            </h2>
            {search}
            <TodoDayList
                list={list}
                getData={getData}
                isSortTime={isSortTime}
                isReverse={isReverse}
                timeStyle={timeStyle}
            />
        </>
    );
};

export default TodoDayListWrapper;
