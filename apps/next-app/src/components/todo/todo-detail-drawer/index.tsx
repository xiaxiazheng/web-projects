import React, { ReactNode, useEffect, useState } from "react";
import PreviewImages from "../../common/preview-images";
import UploadImageFile from "../../common/upload-image-file";
import styles from "./index.module.scss";
import { Button, Input, message, Space } from "antd";
import {
    TodoDescription,
    TodoItemType,
    doneTodoItem,
    getTodoById,
    TodoStatus,
    TodoItem,
    TodoChainIcon,
    hasChainIcon,
    setFootPrintList,
    decrypt
 } from "@xiaxiazheng/blog-libs";
import DrawerWrapper from "../../common/drawer-wrapper";
import TodoFormDrawer from "../todo-form-drawer";
import ChainDrawer from "../chain-drawer";
import AddTodoHoc from "../add-todo-hoc";

interface IProps {
    activeTodo: TodoItemType;
    visible: boolean;
    /**
     * 在新增修改或新增 todo 的时候触发
     * 触发外部列表刷新
     */
    onRefresh: (item?: TodoItemType) => void;
    onClose: () => void; // 关闭弹窗时触发
    keyword?: string;
    footer?: () => ReactNode;
    footerConfig?: { hideAddBtn?: boolean; hideDoneBtn?: boolean };
}

// 点开查看 todo 的详情，有 description 和该 todo 上挂的图片
const TodoDetailDrawer: React.FC<IProps> = (props) => {
    const { activeTodo: oldActiveTodo, visible, onRefresh, onClose, keyword, footer, footerConfig } = props;

    // 自己存一份，外部清空这里不清空；外部修改这里同步修改
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();
    useEffect(() => {
        if (oldActiveTodo) {
            setActiveTodo(oldActiveTodo);
        }
    }, [oldActiveTodo]);

    useEffect(() => {
        if (activeTodo) {
            setFootPrintList(activeTodo?.todo_id);
        }
    }, [activeTodo]);

    const [loading, setLoading] = useState<boolean>(false);
    const handleDone = async () => {
        if (!activeTodo) {
            return;
        }
        setLoading(true);
        const params = {
            todo_id: activeTodo.todo_id,
        };

        const res = await doneTodoItem(params);
        if (res) {
            message.success(res.message);
            onRefresh(res.data);
            setActiveTodo(res.data);
            setLoading(false);
            handleClose();
        } else {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const [showEdit, setShowEdit] = useState<boolean>(false);

    const [showChain, setShowChain] = useState<boolean>(false);

    const GetTodoById = async (todo_id: string) => {
        return await getTodoById(todo_id);
    };

    const onSubmit = async (val: TodoItemType) => {
        const newTodo = { ...activeTodo, ...val };
        setActiveTodo(newTodo);
        onRefresh(newTodo);
    };

    const handleUpload = async () => {
        if (!activeTodo) {
            return;
        }
        const res = await GetTodoById(activeTodo.todo_id);
        setActiveTodo(res.data);
        onRefresh(res.data);
    };

    // 判断是否应该优先添加子节点
    const shouldAddChild = (todo?: TodoItemType) => {
        if (todo?.isTarget === "1") {
            return true;
        }
        return false;
    };

    const [isDecode, setIsDecode] = useState<boolean>(false);
    const [password, setPassword] = useState<string>(localStorage.getItem('encodePassword') || '');
    const [decodeData, setDecodeData] = useState<string>('');
    const handleDecode = async () => {
        if (!activeTodo) {
            return;
        }
        const data = await decrypt(activeTodo.description, password);
        if (data) {
            setDecodeData(data);
            localStorage.setItem('encodePassword', password);
            setIsDecode(true);
        }
    };

    return (
        <>
            <DrawerWrapper
                title={
                    activeTodo && (
                        <TodoItem item={activeTodo} keyword={keyword} showTime={true} wrapperStyle={{}} />
                    )
                }
                open={visible}
                onClose={e => {
                    e.stopPropagation();
                    handleClose();
                }}
                height={"90vh"}
                footer={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            paddingBottom: "20px",
                            borderTop: "1px solid white",
                        }}
                    >
                        <Space
                            className={styles.operator}
                            size={10}
                            style={{
                                paddingTop: "10px",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    setShowEdit(true);
                                }}
                            >
                                编辑
                            </Button>
                            {!footerConfig?.hideAddBtn && (
                                <>
                                    <AddTodoHoc
                                        operatorType="copy"
                                        template_todo_id={activeTodo?.todo_id}
                                        onClose={onRefresh}
                                        renderChildren={({ onClick }) => {
                                            return (
                                                <Button
                                                    type={!shouldAddChild(activeTodo) ? "primary" : "default"}
                                                    onClick={() => {
                                                        onClick();
                                                    }}
                                                >
                                                    {activeTodo?.other_id ? "添加同级进度" : "复制"}
                                                </Button>
                                            );
                                        }}
                                    />
                                    <AddTodoHoc
                                        operatorType="progress"
                                        template_todo_id={activeTodo?.todo_id}
                                        onClose={onRefresh}
                                        renderChildren={({ onClick }) => {
                                            return (
                                                <Button
                                                    type={shouldAddChild(activeTodo) ? "primary" : "default"}
                                                    onClick={() => {
                                                        onClick();
                                                    }}
                                                >
                                                    添加后续
                                                </Button>
                                            );
                                        }}
                                    />
                                </>
                            )}
                            {activeTodo && hasChainIcon(activeTodo).hasChain && (
                                <Button
                                    onClick={() => {
                                        setShowChain(true);
                                    }}
                                >
                                    chain <TodoChainIcon item={activeTodo} />
                                </Button>
                            )}
                            {!footerConfig?.hideDoneBtn && String(activeTodo?.status) === String(TodoStatus.todo) && (
                                <Button type="primary" onClick={() => handleDone()} danger loading={loading}>
                                    完成Todo
                                </Button>
                            )}
                            {footer?.()}
                            {activeTodo?.isEncode === "1" && <>
                                <Input value={password} onChange={e => setPassword(e.target.value)} />
                                <Button onClick={() => handleDecode()}>解密</Button>
                            </>}
                        </Space>
                    </div>
                }
            >
                <div style={{ fontSize: 13 }}>
                    <TodoDescription
                        todoDescription={activeTodo?.description}
                        keyword={keyword}
                    />
                </div>
                {activeTodo?.todo_id && (
                    <div style={{ marginTop: 10 }}>
                        <UploadImageFile type="todo" otherId={activeTodo.todo_id} refreshImgList={handleUpload} />
                        {activeTodo?.imgList && <PreviewImages imagesList={activeTodo.imgList} />}
                    </div>
                )}
            </DrawerWrapper>
            <TodoFormDrawer
                open={showEdit}
                template_todo_id={activeTodo?.todo_id}
                onClose={() => setShowEdit(false)}
                operatorType={"edit"}
                onSubmit={onSubmit}
            />
            <ChainDrawer open={showChain} onClose={() => setShowChain(false)} todo_id={activeTodo?.todo_id} />
            <DrawerWrapper
                title={
                    activeTodo && (
                        <TodoItem item={activeTodo} keyword={keyword} showTime={true} wrapperStyle={{}} />
                    )
                }
                open={isDecode}
                onClose={() => setIsDecode(false)}
                height={"90vh"}
            >
                <div style={{ fontSize: 13 }}>
                    <TodoDescription
                        todoDescription={decodeData}
                        keyword={keyword}
                    /> 
                </div>
            </DrawerWrapper>
        </>
    );
};

export default TodoDetailDrawer;
