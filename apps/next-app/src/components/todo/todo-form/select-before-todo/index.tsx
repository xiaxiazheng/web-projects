import { Button } from "antd";
import { useEffect, useState } from "react";
import { getTodoById } from "@xiaxiazheng/blog-libs";
import { TodoItemType, TodoItem } from "@xiaxiazheng/blog-libs";
import SearchTodoDrawer from "../search-todo-drawer/index.";

interface IProps {
    value?: any;
    onChange?: Function;
    activeTodo: any;
}

const SelectBeforeTodo: React.FC<IProps> = (props) => {
    const { value, onChange, activeTodo } = props;
    const [visible, setVisible] = useState<boolean>(false);

    const [beforeTodo, setBeforeTodo] = useState<TodoItemType>();

    useEffect(() => {
        if (value && (!beforeTodo || value !== beforeTodo?.todo_id)) {
            getTodoById(value).then((res) => {
                setBeforeTodo(res.data);
            });
        } else {
            setBeforeTodo(undefined);
        }
    }, [value]);

    return (
        <div style={{ color: "white" }}>
            {beforeTodo ? (
                <>
                    <TodoItem item={beforeTodo} keyword="" onClick={() => setVisible(true)} showTime={true} />
                    <Button type="primary" danger onClick={() => onChange?.("")}>
                        删
                    </Button>
                </>
            ) : (
                <Button onClick={() => setVisible(true)}>点击选择前置 todo</Button>
            )}
            <SearchTodoDrawer
                open={visible}
                onClose={() => setVisible(false)}
                todo_id={value}
                filterTodoId={activeTodo?.todo_id}
                handleChoice={(todo) => {
                    onChange?.(todo.todo_id);
                    setVisible(false);
                }}
            />
        </div>
    );
};

export default SelectBeforeTodo;
