import { useRouter } from "next/navigation";
import styles from "./index.module.scss";
import TodoForm from "../todo-form";
import { useEffect, useState } from "react";
import { addTodoItem, editTodoItem, getTodoById, TodoStatus, TodoItemType, OperatorColorMap } from "@xiaxiazheng/blog-libs";
import { DrawerProps, Form, message, Spin } from "antd";
import DrawerWrapper from "../../common/drawer-wrapper";
import { operatorMap, OperatorType } from "../types";
import dayjs from "dayjs";

interface IProps extends DrawerProps {
    /** 用来作为 todo-form 默认数据的 todo 的 id
     * 编辑的话，会用这个 id 来编辑
     * 新增 progress 和 copy 则不会使用这个 id，只用其他的数据
     */
    template_todo_id?: string;
    operatorType: OperatorType;
    onSubmit?: (val: any) => void;
}

const TodoFormDrawer: React.FC<IProps> = (props) => {
    const { template_todo_id, open, operatorType, onSubmit, onClose } = props;

    // 根据 todo_id 获取 todo 详情
    const [todoFromId, setTodoFromId] = useState<TodoItemType>();
    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        if (!template_todo_id) {
            return;
        }
        setLoading(true);
        const res = await getTodoById(template_todo_id);
        setTodoFromId(res.data);
        setLoading(false);
    };

    useEffect(() => {
        if (open) {
            template_todo_id && getData();
        } else {
            form.resetFields();
        }
    }, [open, template_todo_id]);

    const handleSave = async (params?: { isClose?: boolean }) => {
        const { isClose = true } = params || {};
        await form.validateFields();

        let val = form.getFieldsValue();
        if (todoFromId) {
            // 编辑
            val = {
                ...todoFromId,
                ...val
            };
        } else {
            // 新增
            val = {
                doing: "0",
                isBookMark: "0",
                isNote: "0",
                isTarget: "1",
                other_id: "",
                status: 0,
                time: dayjs().format("YYYY-MM-DD"),
                ...val,
            };
        }

        setLoading(true);
        const res =
            template_todo_id && operatorType === "edit" // 这两都得有才是编辑，如果是 progress 或 copy 则会有 template_todo_id 但 operatorType !== "edit"
                ? await editTodoItem({
                    ...val,
                    template_todo_id,
                })
                : await addTodoItem(val);
        if (res) {
            message.success(`${operatorMap[operatorType]} Todo 成功`);
            onSubmit?.(operatorType === "edit" ? {
                    ...val,
                    template_todo_id,
                } : res.data.newTodoItem);
            setIsEdit(false);
            isClose && onClose?.({} as any);
        } else {
            message.error(`${operatorMap[operatorType]} Todo 失败，请重试`);
        }
        setLoading(false);
    };

    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isClose, setIsClose] = useState<boolean>(false);

    return (
        <DrawerWrapper
            className={styles.TodoFormDrawer}
            title={
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: operatorType === 'edit' ? OperatorColorMap?.edit : OperatorColorMap?.add }}>
                        <span
                            className={styles.titleClass}
                            style={{ backgroundColor: operatorType === 'edit' ? OperatorColorMap.edit : OperatorColorMap.add }}
                        />
                        {operatorMap[operatorType]} todo
                    </span>
                    <span>
                        <span style={{ color: isEdit ? "#f5222d" : "#40a9ff", marginRight: 15 }} onClick={() => handleSave()}>
                            save&close
                        </span>
                        <span style={{ color: isEdit ? "#f5222d" : "#40a9ff" }} onClick={() => handleSave({ isClose: false })}>
                            save
                        </span>
                    </span>
                </div>
            }
            style={{
                border: `1px solid ${operatorType === 'edit' ? OperatorColorMap?.edit : OperatorColorMap?.add}`,
                boxSizing: 'border-box'
            }}
            destroyOnClose
            {...props}
            onClose={(e) => {
                e.stopPropagation();
                if (isEdit && !isClose) {
                    message.warning("还有编辑内容没保存，确定不要就再点一次");
                    setIsClose(true);
                } else {
                    setIsEdit(false);
                    setIsClose(false);
                    onClose?.(e);
                }
            }}
        >
            <Spin spinning={loading}>
                <TodoForm
                    form={form}
                    status={TodoStatus.todo}
                    todo={todoFromId}
                    operatorType={operatorType}
                    onFieldsChange={() => {
                        setIsEdit(true);
                        setIsClose(false);
                    }}
                />
            </Spin>
        </DrawerWrapper>
    );
};

export default TodoFormDrawer;
