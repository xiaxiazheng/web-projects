/**
 * 实现了缩略图的逻辑，封装器交叉选择器的逻辑
 */
import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { handleOnloadImage } from "./utils";
import { ImgType } from ".";
import Image from "next/image";

const MAX_FILE_SIZE = 1024 * 1024 * 5;

interface IProps {
    ref: any;
    img: ImgType;
    setImg: any;
    style?: any;
}

// 缩略图，采用交叉观察者
const MinImg: React.FC<IProps> = React.forwardRef((props, ref: any) => {
    const { img, setImg, style, ...rest } = props;
    const { imageMinUrl, img_id, imgname } = img;

    const [url, setUrl] = useState<string>();
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        let observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((item) => {
                    if (!isShow && item.isIntersecting) {
                        setIsShow(true);
                        onloadImage();
                    }
                });
            },
            {
                root: null,
            }
        );
        if (ref?.current) {
            observer.observe(ref.current);
        }
    }, [ref]);

    const onloadImage = async () => {
        if (Number(img.size) > MAX_FILE_SIZE) {
            setUrl(imageMinUrl);
            return;
        }
        if (!imageMinUrl || !imgname) {
            return;
        }
        const url = await handleOnloadImage(imageMinUrl, `min_${img_id}`, imgname);
        setImg({
            ...img,
            imageMinUrl: url,
        });
        setUrl(url);
    };

    return (
        <div ref={ref} className={styles.min_img} style={style}>
            {/* {Number(img.size) > MAX_FILE_SIZE ? handleComputedFileSize(Number(img.size)) : */}
            {
                !url ? (
                    <Image width={80} height={80} src="/m/loading.svg" alt="loading" />
                ) : (
                    <img width={80} height={80} src={url} style={{ objectFit: 'cover', ...style }} {...rest} />
                )}
        </div>
    );
});

export default MinImg;
