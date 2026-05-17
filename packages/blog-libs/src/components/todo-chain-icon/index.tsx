import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { SwapOutlined, SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";

export const hasChainIcon = (item: TodoItemType) => {
    const isHasChild = item?.child_todo_list_length && item?.child_todo_list_length !== 0;
    const isUp = !!item?.other_id;
    const isDown = !!isHasChild;

    return {
        isUp,
        isDown,
        hasChain: isUp || isDown,
    };
};

export interface TodoChainIconProps {
    item: TodoItemType;
    wrapperStyle?: any;
    title?: string;
    onClick?: (e: any) => void;
}

const TodoChainIcon: React.FC<TodoChainIconProps> = (props) => {
    const {item, wrapperStyle = {}, title, onClick } = props;
    const { isDown, isUp } = hasChainIcon(item);

    if (!isUp && !isDown) {
        return null;
    }
    let Comp: any;

    if (isUp && isDown) {
        Comp = SwapOutlined;
    } else if (isUp) {
        Comp = SwapLeftOutlined;
    } else {
        Comp = SwapRightOutlined;
    }

    return <span>
        <Comp
            className={styles.chainIcon}
            style={{ color: "#1890ff", ...wrapperStyle }}
            title={title}
            onClick={onClick}
        />
        {isDown && <span className={styles.childNumber}>{item?.child_todo_list_length}</span>}
    </span>;
};

export default TodoChainIcon;
