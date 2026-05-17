import { useEffect, useState } from "react";
import { addTodoItem } from "@xiaxiazheng/blog-libs";
import { Button, Input, message, Space } from "antd";
import { CreateTodoItemReq, TodoItemType, getRangeFormToday } from "@xiaxiazheng/blog-libs";
import dayjs from "dayjs";
import DrawerWrapper from "../../common/drawer-wrapper";
import HabitCalendar from "./Calendar";
import { getToday, getZeroDay, handleIsTodayPunchTheClock } from "../todo-form-habit/utils";
import TodoFormDrawer from "../todo-form-drawer";

dayjs.locale("zh-cn");

export const renderHabitDetail = (item: TodoItemType) => {
    const untilNow = getToday().diff(getZeroDay(item.time), "d") + 1;
    const lastDoneTodo = item.child_todo_list?.[0];
    const lastDoneDay = lastDoneTodo?.time;
    return (
        <>
            <div>
                今日
                {handleIsTodayPunchTheClock(item) ? "已打卡" : "未打卡"}
            </div>
            <div>描述：{item?.description || "暂无"}</div>
            <div>
                立项日期：{item.time} {getRangeFormToday(item.time)}
            </div>
            <div>
                已打卡天数：{item.child_todo_list_length} / {untilNow}
            </div>
            <div>最后一次打卡时间：{lastDoneDay ? `${lastDoneDay} ${getRangeFormToday(lastDoneDay)}` : "暂无"}</div>
            <div>最后一次打卡的描述：{lastDoneTodo?.description || "暂无"}</div>
        </>
    );
};

interface IProps {
    active?: TodoItemType;
    handleClose: Function;
    onRefresh: Function;
}

const TodoHabitDrawer: React.FC<IProps> = (props) => {
    const { active, handleClose, onRefresh } = props;

    const punchTheClock = async (active: TodoItemType) => {
        const val: CreateTodoItemReq = {
            category: active.category,
            color: `${active.color}` !== "3" ? `${Number(active.color) + 1}` : active.color,
            description: desc,
            name: `打卡：${active.name}`,
            isBookMark: "0",
            isNote: "0",
            isTarget: "0",
            doing: "0",
            other_id: active.todo_id,
            status: "1",
            isWork: "0",
            isDirectory: "0",
            isFollowUp: "0",
            isEncode: "0",
            isShow: "0",
            time: dayjs().format("YYYY-MM-DD"),
        };
        await addTodoItem(val);
        message.success("打卡成功");
        onRefresh?.();
        handleClose?.();
    };

    const [showEdit, setShowEdit] = useState<boolean>(false);

    const [desc, setDesc] = useState<string>("");

    const isTodayDone = active ? handleIsTodayPunchTheClock(active) : false;

    return (
        <>
            <DrawerWrapper
                title={active?.name}
                footer={
                    <Space
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            paddingTop: "10px",
                            paddingBottom: "20px",
                            borderTop: "1px solid white",
                        }}
                    >
                        {isTodayDone ? (
                            <Button type="primary" style={{ background: "green" }}>
                                今日已打卡
                            </Button>
                        ) : (
                            <Button type="primary" onClick={() => active && punchTheClock(active)}>
                                现在打卡
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                setShowEdit(true);
                            }}
                        >
                            编辑
                        </Button>
                    </Space>
                }
                open={!!active}
                onClose={() => handleClose?.()}
            >
                <HabitCalendar active={active} />
                {active && renderHabitDetail(active)}
                {!isTodayDone && (
                    <Input
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        style={{ marginTop: 12 }}
                        placeholder="可以输入打卡时带上的描述"
                    />
                )}
            </DrawerWrapper>
            <TodoFormDrawer
                template_todo_id={active?.todo_id}
                open={showEdit}
                onClose={() => {
                    setShowEdit(false);
                }}
                operatorType={"edit"}
                onSubmit={() => {
                    onRefresh?.();
                    setShowEdit(false);
                    handleClose?.();
                }}
            />
        </>
    );
};

export default TodoHabitDrawer;
