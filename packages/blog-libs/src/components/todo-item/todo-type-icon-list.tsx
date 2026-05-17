import { TodoItemType } from "../../utils/types";
import TodoTypeIcon from "../todo-type-icon";

interface IProps {
    item: TodoItemType;
    showCanShowInHomeTodoIcon?: boolean;
}

const TodoTypeIconList: React.FC<IProps> = props => {
    const { item, showCanShowInHomeTodoIcon = true } = props;
    return (
        <>
            {/* 公司 */}
            {item.isWork === "1" && <TodoTypeIcon type="isWork" style={{ marginRight: 5, color: "#00d4d8", verticalAlign: "middle" }} />}
            {/* 知识目录 */}
            {item.isDirectory === "1" && <TodoTypeIcon type="isDirectory" style={{ marginRight: 5, color: "#ffeb3b", verticalAlign: "middle" }} />}
            {/* 加急 */}
            {item.doing === "1" && <TodoTypeIcon type="doing" style={{ marginRight: 5, color: "red", verticalAlign: "middle" }} />}
            {/* 目标 */}
            {item.isTarget === "1" && <TodoTypeIcon type="isTarget" style={{ marginRight: 5, color: "#ffeb3b", verticalAlign: "middle" }} />}
            {/* 待跟进 */}
            {item.isFollowUp === "1" && <TodoTypeIcon type="isFollowUp" style={{ marginRight: 5, color: "#ffeb3b", verticalAlign: "middle" }} />}
            {/* 存档 */}
            {item.isNote === "1" && <TodoTypeIcon type="isNote" style={{ marginRight: 5, color: "#ffeb3b", verticalAlign: "middle" }} />}
            {/* 书签 */}
            {item.isBookMark === "1" && <TodoTypeIcon type="isBookMark" style={{ marginRight: 5, color: "#ffeb3b", verticalAlign: "middle" }} />}
            {/* HomeTodo 可以看 */}
            {showCanShowInHomeTodoIcon && item.isShow === "1" && <TodoTypeIcon type="isShow" style={{ marginRight: 5, color: "#ffeb3b", verticalAlign: "middle" }} />}
        </>
    )
}

export default TodoTypeIconList;