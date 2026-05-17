import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, message, Space, Spin, Tabs } from "antd";
import type { TabsProps } from 'antd';
import {
    getTodo,
    getTodoDone,
    getTodoFollowUp,
    getTodoTarget,
    TodoStatus,
    getTodoFootprint,
    TodoItemType,
    TodoTypeIcon,
    useSettingsContext,
} from "@xiaxiazheng/blog-libs";
import TodoDayListWrapper from "../../components/todo/todo-day-list-wrapper";
import TodoTreeList from "../../components/todo/todo-tree-list";
import dayjs from "dayjs";
import SearchHistory, { setHistoryWord } from "../../components/todo/todo-list-search/search-history";
import TodoListDone from "../../components/todo/todo-list-done";
import { EyeFilled, FireFilled } from "@ant-design/icons";
import TodayBeforeYears from "../../components/todo/today-before-years";
import TodoDayList from "../../components/todo/todo-day-list";
import useStorageState from "../../hooks/useStorageState";
import TodoListDirectory from "../../components/todo/todo-list-directory";
import TodoListBookmark from "../../components/todo/todo-list-bookmark";
import TitleWrapper from "./title-wrapper";

interface IProps {
    refreshFlag: number;
    contentHeight?: string;
}

const TodoTabs: React.FC<IProps> = ({ refreshFlag = 0, contentHeight = 'calc(100vh - 110px)' }) => {
    const settings = useSettingsContext();

    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [followUpList, setFollowUpList] = useState<TodoItemType[]>([]);
    const [targetList, setTargetList] = useState<TodoItemType[]>([]);
    const [footprintList, setFootprintList] = useState<TodoItemType[]>([]);
    const [importantList, setImportantList] = useState<TodoItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    // 获取当前 Todo
    const getTodoList = async () => {
        const res = await getTodo(isShowLastXdays ? {
            pageSize: settings?.todoShowBeforeToday?.limit || 500
        } : {});
        if (res) {
            setTodoList(res?.data?.list?.filter((item) => item.isDirectory !== "1"));
        }
    };

    // 获取 targetList
    const getTodoTargetTodoList = async () => {
        const res = await getTodoTarget({
            status: TodoStatus.todo,
        });
        if (res) {
            setTargetList(res.data.list);
        }
    };

    // 获取完成但没结束
    const getTodoFollowUpList = async () => {
        const res = await getTodoFollowUp();
        if (res) {
            setFollowUpList(res.data.list);
        }
    };

    // 获取足迹
    const getTodoFootprintList = async () => {
        const res = await getTodoFootprint({
            pageSize: 10,
        });
        if (res) {
            setFootprintList(res.data.list);
        }
    };

    // 获取已完成的重要 todo
    const getTodoImportantDoneList = async () => {
        const params: any = {
            keyword: "",
            status: TodoStatus.done,
            color: ["0", "1", "2"],
            pageSize: 8,
        };
        const res = await getTodoDone(params);
        if (res) {
            setImportantList(res.data.list.filter((item) => Number(item.color) < 3));
        }
    };

    const [activeKey, setActiveKey] = useState<string>("todo");

    // search 触发更新用的 flag
    const [searchFlag, setSearchFlag] = useState<number>(0);
    const getData = () => {
        const map: any = {
            todo: [getTodoList, getTodoFollowUpList],
            other: [getTodoTargetTodoList, getTodoImportantDoneList, getTodoFootprintList],
        };
        if (map?.[activeKey]) {
            setLoading(true);
            Promise.all(map[activeKey].map((item: () => void | Promise<void>) => item())).finally(() => {
                setLoading(false);
            });
        } else {
            setSearchFlag(searchFlag + 1);
        }
    };

    useEffect(() => {
        if (settings && JSON.stringify(settings) !== '{}') {
            getData();
        }
    }, [refreshFlag, activeKey, settings]);

    const [keyword, setKeyword] = useState<string>("");
    const handleSearch = () => {
        setHistoryWord(keyword);
        !['done', 'directory'].includes(activeKey) && setActiveKey('done');
        setIsShowHistory(false);
        getData();
    };

    /** 是否展现搜索历史词 */
    const [isShowHistory, setIsShowHistory] = useState<boolean>(false);

    const getTodayList = () => {
        return isShowHistory
            ? []
            : todoList.concat(isFollowUp ? followUpList : []).filter((item) => !dayjs(item.time).isAfter(dayjs()));
    };

    const getAfterList = () => {
        return todoList.filter((item) => dayjs(item.time).isAfter(dayjs()));
    };

    const [isFollowUp, updateIsFollowUp] = useStorageState('isFollowUp');
    const [isShowLastXdays, updateIsShowLastXdays] = useStorageState('isShowLastXdays');

    const isUpdate = useRef(false);
    useEffect(() => {
        if (isUpdate.current) {
            setLoading(true);
            getTodoList().finally(() => {
                setLoading(false);
            });
            isUpdate.current = false;
        }
    }, [isShowLastXdays]);

    const tabList: TabsProps['items'] = [
        {
            key: 'todo', label: 'todo', children:
                <div className={styles.content} style={{ height: contentHeight }}>
                    <TodoDayListWrapper
                        list={getTodayList()}
                        getData={getData}
                        title="todo"
                        timeStyle={{ fontSize: 17 }}
                        btn={
                            <>
                                <Button
                                    onClick={() => {
                                        message.info(!isShowLastXdays ? settings?.todoShowBeforeToday?.text : '看所有 todo', 1);
                                        isUpdate.current = true;
                                        updateIsShowLastXdays();
                                    }}
                                    type={isShowLastXdays ? "primary" : "default"}
                                >
                                    {settings?.todoShowBeforeToday?.limit}
                                </Button>
                                <Button
                                    onClick={() => {
                                        message.info(!isFollowUp ? '看 follow up todo' : '不看 follow up todo', 1);
                                        updateIsFollowUp()
                                    }}
                                    type={isFollowUp ? "primary" : "default"}
                                >
                                    <FireFilled />
                                </Button>
                            </>
                        }
                    />
                    {!isShowHistory && (
                        <TitleWrapper title={`之后待办`} list={getAfterList()}>
                            <TodoDayList getData={getData} list={getAfterList()} isReverse />
                        </TitleWrapper>
                    )}
                </div>
        },
        {
            key: 'done', label: 'done', children: <div className={styles.content} style={{ height: contentHeight }}>
                <TodoListDone refreshFlag={refreshFlag + searchFlag} keyword={keyword} setKeyword={setKeyword} />
            </div>
        },
        {
            key: 'directory', label: <><TodoTypeIcon type="isDirectory" style={{ marginRight: 3 }} />directory</>, children:
                <div className={styles.content} style={{ height: contentHeight }}>
                    <TodoListDirectory refreshFlag={refreshFlag + searchFlag} keyword={keyword} />
                </div>
        },
        {
            key: 'mark', label: <><TodoTypeIcon type="isBookMark" style={{ marginRight: 3 }} />mark</>, children:
                <div className={styles.content} style={{ height: contentHeight }}>
                    <TodoListBookmark refreshFlag={refreshFlag} />
                </div>
        },
        {
            key: 'other', label: 'other', children: <div className={styles.content} style={{ height: contentHeight }}>
                {/* target */}
                <TitleWrapper title={settings?.todoNameMap?.isTarget} list={targetList}>
                    <TodoTreeList list={targetList} onRefresh={getData} />
                </TitleWrapper>
                <TitleWrapper title={`已完成的重要todo最近八条`} list={importantList}>
                    <TodoTreeList list={importantList} onRefresh={getData} />
                </TitleWrapper>
                {/* footprint */}
                <TitleWrapper
                    title={`${settings?.todoNameMap?.footprint}最近十条`}
                    list={footprintList}
                >
                    <TodoTreeList list={footprintList} onRefresh={getData} showTime={true} />
                </TitleWrapper>
            </div>
        },
        {
            key: 'before', label: 'before', children:
                <div className={styles.content} style={{ height: contentHeight }}>
                    <TodayBeforeYears refreshFlag={refreshFlag} />
                </div>
        },
    ];

    // const id = useRef<any>(null);
    // const id2 = useRef<any>(null);
    // // const touchEvent = useTouchEvent();
    // useEffect(() => {
    //     id.current = "切换 tab, ->" + Math.random().toFixed(6);
    //     id2.current = "切换 tab, <-" + Math.random().toFixed(6);
    // }, []);

    // useEffect(() => {
    //     // touchEvent?.popList("left", id.current);
    //     // touchEvent?.pushList("left", {
    //     //     id: id.current,
    //     //     handleMoveEnd: () => {
    //     //         if (activeKey) {
    //     //             const i = tabList.findIndex((item) => item.key === activeKey);
    //     //             if (i !== tabList.length - 1) {
    //     //                 setActiveKey(tabList[i + 1].key);
    //     //             } else {
    //     //                 setActiveKey(tabList[0].key);
    //     //             }
    //     //         }
    //     //     },
    //     //     tipsText: "切换 tab, ->",
    //     // });
    //     // touchEvent?.popList("right", id.current);
    //     // touchEvent?.pushList("right", {
    //     //     id: id2.current,
    //     //     handleMoveEnd: () => {
    //     //         if (activeKey) {
    //     //             const i = tabList.findIndex(item => item.key === activeKey);
    //     //             if (i !== 0) {
    //     //                 setActiveKey(tabList[i - 1].key);
    //     //             } else {
    //     //                 setActiveKey(tabList[tabList.length - 1].key);
    //     //             }
    //     //         }
    //     //     },
    //     //     tipsText: "切换 tab, <-",
    //     // });
    // }, [activeKey]);


    return (
        <Spin spinning={loading}>
            <Space>
                <Input.Search
                    className={styles.search}
                    placeholder="输入搜索已完成 todo"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    allowClear
                    enterButton
                    onPressEnter={() => {
                        console.log('onPressEnter', keyword);
                        handleSearch();
                    }}
                    onSearch={() => {
                        console.log('onSearch', keyword);
                        handleSearch();
                    }}
                    onFocus={() => setIsShowHistory(true)}
                    onBlur={() => {
                        // 这个 blur，要等别处的 click 触发后才执行
                        setTimeout(() => setIsShowHistory(false), 100);
                    }}
                />
            </Space>
            {isShowHistory && (
                <SearchHistory
                    onSearch={(key) => {
                        setKeyword(key);
                        handleSearch();
                    }}
                />
            )}
            {!isShowHistory && (
                <Tabs className={styles.todoHome} activeKey={activeKey} onChange={(val) => setActiveKey(val)} items={tabList} />
            )}
        </Spin>
    );
};

export default TodoTabs;

