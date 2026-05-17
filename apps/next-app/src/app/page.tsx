'use client';
import Header from "../components/common/header";
import { useEffect } from "react";
import styles from "./page.module.css";
import { message } from "antd";
import { useRouter } from "next/navigation";
import TodoTabs from "./todo-tabs";
import TouchEventComp from "../utils/TouchEventComp";
import VoiceRecorder from "../components/common/voice-recorder";
import { addTodoItem, CreateTodoItemReq } from "@xiaxiazheng/blog-libs";
import dayjs from "dayjs";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            message.warning("请先登录");
        }
    }, [router]);

    const handleVoiceRecognized = async (text: string) => {
        const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const name = `语音 ${timestamp}`;

        const newTodo: CreateTodoItemReq = {
            name,
            description: text,
            time: dayjs().format("YYYY-MM-DD"),
            status: 0,
            color: "0",
            category: "默认",
            doing: "0",
            isNote: "0",
            isBookMark: "0",
            isTarget: "0",
            isWork: "0",
            isDirectory: "0",
            isEncode: "0",
            isFollowUp: "0",
            isShow: "0",
        };

        try {
            const res = await addTodoItem(newTodo);
            if (res && res.resultsCode === "success") {
                message.success("语音 todo 创建成功");
            } else {
                message.error(res?.message || "创建失败");
            }
        } catch (error: any) {
            message.error("创建失败：" + error.message);
        }
    };

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.home}>
                <TodoTabs refreshFlag={0} />
            </main>
            <TouchEventComp />
            <VoiceRecorder onRecognized={handleVoiceRecognized} />
        </div>
    );
}
