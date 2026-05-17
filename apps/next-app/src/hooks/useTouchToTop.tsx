import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

interface Params {
    spanX?: number;
    spanY?: number;
    onChange: Function;
    isReverse?: boolean;
    tipsText?: string;
    canListen?: boolean;
}

export const debounceTime = 20;

const useTouchToTop = (
    { spanX = 100, spanY = 160, onChange, isReverse = false, canListen = true, tipsText = "" }: Params,
    listener: any[]
) => {

    const handleJudge = (x: number, y: number) => {
        if (handleReverse(ref.current.y - y) >= spanY && Math.abs(ref.current.x - x) < spanX) {
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
        const moveY = handleReverse(ref.current.y - e.targetTouches?.[0].pageY);
        setX(ref.current.x - e.targetTouches?.[0].pageX);
        setY(moveY);
        if (isStart.current) {
            moveY > 100 ? setIsShow(true) : setIsShow(false);
        }
    }, debounceTime);

    useEffect(() => {
        if (canListen) {
            document.addEventListener("touchstart", handleStart);
            document.addEventListener("touchend", handleEnd);
            document.addEventListener("touchmove", handleMove);
        }

        return () => {
            document.removeEventListener("touchstart", handleStart);
            document.removeEventListener("touchend", handleEnd);
            document.removeEventListener("touchmove", handleMove);
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
                    background: y >= spanY && Math.abs(x) < spanX ? "#1bbb1b" : "#d9363e",
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

export default useTouchToTop;
