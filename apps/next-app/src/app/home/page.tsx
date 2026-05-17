'use client';
import Header from "../../components/common/header";
import { useState } from "react";
import styles from "./index.module.scss";
import { Tabs } from "antd";
import MusicPlayerWrapper from "../../components/music-player-wrapper";
import TodoTabs from "../todo-tabs";
import TodoNote from "../../components/todo-note-comp";
import HomeTranslate from "../../components/home-translate";
import TouchEventComp from "../../utils/TouchEventComp";
import type { TabsProps } from 'antd';

interface IProps {
    refreshFlag?: number;
}

export default function Home({ refreshFlag = 0 }: IProps) {
    const [activeKey, setActiveKey] = useState<string>("todo");

    const tabs: TabsProps['items'] = [
        {
            key: 'todo',
            label: 'todo',
            children: <div className={styles.content}>
                <TodoTabs refreshFlag={refreshFlag} contentHeight="calc(100vh - 170px)" />
            </div>
        },
        {
            key: 'todo存档',
            label: 'todo存档',
            children: <div className={styles.content}><TodoNote /></div>
        }, {
            key: 'music',
            label: 'music',
            children: <div className={styles.content}><MusicPlayerWrapper /></div>
        }, {
            key: 'translate',
            label: 'translate',
            children: <div className={styles.content}><HomeTranslate /></div>
        },
    ];

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.home}>
                <Tabs className={styles.tabs} activeKey={activeKey} onChange={(val) => {
                    setActiveKey(val);
                }} items={tabs} />
            </main>
            <TouchEventComp />
        </div>
    );
}
