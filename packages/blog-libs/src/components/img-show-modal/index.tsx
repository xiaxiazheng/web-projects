import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, message, Modal, Space } from "antd";
import { debounce, getIsH5 } from "../../utils";
// import { useHammer } from "./useHammer";
import InputSlider from "./InputSlider";

interface PropsType {
    title: string | undefined;
    imgUrl: string | undefined;
    onClose: () => void;
}

const ImgShowModal: React.FC<PropsType> = (props) => {
    const { imgUrl, title, onClose } = props;

    // 调整此值可改变缩放灵敏度
    const [scaleFactor, setScaleFactor] = useState<number>();
    useEffect(() => {
        // 存起来因为不同设备不同缩放灵敏度
        if (!scaleFactor) {
            setScaleFactor(Number(localStorage.getItem('scaleFactor') || '0.01'));
        } else {
            localStorage.setItem('scaleFactor', scaleFactor.toString());
        }
    }, [scaleFactor]);

    const ref = useRef<HTMLDivElement>(null);
    // const ref = useHammer((s) => {
    //     scaleFactor && setS(scale + (s - 1) * scaleFactor);
    //     scaleFactor && setScale(scale + (s - 1) * scaleFactor);
    // });

    /** 保留n位小数 */
    const getOnePoint = (value: number, point = 2) => {
        return Math.floor(value * 10 ** point) / 10 ** point;
    }

    const [scale, setScale] = useState<number>(0);
    const [minScale, setMinScale] = useState<number>(0);
    const [maxScale, setMaxScale] = useState<number>(0);
    useEffect(() => {
        if (!boxHeight && !boxWidth && ref?.current) {
            setBoxHeight(ref?.current?.clientHeight || 0);
            setBoxWidth(ref?.current?.clientWidth || 0);
        }

        // 为需要支持缩放的DOM元素添加事件监听
        ref?.current?.addEventListener('wheel', handleListenWheel, { passive: false }); // 必须设置passive: false才能调用preventDefault

        return () => {
            ref?.current?.removeEventListener('wheel', handleListenWheel);
        }
    }, [ref, scale, minScale, maxScale]);

    const handleListenWheel = (event: any) => {
        // 检查是否按下了Ctrl键（通常与双指缩放关联）
        if (event.ctrlKey) {
            event.preventDefault(); // 阻止浏览器的默认缩放行为

            // 根据滚轮方向调整缩放比例
            // deltaY为负表示放大，为正表示缩小[6](@ref)
            const scaleChange = event.deltaY * -(scaleFactor || 0.01);

            let currentScale = getOnePoint(scale + scaleChange);

            // 限制缩放范围（可选）
            currentScale = Math.min(Math.max(minScale, currentScale), maxScale);

            // 更新初始缩放值以便下次计算
            setScale(currentScale);
        }
    }

    const [imgOriginHeight, setImgOriginHeight] = useState<number>(0);
    const [imgOriginWidth, setImgOriginWidth] = useState<number>(0);
    const [showHeight, setShowHeight] = useState<number>(0);
    const [showWidth, setShowWidth] = useState<number>(0);
    const [boxHeight, setBoxHeight] = useState<number>();
    const [boxWidth, setBoxWidth] = useState<number>();

    useEffect(() => {
        getShowHeightWidth();
    }, [scale]);

    /** 防抖，让缩放更跟手 */
    const getShowHeightWidth = debounce(() => {
        setShowHeight(imgOriginHeight * scale);
        setShowWidth(imgOriginWidth * scale);
    }, 50);

    const isH5 = getIsH5();

    useEffect(() => {
        if (!scale && boxHeight && boxWidth && imgOriginHeight && imgOriginWidth) {
            // 最小倍率保留三位小数
            let minScale = getOnePoint(Math.min(boxHeight / imgOriginHeight, boxWidth / imgOriginWidth), 3) || 1;
            let maxScale = getOnePoint(Math.max(boxHeight / imgOriginHeight, boxWidth / imgOriginWidth));
            /** h5 直接用最大和最小倍率
             * web 则允许有更大的动态范围，因为手机屏幕小
             */
            setMinScale(getOnePoint(isH5 ? minScale : minScale / 2, 3));
            setMaxScale(maxScale + (isH5 ? 0 : 2));
            setScale(minScale);
        }
    }, [scale, boxHeight, boxWidth, imgOriginHeight, imgOriginWidth]);

    const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

    return !imgUrl ? null : <Modal
        style={{ top: 20 }}
        width={'unset'}
        open={true}
        title={<>{title}</>}
        footer={
            <Space>
                <InputSlider min={minScale} max={maxScale} value={scale} onChange={setScale} />
                {isH5 ? null :
                    <>
                        <span>缩放灵敏度：</span>
                        <Input
                            style={{ width: 100 }}
                            value={scaleFactor}
                            onChange={(e) => {
                                if (typeof Number(e.target.value) !== 'number') {
                                    message.error('请输入数字');
                                    return;
                                }
                                setScaleFactor(e.target.value as unknown as number);
                            }}
                        />
                        <span>放大缩小倍率：</span>
                        <Input
                            style={{ width: 100 }}
                            value={scale}
                            onChange={(e) => {
                                if (typeof Number(e.target.value) !== 'number') {
                                    message.error('请输入数字');
                                    return;
                                }
                                setScale(e.target.value as unknown as number);
                            }}
                        />
                        {isShowDetail && <><span>图片原大小</span>
                            <span>{`${getOnePoint(imgOriginWidth)}px * ${getOnePoint(imgOriginHeight)}px`}</span>
                            <span>当前显示大小</span>
                            <span>{`${getOnePoint(showWidth)}px * ${getOnePoint(showHeight)}px`}</span>
                            <span>当前显示区域大小</span>
                            <span>{`${getOnePoint(boxWidth || 0)}px * ${getOnePoint(boxHeight || 0)}px`}</span>
                            <span>最小最大缩放倍率：</span>
                            <span>{`${minScale} - ${maxScale}`}</span>
                        </>}
                        <Button onClick={() => setIsShowDetail(!isShowDetail)}>
                            {isShowDetail ? '隐藏详情' : '显示详情'}
                        </Button>
                    </>
                }
            </Space>
        }
        onCancel={onClose}
    >
        <div
            ref={ref}
            className={styles.imgBox}
            style={{
                width: isH5 ? '100%' : `calc(100vw - 48px - 16px - 16px)`,
            }}
        >
            <img
                src={imgUrl}
                style={
                    {
                        width: showWidth ? `${showWidth}px` : '100%',
                        height: showHeight ? `${showHeight}px` : '100%',
                    }
                }
                alt={title || ''}
                onLoadCapture={e => {
                    const img = e.target as HTMLImageElement;
                    const naturalHeight = img.naturalHeight;
                    const naturalWidth = img.naturalWidth;
                    setImgOriginHeight(naturalHeight);
                    setImgOriginWidth(naturalWidth);
                    setShowHeight(naturalHeight);
                    setShowWidth(naturalWidth);
                }}
            />
        </div>
    </Modal>;
};

export default ImgShowModal;
