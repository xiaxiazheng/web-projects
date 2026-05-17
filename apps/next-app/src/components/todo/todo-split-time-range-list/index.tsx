import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Space } from "antd";
import { SyncOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { ManipulateType } from "dayjs";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoTreeList from "../todo-tree-list";
import { getShowList } from "../utils";

interface IProps {
    list: any[];
    getData: Function;
    title: string;
    btn?: any;
}

const getTimeRange = (start: number, end: number, type: ManipulateType = "day") => {
    return [dayjs().subtract(start, type), dayjs().subtract(end, type)];
};

export const handleSplitListByTimeRange = (
    list: TodoItemType[],
    isSortTime = false
): Record<string, TodoItemType[]> => {
    const timeRange: Record<string, dayjs.Dayjs[]> = {
        三天内: getTimeRange(0, 3),
        七天内: getTimeRange(3, 7),
        一月内: getTimeRange(7, 30),
        三月内: getTimeRange(1, 3, "month"),
        半年内: getTimeRange(3, 6, "month"),
        一年内: getTimeRange(6, 12, "month"),
        一年前: getTimeRange(1, 10, "year"),
    };
    return Object.keys(timeRange).reduce((prev, cur) => {
        const range = timeRange[cur];
        const l = list.filter((item) => {
            const time = dayjs((isSortTime ? item.cTime : item.mTime) || "2018-01-01");
            return time.isBefore(range[0]) && time.isAfter(range[1]);
        });
        prev[cur] = l;
        return prev;
    }, {} as Record<string, TodoItemType[]>);
};

const TodoSplitTimeRangeList = (props: IProps) => {
    const { list, getData, title, btn } = props;

    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (list) {
            console.log(`list: `, list);
            setMapList(handleSplitListByTimeRange(list || [], isSortTime));
            setTotal(list.length);
        }
    }, [list]);

    const today = dayjs().format("YYYY-MM-DD");

    const [mapList, setMapList] = useState<Record<string, TodoItemType[]>>({});

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
                    {btn}
                </Space>
            </h2>
            <div className={styles.list}>
                {Object.keys(mapList).map((time) => {
                    const list = getShowList(mapList[time], { isSortTime });
                    if (list.length === 0) return null;
                    return (
                        <div key={time}>
                            {/* 日期 */}
                            <div
                                className={`${styles.time} ${
                                    time === today ? styles.today : time < today ? styles.previously : styles.future
                                }`}
                            >
                                {time}
                            </div>
                            {/* 当日 todo */}
                            <div className={styles.one_day}>
                                <TodoTreeList list={list} onRefresh={getData} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TodoSplitTimeRangeList;
