import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import styles from "./touch-event.module.scss";
import { TouchEventProps } from "../hooks/useTouchEvent";

export const debounceTime = 20;

export class TouchEventClass {
    startX = 0;
    startY = 0;
    moveX = 0;
    moveY = 0;
    isStart = false;
    isShow = false;
    safeX = 120;
    safeY = 210;
    map: {
        top: any[];
        bottom: any[];
        left: any[];
        right: any[];
    } = {
        top: [],
        bottom: [],
        left: [],
        right: [],
    };
    forceUpdate: Function = () => {};
    lastDom: any;
    event: ((e: TouchEvent) => void) | undefined;

    init = (props: TouchEventProps) => {
        const { ref, event } = props;
        if (ref && ref?.current) {
            if (this.lastDom) {
                this.lastDom.removeEventListener("touchstart", this.handleStart);
                this.lastDom.removeEventListener("touchend", this.handleEnd);
                this.lastDom.removeEventListener("touchmove", this.handleMove);
            }
            this.event = event;
            ref?.current?.addEventListener("touchstart", this.handleStart);
            ref?.current?.addEventListener("touchend", this.handleEnd);
            ref?.current?.addEventListener("touchmove", this.handleMove);
            this.lastDom = ref?.current;
        }
    };

    setForceUpdate = (forceUpdate: Function) => {
        this.forceUpdate = forceUpdate;
    };

    setSafeXY = (params: { x: number; y: number }) => {
        const { x, y } = params;
        if (x) {
            this.safeX = x;
        }
        if (y) {
            this.safeY = y;
        }
    };

    handleStart = debounce((e: TouchEvent) => {
        this.startX = e.targetTouches?.[0].pageX;
        this.startY = e.targetTouches?.[0].pageY;
        this.isStart = true;
        console.log(this.map);
    }, debounceTime);

    getDirection = (moveX: number, moveY: number): "" | "top" | "bottom" | "left" | "right" => {
        if (-moveY > this.safeY && Math.abs(moveX) < this.safeX) {
            return "top";
        }
        if (moveY > this.safeY && Math.abs(moveX) < this.safeX) {
            return "bottom";
        }
        if (-moveX > this.safeX && Math.abs(moveY) < this.safeY) {
            return "left";
        }
        if (moveX > this.safeX && Math.abs(moveY) < this.safeY) {
            return "right";
        }
        return "";
    };

    handleRunMoveEnd = (endX: number, endY: number, e: TouchEvent) => {
        const moveX = endX - this.startX;
        const moveY = endY - this.startY;
        let direction = this.getDirection(moveX, moveY);
        // const len = this.map[direction]?.length;
        // len && this.map[direction][len - 1].handleMoveEnd();
        if (this.event) {
            this.event(e);
        }
    };

    handleMoveEndText = () => {
        const direction = this.getDirection(this.moveX, this.moveY);
        if (!direction) {
            return "";
        }
        const len = this.map[direction]?.length;
        return len ? this.map[direction][len - 1].tipsText : "";
    };

    handleEnd = debounce((e: TouchEvent) => {
        this.handleRunMoveEnd(e.changedTouches?.[0]?.pageX, e.changedTouches?.[0]?.pageY, e);
        this.isStart = false;
        this.isShow = false;
        this.getRender();
    }, debounceTime);

    handleMove = debounce((e: TouchEvent) => {
        const moveY = e.targetTouches?.[0].pageY - this.startY;
        const moveX = e.targetTouches?.[0].pageX - this.startX;
        this.moveX = moveX;
        this.moveY = moveY;
        if (Math.abs(moveX) < this.safeX && Math.abs(moveY) < this.safeY) {
            this.isShow = false;
        } else {
            this.isShow = true;
        }
        this.getRender();
    }, debounceTime);

    getRender() {
        this.forceUpdate?.();
    }

    render() {
        if (!this.isShow) return null;
        const text = this.handleMoveEndText();
        return (
            text && (
                <div className={styles.touchEventText}>
                    <div>x: {this.moveX.toFixed(0)}</div>
                    <div>y: {this.moveY.toFixed(0)}</div>
                    <div>{text}</div>
                </div>
            )
        );
    }
}

export default TouchEventClass;
