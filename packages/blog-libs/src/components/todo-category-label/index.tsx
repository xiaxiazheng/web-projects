import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";

interface Props {
    color: string;
    category: string;
    style?: any;
}

/**  todo-item 最前边的分类标签 */
const TodoCategoryLabel: React.FC<Props> = (props) => {
    const { color = "", category = "", style = {} } = props;
    const { todoColorMap } = useSettingsContext();
    
    const todoColor = todoColorMap?.[color] || "#827e7e";

    return (
        <span
            className={styles.category}
            style={{
            border: `1px solid ${todoColor}`,
            color: todoColor,
            ...style,
        }}
        >
            {category}
        </span>
    );
};

export default TodoCategoryLabel;
