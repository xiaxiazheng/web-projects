import { useEffect, useState } from "react";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoFormDrawer from "../todo-form-drawer";
import TodoDetailDrawer from "../todo-detail-drawer";
import { OperatorType } from "../types";

interface Props {
    operatorType?: 'add' | 'copy' | 'progress';
    /** 在 copy 和 progerss 时用的模板 todo 的 todo_id，普通的 add 不需要这个 */
    template_todo_id?: string;
    renderChildren: (props: { onClick: Function }) => any;
    /** 在新增完之后，关闭 TodoDetailDrawer 时触发 */
    onClose?: Function;
}

/** 除了用在全局用于新增全新的 todo
 * 也会用在 todo-detail-drawer 里，用于新建子 todo
 * 新建后会变成编辑模式，而且自带该 todo 的 detail-drawer 和 todo-form
 */
function AddTodoHoc(props: Props) {
    const {
        operatorType = 'add',
        template_todo_id,
        renderChildren,
        onClose
    } = props;
    const [showAddTodo, setShowAddTodo] = useState<boolean>(false);
    const [newTodo, setNewTodo] = useState<TodoItemType>();
    const [showDetail, setShowDetail] = useState<boolean>(false);

    /** 三种方式新增的 todo 会留存在这里，新增或变成编辑，同时也有新的 todo_id */
    const [localOperatorType, setLocalOperatorType] = useState<OperatorType>(operatorType);
    const [localTodoId, setLocalTodoId] = useState<string>(template_todo_id || '');
    useEffect(() => {
        setLocalOperatorType(operatorType);
        setLocalTodoId(template_todo_id || '');
    }, [template_todo_id, operatorType]);

    return (
        <>
            {renderChildren({
                onClick: () => {
                    setShowAddTodo(true);
                    // 每次点击新增，都要重置 local 保存的状态
                    setLocalOperatorType(operatorType);
                    setLocalTodoId(template_todo_id || '');
                }
            })}
            <TodoFormDrawer
                placement="bottom"
                template_todo_id={localTodoId}
                operatorType={localOperatorType}
                open={showAddTodo}
                onClose={() => {
                    setShowAddTodo(false);
                    setShowDetail(true);
                    setLocalTodoId('');
                    onClose?.();
                }}
                onSubmit={(val: TodoItemType) => {
                    setNewTodo(val);
                    setLocalTodoId(val.todo_id);
                    setLocalOperatorType('edit');
                }}
            />
            {newTodo && (
                <TodoDetailDrawer
                    activeTodo={newTodo}
                    visible={showDetail}
                    keyword={""}
                    onRefresh={(item) => { setNewTodo(item) }}
                    onClose={() => {
                        setShowAddTodo(false);
                        setNewTodo(undefined);
                        onClose?.();
                        setShowDetail(false);
                    }}
                />
            )}
        </>
    );
}

export default AddTodoHoc;