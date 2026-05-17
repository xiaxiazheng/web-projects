import React from "react";
import styles from "./index.module.scss";
import MarkdownShow from "../markdown-show";
import { splitStr } from "@xiaxiazheng/blog-libs";

/**
 * 渲染 todo 的 description 字段
 * 跟 markdown-show 相比，主要是自动分段以及加上了每段的分隔线
*/
interface IProps {
    todoDescription?: string;
    keyword?: string;
}
const TodoDescription:React.FC<IProps> = (props) => {
    const {
        todoDescription,
        keyword = ''
    } = props;
    
    if (!todoDescription) return null;

    return (
        <div className={styles.descList}>
            {todoDescription.split(splitStr).map((s, index) => (
                <div className={styles.desc} key={index}>
                    <MarkdownShow blogcont={s} keyword={keyword} />
                </div>
            ))}
        </div>
    );
};

export default TodoDescription;