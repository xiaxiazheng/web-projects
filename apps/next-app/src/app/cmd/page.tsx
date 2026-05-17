'use client';
import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Button, Input, message, Space, Spin } from "antd";
import { addTodoItem, getTodoList } from "@xiaxiazheng/blog-libs";
import useScrollToHook from "../../hooks/useScrollToHooks";
import MyDrawer from "../../components/common/my-drawer";
import dayjs from "dayjs";
import { CreateTodoItemReq } from "@xiaxiazheng/blog-libs";

const { TextArea } = Input;
const placeholder = "-----------";
let timer: any;

export default function CMD() {
    const [cmd, setCmd] = useState<string>("pwd");
    const [result, setResult] = useState<string>(placeholder);
    const [loading, setLoading] = useState<boolean>(false);

    const submit = async () => {
        if (!cmd) return;
        setLoading(true);

        const str = cmd
            .split("\n")
            .filter((item) => !(!item || /^#/.test(item)))
            .join("&&");

        pushResult(`-> ${str}`);

        try {
            sendMsg(
                JSON.stringify({
                    event: "cmd",
                    data: str,
                })
            );
        } finally {
            setLoading(false);
        }
    };

    const sendMsg = (str: string) => {
        ref?.current?.send(str);
    };

    const [list, setList] = useState<any>([]);
    const getScript = async () => {
        setLoading(true);

        const params: any = {
            pageNo: 1,
            pageSize: 100,
            category: "脚本",
            keyword: "",
        };
        const res = await getTodoList(params);
        if (res) {
            setList(res?.data?.list || []);
        }
        setLoading(false);
    };

    const saveScript = async () => {
        if (cmd && cmd !== "") {
            const params: CreateTodoItemReq = {
                category: "脚本",
                name: cmd,
                description: cmd,
                status: 1,
                color: "2",
                doing: "0",
                isNote: "0",
                isTarget: "0",
                isBookMark: "0",
                isWork: "0",
                isDirectory: "0",
                isEncode: "0",
                isFollowUp: "0",
                isShow: "0",
                time: dayjs().format("YYYY-MM-DD"),
            };
            const res = await addTodoItem(params);
            if (res) {
                message.success("保存脚本成功");
                getScript();
            } else {
                message.error("保存脚本失败");
            }
        }
    };

    const pushResult = (str: string) => {
        setResult((prev) => `${prev}\n${str}`);
        // 滚动到底部
        scrollToBottom();
    };

    const ref = useRef<any>(null);

    const resultRef = useRef<any>(null);
    const { scrollToBottom } = useScrollToHook(resultRef);

    // 链接 websocket
    const connectWS = () => {
        const websocket = new WebSocket("wss://www.xiaxiazheng.cn/websocket");
        ref.current = websocket;
        websocket.onopen = function () {
            pushResult(`websocket open`);
            setIsConnect(true);
            startHeartBeat();
        };
        websocket.onclose = function () {
            pushResult(`websocket close`);
            setIsConnect(false);
            stopHeartBeat();
        };
        websocket.onmessage = function (e) {
            // console.log(e);
            pushResult(
                `${JSON.parse(e.data)?.data?.replaceAll(`\\n"`, "").replaceAll(`"`, "").replaceAll("\\n", "\n") || ""}`
            );
            restartTimeout();
        };
    };

    // 心跳保活，30s 发送一次
    const startHeartBeat = () => {
        pushResult(`-> heartbeat`);
        sendMsg(
            JSON.stringify({
                event: "hello",
                data: "heartbeat",
            })
        );
        timer = setTimeout(() => {
            startHeartBeat();
        }, 30 * 1000);
    };
    const stopHeartBeat = () => {
        if (timer) {
            clearTimeout(timer);
        }
    };
    const restartTimeout = () => {
        stopHeartBeat();
        timer = setTimeout(() => {
            startHeartBeat();
        }, 30 * 1000);
    };

    useEffect(() => {
        getScript();
        connectWS();

        return () => {
            stopHeartBeat();
        };
    }, []);

    const [visible, setVisible] = useState<boolean>(false);

    const [isConnect, setIsConnect] = useState<boolean>(false);

    return (
        <div className={styles.cmd}>
            <div>
                <Spin spinning={loading}>
                    <div className={styles.result} ref={resultRef}>
                        {result}
                    </div>
                </Spin>
                <div className={styles.operator}>
                    <Space size={10}>
                        <Button type="primary" onClick={() => submit()}>
                            执行
                        </Button>
                        <Button onClick={() => setResult(placeholder)}>清空</Button>
                    </Space>
                    <Space size={10}>
                        <Button onClick={() => connectWS()} danger={!isConnect}>
                            重连
                        </Button>
                        <Button onClick={() => saveScript()}>保存</Button>
                        <Button onClick={() => setVisible(true)} type="primary">
                            预设
                        </Button>
                    </Space>
                </div>
                <TextArea className={styles.input} value={cmd} onChange={(e) => setCmd(e.target.value)} rows={6} />
                {/* <div style={{ marginTop: 20 }}>结果：</div> */}
            </div>
            <MyDrawer title="预设脚本" open={visible} onCancel={() => setVisible(false)}>
                <div className={styles.script}>
                    {list?.map((item: any) => {
                        return (
                            <div
                                className={styles.scriptItem}
                                key={item.todo_id}
                                onClick={() => {
                                    setCmd(item.description);
                                    setVisible(false);
                                }}
                            >
                                <div style={{ fontWeight: 600, paddingBottom: 5 }}>{item.name}</div>
                                {item.description}
                            </div>
                        );
                    })}
                </div>
            </MyDrawer>
        </div>
    );
}
