import Header from "../../common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { getTodo, getTodoList, TodoStatus, TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoDayListWrapper from "../todo-day-list-wrapper";
import dayjs from "dayjs";

interface IProps {
    refreshFlag: number;
}

const TodayBeforeYears: React.FC<IProps> = ({ refreshFlag }) => {
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const getDataByOneDay = async (time: string) => {
        setLoading(true);
        const res = await getTodoList({
            pageNo: 1,
            pageSize: 100,
            startTime: time,
            endTime: time,
            status: TodoStatus.done,
        });
        if (res) {
            setTodoList(prev => prev.concat(res.data.list));
        }
        setLoading(false);
    };

    const getData = () => {
        setTodoList([]);
        let today = dayjs();
        const dayList = [];
        const earliest = dayjs('2018-09-28').subtract(1, 'D');
        while (today.isAfter(earliest)) {
            dayList.push(today.format('YYYY-MM-DD'));
            today = today.subtract(1, 'year');
        }
        setLoading(true);
        Promise.all(dayList.map(item => getDataByOneDay(item))).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    return (
        <Spin spinning={loading}>
            <TodoDayListWrapper
                list={todoList}
                getData={getData}
                title="往年今天"
                isReverse={true}
            />
        </Spin>
    );
};

export default TodayBeforeYears;
