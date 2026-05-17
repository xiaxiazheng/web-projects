'use client';
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { Form, Input, Button } from "antd";
import { postLogin } from "@xiaxiazheng/blog-libs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const [form] = Form.useForm();
    const router = useRouter();

    const onFinish = async (val: any) => {
        const res = await postLogin(val);
        if (res) {
            localStorage.setItem("username", val.username)
            localStorage.setItem("password", val.password)
            router.push("/music");
        }
    };

    useEffect(() => {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");
        if (username) {
            form.setFieldsValue({
                username,
                password
            });
        }
    }, [form]);

    return (
        <>
            <Header title="登录" />
            <main>
                <div className={styles.login}>
                    <h2>please Login</h2>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: "Please input your username!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </main>
        </>
    );
}
