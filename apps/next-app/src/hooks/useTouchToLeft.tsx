import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { debounceTime } from "./useTouchToTop";

interface Params {
    spanX?: number;
    spanY?: number;
    onChange: Function;
    isReverse?: boolean;
    tipsText?: string;
    canListen?: boolean;
}

const useTouchToLeft = (
    { spanX = 160, spanY = 100, onChange, isReverse = false, tipsText = "", canListen = true }: Params,
    listener: any[]
) => {
    const handleJudge = (x: number, y: number) => {
        if (handleReverse(ref.current.x - x) >= spanX && Math.abs(ref.current.y - y) < spanY) {
            onChange();
        }
    };

    const handleReverse = (num: number) => {
        return isReverse ? num * -1 : num;
    };

    const ref = useRef<any>({
        x: 0,
        y: 0,
    });
    const isStart = useRef<any>(false);

    const handleStart = debounce((e: TouchEvent) => {
        ref.current = {
            x: e.targetTouches?.[0].pageX,
            y: e.targetTouches?.[0].pageY,
        };
        isStart.current = true;
    }, debounceTime);

    const handleEnd = debounce((e: TouchEvent) => {
        handleJudge(e.changedTouches?.[0]?.pageX, e.changedTouches?.[0]?.pageY);
        isStart.current = false;
        setIsShow(false);
    }, debounceTime);

    const handleMove = debounce((e: TouchEvent) => {
        const moveX = handleReverse(ref.current.x - e.targetTouches?.[0].pageX);
        setX(moveX);
        setY(e.targetTouches?.[0].pageY - ref.current.y);
        if (isStart.current) {
            moveX > 100 ? setIsShow(true) : setIsShow(false);
        }
    }, debounceTime);

    useEffect(() => {
        if (canListen) {
            document.addEventListener("touchstart", handleStart);
            document.addEventListener("touchend", handleEnd);
            document.addEventListener("touchmove", handleMove);
        }

        return () => {
            if (canListen) {
                document.removeEventListener("touchstart", handleStart);
                document.removeEventListener("touchend", handleEnd);
                document.removeEventListener("touchmove", handleMove);
            }
        };
    }, [...listener, canListen]);

    const [isShow, setIsShow] = useState<boolean>(false);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);

    return (
        isShow && (
            <div
                style={{
                    position: "fixed",
                    top: "50vh",
                    left: "50vw",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    background: x >= spanX && Math.abs(y) < spanY ? "#1bbb1b" : "#d9363e",
                    borderRadius: 8,
                    zIndex: 1001,
                    padding: "5px 10px",
                }}
            >
                <div>x: {x.toFixed(0)}</div>
                <div>y: {y.toFixed(0)}</div>
                <div>{tipsText}</div>
            </div>
        )
    );
};

export default useTouchToLeft;
