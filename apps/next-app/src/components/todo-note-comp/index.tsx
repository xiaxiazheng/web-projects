import styles from "./index.module.scss";
import { getTodoList, getTodoCategory, TodoItemType, handleCopy, getTodoTimeDetail, Loading } from "@xiaxiazheng/blog-libs";
import { useEffect, useRef, useState } from "react";
import { Input, Button, Pagination, Radio, Space, message } from "antd";
import { ApartmentOutlined, SyncOutlined } from "@ant-design/icons";
import DrawerWrapper from "../common/drawer-wrapper";
import { useIsWork } from "../../hooks/useIsWork";
import TodoDetailDrawer from "../todo/todo-detail-drawer";
import TodoNoteItem from "./todo-note-item";

const { Search } = Input;

const title = "todo note";

const TodoNoteComp = () => {
    const isWork = useIsWork();

    useEffect(() => {
        getCategory();
    }, [isWork]);

    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const pageSize = 10;
    const [keyword, setKeyword] = useState<string>();

    const [list, setList] = useState<TodoItemType[]>([]);
    const [sortBy, setSortBy] = useState<"mTime" | "time">("time");

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async (props: { isNeedScroll?: boolean } = { isNeedScroll: true }) => {
        setLoading(true);
        const params: any = {
            pageNo,
            pageSize,
            keyword: keyword || "",
            isNote: "1",
            sortBy:
                sortBy === "time"
                    ? [
                        ["time", "DESC"],
                        ["cTime", "DESC"],
                    ]
                    : [["mTime", "DESC"]],
        };
        if (activeCategory !== "所有") {
            params["category"] = activeCategory;
        }
        const res = await getTodoList(params);
        if (res) {
            const data = res.data;
            setList(data.list);
            setTotal(data.total);
            props?.isNeedScroll && handleScrollToTop();
        }
        setLoading(false);
    };

    const handleClick = (item: TodoItemType) => {
        active?.todo_id === item.todo_id ? setActive(undefined) : setActive(item);
    };

    useEffect(() => {
        getData();
    }, [pageNo, sortBy, isWork]);

    const [active, setActive] = useState<TodoItemType>();

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [category, setCategory] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("所有");
    const getCategory = async () => {
        const res: any = await getTodoCategory({ isNote: "1" });
        setCategory(res.data);
    };
    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory]);

    const ref = useRef<any>(null);
    const handleScrollToTop = () => {
        ref?.current?.scroll({
            left: 0,
            top: 0,
            behavior: "smooth",
        });
    };

    const [isChange, setIsChange] = useState<boolean>(false);

    return (
        <>
            <h2 className={styles.h2}>
                <span>
                    {title} ({total})
                </span>
                <Space size={5}>
                    <Button type="primary" onClick={() => setSortBy((prev) => (prev === "time" ? "mTime" : "time"))}>
                        {sortBy === "mTime" ? "按修改倒序" : "按 time 倒序"}
                    </Button>
                    {/* 刷新列表 */}
                    <Button style={{ width: 50 }} icon={<SyncOutlined />} onClick={() => getData({ isNeedScroll: false })} type="default" />
                </Space>
            </h2>
            <div>
                <Search
                    className={styles.search}
                    placeholder="输入搜索"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    enterButton
                    allowClear
                    onSearch={() => {
                        getData();
                    }}
                />
            </div>
            <div className={styles.content} ref={ref}>
                <div className={styles.list}>
                    {list.map((item) => {
                        return (
                            <div key={item.todo_id} onClick={() => handleClick(item)}>
                                <div className={styles.item_time}>{getTodoTimeDetail(item.time)}</div>
                                <div className={styles.list_item}>
                                    <TodoNoteItem
                                        item={item}
                                        isActive={false}
                                        getData={getData}
                                        maxImgCount={2}
                                        descriptionClassName={styles.description}
                                        keyword={keyword}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                {loading && <Loading />}
            </div>
            <Pagination
                className={styles.pagination}
                pageSize={pageSize}
                current={pageNo}
                total={total}
                size="small"
                onChange={(val) => setPageNo(val)}
            />
            <Button
                className={styles.category}
                type="primary"
                danger
                shape="circle"
                size="large"
                icon={<ApartmentOutlined />}
                onClick={() => setShowDrawer(true)}
            />
            {/* 类别抽屉 */}
            <DrawerWrapper open={showDrawer} height="50vh" onClose={() => setShowDrawer(false)} placement="bottom">
                <div style={{ marginBottom: 10 }}>分类：</div>
                <Radio.Group
                    className={styles.content}
                    value={activeCategory}
                    onChange={(e) => {
                        setActiveCategory(e.target.value);
                        setShowDrawer(false);
                    }}
                >
                    <Radio key="所有" value="所有" style={{ marginBottom: 10 }}>
                        所有 ({category?.reduce((prev: number, cur: any) => prev + Number(cur.count), 0)})
                    </Radio>
                    {category?.map((item) => (
                        <Radio key={item.category} value={item.category} style={{ marginBottom: 10 }}>
                            {item.category} ({item.count})
                        </Radio>
                    ))}
                </Radio.Group>
            </DrawerWrapper>
            {/* 详情抽屉 */}
            {active && <TodoDetailDrawer
                activeTodo={active}
                visible={true}
                keyword={keyword}
                onRefresh={(item) => { setIsChange(true); setActive(item); }}
                onClose={() => {
                    setActive(undefined);
                    isChange && getData({ isNeedScroll: false });
                    setIsChange(false);
                }}
                footerConfig={{
                    hideAddBtn: true,
                    hideDoneBtn: true,
                }}
                footer={() => (
                    <Button onClick={() => handleCopy(`${active?.name}\n${active?.description}`)} type="primary">
                        复制内容
                    </Button>
                )}
            />}
        </>
    );
};

export default TodoNoteComp;
