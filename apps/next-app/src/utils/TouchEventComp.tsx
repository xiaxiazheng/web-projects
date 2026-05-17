import { useEffect, useReducer } from "react";
import useTouchEvent from "../hooks/useTouchEvent";

// 用来展示 touch 信息的组件
const TouchEventComp = () => {
    // const touchEvent = useTouchEvent();
    const [, forceUpdate] = useReducer((s) => s + 1, 0);

    // useEffect(() => {
    //     // 类库的状态变化时，用这个来强刷 React 的视图
    //     touchEvent.setForceUpdate(forceUpdate);
    // }, [forceUpdate])

    // return <>{touchEvent.render()}</>;
    return <></>
};

export default TouchEventComp;
