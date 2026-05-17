import styles from "./index.module.scss";
import { getTodoDone, getTodoCategory, TodoStatus, formatArrayToTimeMap, getRangeFormToday, getWeek } from "@xiaxiazheng/blog-libs";
import { useEffect, useReducer, useState } from "react";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import dayjs from "dayjs";
import { Button, Spin, Space, Checkbox } from "antd";
type CheckboxValueType = string | number | boolean;
import { SyncOutlined } from "@ant-design/icons";
import { getShowList } from "../utils";
import { CalendarOutlined, ClearOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import TodoTreeList from "../todo-tree-list";
import DrawerWrapper from "../../common/drawer-wrapper";
import { debounce } from "lodash";
import TodoPagination from "../todo-pagination";

interface IProps {
    refreshFlag: number;
    keyword?: string;
    setKeyword?: Function;
}

const TodoListDone: React.FC<IProps> = ({ refreshFlag, keyword, setKeyword }) => {
    const [todoMap, setTodoMap] = useState<{ [k in string]: TodoItemType[] }>({});
    const [total, setTotal] = useState(0);

    const [, forceUpdate] = useReducer((prev) => {
        return prev + 1;
    }, 0);
    const [pageNo, setPageNo] = useState<number>(1);

    const [loading, setLoading] = useState<boolean>(false);

    const [startTime, setStartTime] = useState<string>("");

    const getData = debounce(async (key?: string) => {
        getCategory();
        setLoading(true);
        const params: any = {
            keyword: key || keyword,
            pageNo,
            category: activeCategory as string[],
            status: TodoStatus.done,
        };
        if (startTime !== "") {
            params["startTime"] = startTime;
            params["endTime"] = startTime;
        }
        const res = await getTodoDone(params);
        if (res) {
            setTotal(res.data.total);
            setTodoMap(formatArrayToTimeMap(res.data.list));
        }
        setLoading(false);
    }, 200);

    useEffect(() => {
        refreshFlag && getData();
    }, [refreshFlag]);

    useEffect(() => {
        getData();
    }, [pageNo]);

    const today = dayjs().format("YYYY-MM-DD");

    const [isSortTime, setIsSortTime] = useState<boolean>(false);

    const [showDrawer, setShowFilter] = useState<boolean>(false);
    const [category, setCategory] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<CheckboxValueType[]>([]);
    const getCategory = debounce(async () => {
        const res: any = await getTodoCategory();
        setCategory(res.data);
    }, 200);
    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory, startTime]);

    return (
        <Spin spinning={loading}>
            <h2 className={styles.h2}>
                <span>{total}条结果</span>
                <Space size={8}>
                    {((keyword && keyword !== '') || startTime !== "" || activeCategory.length !== 0) && (
                        <Button
                            style={{ width: 50 }}
                            icon={<ClearOutlined />}
                            onClick={() => {
                                setKeyword?.();
                                setActiveCategory([]);
                                forceUpdate();
                                startTime === "" ? getData() : setStartTime("");
                            }}
                            type={"primary"}
                            danger
                        />
                    )}
                    {/* 筛选 */}
                    <Button onClick={() => setShowFilter(true)}>Filter</Button>
                    {/* 排序方式 */}
                    <Button
                        style={{ width: 50 }}
                        icon={<CalendarOutlined />}
                        onClick={() => setIsSortTime((prev) => !prev)}
                        type={isSortTime ? "primary" : "default"}
                    />
                    {/* 刷新列表 */}
                    <Button style={{ width: 50 }} icon={<SyncOutlined />} onClick={() => getData()} type="default" />
                </Space>
            </h2>
            {/* 搜索框 */}
            <div>
                {(activeCategory.length !== 0) && (
                    <Space size={8} style={{ paddingBottom: 4 }}>
                        <span>已筛选：</span>
                        {activeCategory.length !== 0 && (
                            <>
                                {activeCategory.map((item) => (
                                    <Button
                                        key={item as string}
                                        size="small"
                                        type="primary"
                                        onClick={() => setActiveCategory((prev) => prev.filter((i) => i !== item))}
                                    >
                                        {item}
                                    </Button>
                                ))}
                            </>
                        )}
                    </Space>
                )}
            </div>
            {startTime && (
                <Space size={16} className={styles.timeControl}>
                    <Button
                        icon={<MinusOutlined />}
                        onClick={() => setStartTime(dayjs(startTime).subtract(1, "d").format("YYYY-MM-DD"))}
                    />
                    {startTime}
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => setStartTime(dayjs(startTime).add(1, "d").format("YYYY-MM-DD"))}
                    />
                </Space>
            )}
            <div className={styles.list}>
                {Object.keys(todoMap).map((time) => (
                    <div key={time}>
                        {/* 日期 */}
                        <div
                            className={`${styles.time} ${
                                time === today ? styles.today : time < today ? "" : styles.future
                            }`}
                        >
                            <span
                                onClick={() => {
                                    const date = dayjs(time).format("YYYY-MM-DD");
                                    setStartTime(date);
                                    setKeyword?.();
                                }}
                            >
                                {time} ({getWeek(time)}，{getRangeFormToday(time)})&nbsp;
                                {todoMap[time]?.length > 5 ? ` ${todoMap[time]?.length}` : null}
                            </span>
                        </div>
                        {/* 当日的 todo */}
                        <div className={styles.one_day}>
                            <TodoTreeList
                                list={getShowList(todoMap[time], { isSortTime })}
                                onRefresh={getData}
                                keyword={keyword}
                            />
                        </div>
                    </div>
                ))}
                {Object.keys(todoMap)?.length === 0 && <div className={styles.noResult}>无搜索结果</div>}
            </div>
            <TodoPagination
                className={styles.pagination}
                pageSize={15}
                current={pageNo}
                total={total}
                size="small"
                onChange={(val) => setPageNo(val)}
            />
            {/* 分类弹窗 */}
            <DrawerWrapper open={showDrawer} onClose={() => setShowFilter(false)} placement="bottom" height="70vh">
                <div style={{ marginBottom: 10 }}>分类：</div>
                <Checkbox.Group
                    className={styles.checkbox}
                    value={activeCategory}
                    onChange={(e) => {
                        setActiveCategory(e);
                        setShowFilter(false);
                    }}
                >
                    {category?.map((item) => (
                        <Checkbox key={item.category} value={item.category} style={{ marginBottom: 10 }}>
                            {item.category} ({item.count})
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            </DrawerWrapper>
        </Spin>
    );
};

export default TodoListDone;
