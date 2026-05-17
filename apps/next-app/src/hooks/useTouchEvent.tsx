import { MutableRefObject, useEffect } from "react";
import TouchEventClass from "../utils/touch-event";
// import useSettingsContext from "./useSettingsContext";

// let touchEvent: TouchEventClass;
// let isInit = false;

export interface TouchEventProps {
    /** 用来绑定事件的 ref */
    ref: MutableRefObject<any>;
    /** 触发的事件 */
    event: (e: any) => void;
}

const useTouchEvent = (props: TouchEventProps, dep: any[] = []) => {
    const { ref, event } = props;
    // const settings = useSettingsContext();
    // const touchSafeXY = settings?.touchSafeXY; // 获取 settings 配置

    // 创建实例，用全局变量 touchEvent 保证只会有一个实例
    const touchEvent = new TouchEventClass();

    useEffect(() => {
        // 初始化 touch 监听事件，因为 window 对象的缘故，所以需要在 useEffect 里包裹
        console.log('准备 init', props);
        touchEvent.init(props);
    }, [ref, event, ...dep]);

    // console.log('ref', ref);

    // useEffect(() => {
    //     if (touchSafeXY) {
    //         touchEvent.setSafeXY(touchSafeXY); // 将 settings 的配置写入 class 实例
    //     }
    // }, [touchSafeXY]);

    return touchEvent; // 返回唯一的实例给所有使用的地方
};

export default useTouchEvent;
