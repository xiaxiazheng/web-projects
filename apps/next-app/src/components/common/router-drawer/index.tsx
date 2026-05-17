import React, { useEffect, useReducer, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
    LoginOutlined,
    BookOutlined,
    OrderedListOutlined,
    CoffeeOutlined,
    PlusOutlined,
    CloudOutlined,
    GithubOutlined,
    CodepenOutlined,
    ClusterOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import DrawerWrapper from "../drawer-wrapper";
import styles from "./index.module.scss";
import { Button, Space } from "antd";
import { TodoTypeIcon } from "@xiaxiazheng/blog-libs";

interface IProps {
    setRouterLoading: Function;
    refresh: () => void;
    showDrawer: boolean;
    setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const RouterDrawer: React.FC<IProps> = (props) => {
    const { setRouterLoading, refresh, showDrawer, setShowDrawer } = props;

    const routes = [
        {
            title: "todo",
            children: [
                {
                    name: "todo list",
                    path: "/",
                    icon: <OrderedListOutlined />,
                },
                {
                    name: "新建 todo",
                    path: "todo-add",
                    icon: <PlusOutlined />,
                },
            ],
        },
        {
            title: "blog",
            children: [
                {
                    name: "我的日志",
                    path: "blog",
                    icon: <BookOutlined />,
                },
                {
                    name: "随机日志",
                    path: "blog-random",
                    icon: <CoffeeOutlined />,
                },
            ],
        },
        {
            title: "others",
            children: [
                {
                    name: "Music",
                    path: "music",
                    // icon: <TikTokOutlined />,
                },
                {
                    name: "translate",
                    path: "translate",
                    // icon: <VideoCameraOutlined />,
                },
                {
                    name: "七牛云视频",
                    path: "video",
                    icon: <VideoCameraOutlined />,
                },
                {
                    name: "猫",
                    path: "mao",
                    icon: <GithubOutlined />,
                },
                {
                    name: "树",
                    path: "tree",
                    icon: <ClusterOutlined />,
                },
                {
                    name: "云盘",
                    path: "cloud",
                    icon: <CloudOutlined />,
                },
                {
                    name: "CMD",
                    path: "cmd",
                    icon: <CodepenOutlined />,
                },
                {
                    name: "home",
                    path: "home",
                    // icon: <VideoCameraOutlined />,
                },
                {
                    name: "登录",
                    path: "login",
                    icon: <LoginOutlined />,
                },
            ],
        },
    ];

    const router = useRouter();
    const activePath = usePathname();

    const handleClick = async (path: string) => {
        setShowDrawer(false);
        setRouterLoading(true);
        await router.push(`/${path}`);
        setRouterLoading(false);
    };

    const [isWork, setIsWork] = useState("");
    useEffect(() => {
        setIsWork(localStorage.getItem("WorkOrLife") || "");
    }, []);
    useEffect(() => {
        if (isWork && isWork !== localStorage.getItem("WorkOrLife")) {
            localStorage.setItem("WorkOrLife", isWork);
            refresh();
            setShowDrawer(false);
        }
    }, [isWork]);

    return (
        <>
            <DrawerWrapper open={showDrawer} onClose={() => setShowDrawer(false)} placement="top" height="80vh">
                {routes.map((category) => {
                    return (
                        <div key={category.title}>
                            <h3 className={styles.title}>{category.title}</h3>
                            <div className={styles.index}>
                                {category.children.map((item) => {
                                    return (
                                        <div
                                            className={`${styles.route_item} ${
                                                activePath === item.path || activePath === `/${item.path}`
                                                    ? styles.active
                                                    : ""
                                            }`}
                                            key={item.path}
                                            onClick={() => handleClick(item.path)}
                                        >
                                            <div className={styles.icon}>{item.icon}</div>
                                            <div>{item.name || item.path}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                <Space size={10} style={{ paddingTop: "20px" }}>
                    <Button
                        className={styles.btn}
                        type="text"
                        onClick={() => setIsWork(isWork === "1" ? "" : "1")}
                        icon={<TodoTypeIcon type="isWork" />}
                        style={
                            isWork === "1"
                                ? {
                                      borderColor: "#00d4d8",
                                      background: "#00d4d8",
                                  }
                                : { borderColor: "#00d4d8", color: "#00d4d8" }
                        }
                    >
                        Work
                    </Button>
                    <Button
                        className={styles.btn}
                        type="text"
                        onClick={() => setIsWork(isWork === "0" ? "" : "0")}
                        icon={<TodoTypeIcon type="life" />}
                        style={
                            isWork === "0"
                                ? {
                                      borderColor: "#00d4d8",
                                      background: "#00d4d8",
                                  }
                                : { borderColor: "#00d4d8", color: "#00d4d8" }
                        }
                    >
                        Life
                    </Button>
                </Space>
            </DrawerWrapper>
        </>
    );
};

export default RouterDrawer;
