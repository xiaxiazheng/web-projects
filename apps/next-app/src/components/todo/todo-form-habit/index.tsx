import { useState, useEffect, useRef } from "react";
import { Form, Input, Radio, FormInstance, FormProps } from "antd";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { getTodoCategory } from "@xiaxiazheng/blog-libs";
import { colorTitle } from "../constant";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import InputList from "../todo-form/input-list";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";

interface Props extends FormProps {
    todo?: TodoItemType;
    form?: FormInstance;
}

const TodoFormPunchTheClock: React.FC<Props> = (props) => {
    const { todo, form, ...rest } = props;

    const [category, setCategory] = useState<any[]>([]);
    const getCategory = async () => {
        const res: any = await getTodoCategory();
        setCategory(res.data);
    };

    useEffect(() => {
        getCategory();
    }, []);

    const settings = useSettingsContext();

    return (
        <main className={styles.edit_todo}>
            <Form form={form} layout={"vertical"} labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} {...rest}>
                <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                    <Input.TextArea
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        allowClear
                        placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
                    />
                </Form.Item>
                <Form.Item name="description" label="详细描述">
                    <InputList />
                </Form.Item>
                <Form.Item name="color" label={colorTitle} rules={[{ required: true }]} initialValue={"0"}>
                    <Radio.Group>
                        {Object.keys(settings?.todoColorMap || {}).map((item) => (
                            <Radio.Button key={item} value={item} style={{ color: settings?.todoColorMap?.[item] }}>
                                {settings?.todoColorNameMap?.[item]}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="startTime"
                    label="打卡开始时间"
                    rules={[{ required: true }]}
                    initialValue={dayjs().format("YYYY-MM-DD")}
                >
                    <Radio.Group>
                        <Radio.Button value={dayjs().format("YYYY-MM-DD")}>Today</Radio.Button>
                        <Radio.Button value={dayjs().add(1, "day").format("YYYY-MM-DD")}>Tomorrow</Radio.Button>
                        <Radio.Button value={dayjs().subtract(1, "day").format("YYYY-MM-DD")}>Yesterday</Radio.Button>
                        {todo && <Radio.Button value={todo.time}>{todo.time}</Radio.Button>}
                    </Radio.Group>
                </Form.Item>
                {/* <Form.Item name="range" label="持续天数" rules={[{ required: true }]} initialValue={7}>
                    <Input />
                </Form.Item> */}
                <Form.Item name="target" label="达标天数" rules={[{ required: true }]} initialValue={7}>
                    <Input />
                </Form.Item>
                <Form.Item name="category" label="类别" rules={[{ required: true }]} initialValue={"个人"}>
                    <Radio.Group>
                        {category?.map((item) => (
                            <Radio.Button key={item.category} value={item.category}>
                                {item.category} ({item.count})
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
            </Form>
        </main>
    );
};

export default TodoFormPunchTheClock;
