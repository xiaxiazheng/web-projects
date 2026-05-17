import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { getTodo, getTodoTarget, TodoItemType } from "@xiaxiazheng/blog-libs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Space } from "antd";
import { handleIsTodayPunchTheClock } from "../../todo/todo-form-habit/utils";

interface MsgType {
    type: "todo-list" | "todo-list-habit";
    message: string;
}

const HomeTips: React.FC = (props) => {
    const router = useRouter();
    const [msgList, setMsgList] = useState<MsgType[]>([]);

    const getTodoTips = async (): Promise<MsgType> => {
        const res = await getTodo();
        const list = res && res.data.list.filter((item) => item.time === dayjs().format("YYYY-MM-DD")) || [];
        return {
            type: "todo-list",
            message: list.length !== 0 ? `今日还有 ${list.length} 条 todo 没完成，快去看看` : "",
        };
    };

    const getPunchTheClockTips = async (): Promise<MsgType> => {
        const res = await getTodoTarget();
        let list: TodoItemType[] = [];
        if (res) {
            list = res.data.list
                .filter(item => item.isDirectory === '1')
                .filter((item) => !handleIsTodayPunchTheClock(item))
        }

        return {
            type: "todo-list-habit",
            message: res && list.length !== 0 ? `今日还有 ${list.length} 条任务没有打卡` : "",
        };
    };

    useEffect(() => {
        Promise.all([getPunchTheClockTips()]).then((res) => {
            console.log(res);
            setMsgList(res.filter((item) => item.message !== ""));
        });
    }, []);

    if (msgList.length === 0) return null;

    return (
        <Space orientation="vertical" className={`${styles.HomeTips}`}>
            {msgList.map((item) => {
                return (
                    <div key={item.type} onClick={() => router.push(item.type)}>
                        {item.message}
                    </div>
                );
            })}
        </Space>
    );
};

export default HomeTips;
