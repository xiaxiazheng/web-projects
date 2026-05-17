import { useState, useEffect, useRef } from "react";
import { Space, Button } from "antd";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { getTodoTimeDetail } from "@xiaxiazheng/blog-libs";

const btnList = [
    { label: "Yesterday", value: dayjs().subtract(1, "day").format("YYYY-MM-DD") },
    { label: "Today", value: dayjs().format("YYYY-MM-DD") },
    { label: "Tomorrow", value: dayjs().add(1, "day").format("YYYY-MM-DD") },
];

const TimePicker = ({ value, onChange, time }: any) => {
    return (
        <Space className={styles.timepicker} wrap>
            <Button onClick={() => onChange(dayjs(value).subtract(1, "day").format("YYYY-MM-DD"))}>-1d</Button>
            <span className={styles.time}>{getTodoTimeDetail(value)}</span>
            <Button onClick={() => onChange(dayjs(value).add(1, "day").format("YYYY-MM-DD"))}>+1d</Button>
            {btnList.map((item) => (
                <Button
                    key={item.label}
                    className={
                        value === item.value
                            ? item.label === "Yesterday"
                                ? styles.Yesterday
                                : item.label === "Today"
                                ? styles.Today
                                : item.label === "Tomorrow"
                                ? styles.Tomorrow
                                : ""
                            : ""
                    }
                    onClick={() => onChange(item.value)}
                >
                    {item.label}
                </Button>
            ))}
            {time && <Button onClick={() => onChange(time)}>{time}</Button>}
        </Space>
    );
};

export default TimePicker;
