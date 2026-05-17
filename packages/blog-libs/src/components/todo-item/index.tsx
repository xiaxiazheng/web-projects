import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { TodoStatus } from "@xiaxiazheng/blog-libs";
import { QuestionCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import TodoCategoryLabel from "../todo-category-label";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { getRangeFormToday, getToday, getTodoTimeDetail, handleKeywordHighlight, judgeIsLastModify } from "../todo-utils";
import TodoChainIcon from "../todo-chain-icon";
import TodoTypeIconList from "./todo-type-icon-list";

export interface TodoItemProps {
    /** 单条 todo 的数据 */
    item: TodoItemType;
    /** 点击事件，点击整个 item 触发 */
    onClick?: (item: TodoItemType, e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    // 需要高亮的关键字
    keyword?: string;
    /** 是否展示todo的时间 */
    showTime?: boolean;
    /** 是否展示todo的时间范围 */
    showTimeRange?: boolean;
    /** 是否展示已完成 todo 的贯穿线 */
    showDoneStrinkLine?: boolean;
    /** style 属性 */
    wrapperStyle?: any;
    /** 是否展示 todo-chain-icon */
    showChainIcon?: boolean;
    /** 是否高亮足迹，这个在游客模式时不需要 */
    showFootPrint?: boolean;
    /** 是否展示 judgeIsCanShowInHomeTodo 的 icon */
    showCanShowInHomeTodoIcon?: boolean;
}

/** 提供最基础的 todo 单条 item 展示的组件，不包含逻辑 */
const TodoItem: React.FC<TodoItemProps> = (props) => {
    const {
        item,
        onClick,
        keyword,
        showTime = false,
        showTimeRange = false,
        showChainIcon = true,
        showDoneStrinkLine = true,
        showFootPrint = true,
        wrapperStyle,
        showCanShowInHomeTodoIcon = true,
    } = props;

    if (!item) return null;

    return (
        <div
            style={wrapperStyle || { marginBottom: 8 }}
            onClick={(e) => onClick && onClick(item, e)}
        >
            <TodoCategoryLabel key={item.todo_id} color={item.color} category={item.category} style={{ verticalAlign: "-1px" }} />
            <TodoTypeIconList item={item} showCanShowInHomeTodoIcon={showCanShowInHomeTodoIcon} />
            <span className={styles.todoItem} style={showFootPrint ? { ...judgeIsLastModify(item.todo_id) } : {}}>
                {showDoneStrinkLine && String(item.status) === String(TodoStatus.done) ? (
                    <s>
                        <Name item={item} isShowTime={showTime} isShowTimeRange={showTimeRange} keyword={keyword} />
                    </s>
                ) : (
                    <span>
                        <Name item={item} isShowTime={showTime} isShowTimeRange={showTimeRange} keyword={keyword} />
                    </span>
                )}
                {/* 详情的icon */}
                {item.description && <QuestionCircleOutlined className={styles.icon} />}
                {/* 图片和文件的 icon */}
                {((item?.imgList && item.imgList?.length !== 0) ||
                    (item.fileList && item.fileList.length !== 0)) && <FileImageOutlined className={styles.icon} />}
                {/* chain 的 icon */}
                {showChainIcon && <TodoChainIcon item={item} />}
            </span>
        </div>
    );
};

const Today = () => getToday().format("YYYY-MM-DD");

const Name: React.FC<{
    item: TodoItemType;
    isShowTime: boolean;
    isShowTimeRange: boolean;
    keyword: string | undefined;
}> = ({ item, isShowTime, isShowTimeRange, keyword }) => {
    return (
        <>
            {handleKeywordHighlight(item.name, keyword)}
            {(isShowTime || item.isTarget === "1") && (
                <span
                    className={`${styles.nameTime} ${item.time === Today()
                        ? 'nameTimeToday'
                        : item.time > Today()
                            ? 'nameTimeFuture'
                            : 'nameTimePreviously'
                        }`}
                >{` (${getTodoTimeDetail(item.time)})`}</span>
            )}
            {isShowTimeRange && (
                <span className={styles.nameTime}>
                    {` (${getRangeFormToday(item.time)})`}
                </span>
            )}
        </>
    );
};

export default TodoItem;
