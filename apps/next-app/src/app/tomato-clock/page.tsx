'use client';
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { Button, Input, message, Progress, Space } from "antd";
import { useEffect, useState } from "react";
import useCountDown from "../../hooks/useCountDown";
import { calculateTime, playAudio } from "../../components/tomato-clock/utils";
import dayjs from "dayjs";
import { addTodoItem, getTodoList } from "@xiaxiazheng/blog-libs";
import { CreateTodoItemReq, TodoItemType } from "@xiaxiazheng/blog-libs";
// import NoSleep from 'nosleep.js';

// let nosleep: any;

const initialTime = 25;

const renderTime = (time: number) => {
    const t = calculateTime(time);
    return (
        <div className={styles.renderTime}>
            <span>
                {t.hour < 10 && "0"}
                {t.hour}
            </span>
            <span>:</span>
            <span>
                {t.minute < 10 && "0"}
                {t.minute}
            </span>
            <span>:</span>
            <span>
                {t.second < 10 && "0"}
                {t.second}
            </span>
        </div>
    );
};

export default function TomatoClock() {
    const [during, setDuring] = useState<number>(initialTime);

    const [isStart, setIsStart] = useState<boolean>(false);
    const [isCounting, setIsCounting] = useState<boolean>(false);

    const [timeLeft, { start, pause, resume, reset }] = useCountDown(during * 60 * 1000);

    const [target, setTarget] = useState<string>("");

    useEffect(() => {
        // 倒计时结束
        if (isStart && timeLeft === 0) {
            handleFinish();
        }
    }, [timeLeft]);

    const [lastList, setLastList] = useState<string[]>([]);
    useEffect(() => {
        getLastThreeTomatoClock();

        // nosleep = new NoSleep();
    }, []);
    const getLastThreeTomatoClock = async () => {
        const params = {
            keyword: "",
            pageNo: 1,
            pageSize: 3,
            status: 1,
            category: "时钟",
        };
        const res = await getTodoList(params);
        try {
            if (res) {
                const list = res.data.list
                    .map((item: TodoItemType) => {
                        const reg = new RegExp(/倒计时：(\S*)，时长/, "g");
                        return reg.exec(item.name);
                    })
                    .map((match) => match?.[1])
                    .filter((item): item is string => item !== undefined && item !== null);
                setLastList(list);
            } else {
                setLastList([]);
            }
        } catch (e) {
            setLastList([]);
        }
    };

    const handleFinish = async () => {
        playAudio();
        const val: CreateTodoItemReq = {
            category: "时钟",
            color: "3",
            description: "",
            name: `倒计时：${target}，时长 ${during} 分钟`,
            isBookMark: "0",
            isNote: "0",
            isTarget: "0",
            doing: "0",
            other_id: "",
            status: "1",
            isWork: "0",
            isDirectory: "0",
            isEncode: "0",
            isFollowUp: "0",
            isShow: "0",
            time: dayjs().format("YYYY-MM-DD"),
        };
        await addTodoItem(val);
        message.success("倒计时结束啦~~，当前完成已同步到 todo");
        setIsStart(false);
        setIsCounting(false);
    };

    return (
        <>
            <Header title={"番茄时钟"} />
            <main>
                <Space className={styles.content} orientation="vertical" size={30}>
                    {!isCounting ? (
                        <Space orientation="vertical" className={styles.config}>
                            <Input
                                prefix="倒计时时长："
                                suffix="(分钟)"
                                type="number"
                                value={during}
                                onChange={(e) => setDuring(Number(e.target.value))}
                            />
                            <Space className={styles.operator}>
                                <Button type="primary" onClick={() => setDuring(25)}>
                                    25
                                </Button>
                                <Button type="primary" onClick={() => setDuring(60)}>
                                    60
                                </Button>
                                <Button type="primary" onClick={() => setDuring(120)}>
                                    120
                                </Button>
                            </Space>
                            <Input prefix="一句话目标：" value={target} onChange={(e) => setTarget(e.target.value)} />
                            {lastList && lastList?.length !== 0 && (
                                <div className={styles.history} style={{ display: "flex" }}>
                                    <div>历史完成：</div>
                                    <Space orientation="vertical">
                                        {lastList.map((item, index) => (
                                            <Button key={index} onClick={() => setTarget(item)}>
                                                {item}
                                            </Button>
                                        ))}
                                    </Space>
                                </div>
                            )}
                        </Space>
                    ) : (
                        <>
                            {target && <div className={styles.target}>{target}</div>}
                            {renderTime(timeLeft || during * 60 * 1000)}
                            <Progress
                                className={styles.progress}
                                style={{ width: 290 }}
                                percent={((during * 60 * 1000 - timeLeft) / (during * 60 * 1000)) * 100}
                                showInfo={false}
                            />
                        </>
                    )}
                    <Space className={styles.operator}>
                        {!isStart && !isCounting && (
                            <Button
                                onClick={() => {
                                    start();
                                    setIsStart(true);
                                    setIsCounting(true);
                                    // nosleep?.enable();
                                }}
                                size="large"
                                type="primary"
                            >
                                开始
                            </Button>
                        )}
                        {isStart && isCounting && (
                            <Button
                                onClick={() => {
                                    pause();
                                    setIsStart(false);
                                    setIsCounting(true);
                                    // nosleep?.disable();
                                }}
                                style={{ opacity: 0.2 }}
                            >
                                暂停
                            </Button>
                        )}
                        {!isStart && isCounting && (
                            <Button
                                onClick={() => {
                                    resume();
                                    setIsStart(true);
                                    setIsCounting(true);
                                    // nosleep?.enable();
                                }}
                                type="primary"
                            >
                                恢复
                            </Button>
                        )}
                        {!isStart && isCounting && (
                            <Button
                                onClick={() => {
                                    reset();
                                    setIsStart(false);
                                    setIsCounting(false);
                                }}
                                danger
                            >
                                重置
                            </Button>
                        )}
                    </Space>
                </Space>
            </main>
        </>
    );
}
