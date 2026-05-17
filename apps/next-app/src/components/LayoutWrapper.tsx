'use client';
// import { AppProps } from "next/app";
// import "../styles/global.scss";
import { FC, ReactNode, useState } from "react";
import { Spin } from "antd";
import RouterDrawer from "../components/common/router-drawer";
import Affix from "../components/common/affix";
import { useRouter, usePathname } from "next/navigation";

import AddTodoHoc from "../components/todo/add-todo-hoc";
import { SettingsProvider } from "@xiaxiazheng/blog-libs";

const LayoutWrapper: FC<{ children: ReactNode }> = ({ children }) => {
    const Provider: any = SettingsProvider;

    const [loading, setLoading] = useState<boolean>(false);
    const [flag, setFlag] = useState<number>();
    const refresh = () => {
        setFlag(Math.random());
    };

    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    const isMusic = usePathname() === '/music';
    const isShowHome = !isMusic && usePathname() !== "/" && usePathname() !== '/todo-note';
    return (
        <Provider>
            <Spin spinning={loading} style={{ overflow: "hidden" }}>
                {/* <Component {...pageProps} setRouterLoading={setLoading} refreshFlag={flag} /> */}
                {children}
                {isShowHome && <Affix type="home" bottomIndex={1} />}
                <Affix
                    type="category"
                    bottomIndex={isShowHome ? 2 : 1}
                    onClick={() => {
                        setShowDrawer(true);
                    }}
                />
                {!isMusic && <AddTodoHoc
                    onClose={() => refresh()}
                    renderChildren={({ onClick }) => {
                        return (
                            <Affix
                                type="add"
                                bottomIndex={isShowHome ? 3 : 2}
                                onClick={() => onClick()}
                            />
                        )
                    }} />
                }
                <RouterDrawer
                    setRouterLoading={setLoading}
                    refresh={refresh}
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                />
            </Spin>
        </Provider>
    )
}

export default LayoutWrapper;