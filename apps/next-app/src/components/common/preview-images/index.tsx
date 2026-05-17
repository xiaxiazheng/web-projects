/**
 * 多张图片的展示和预览，使用 react-proto-view 实现多图预览以及拖动和缩放功能
 */
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { handleComputedFileSize, staticUrl } from "@xiaxiazheng/blog-libs";
import { PhotoProvider } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import PreviewImage from "./PreviewImage";

export interface ImgType {
    cTime: string;
    filename: string;
    has_min: "0" | "1"; // 是否有缩略图
    img_id: string;
    imgname: string;
    other_id: string;
    type: string;
    username: string;
    size: string;
    imageUrl?: string;
    imageMinUrl?: string;
}

interface Props {
    imagesList: ImgType[];
    style?: any;
}

const PreviewImages: React.FC<Props> = (props) => {
    const { imagesList, style } = props;

    const [list, setList] = useState<ImgType[]>([]);

    useEffect(() => {
        if (imagesList) {
            handleImageData(imagesList);
        }
    }, [imagesList]);

    const handleImageData = (imagesList: ImgType[]) => {
        const imgList: ImgType[] = imagesList.map((img) => {
            // 原图地址
            const imageUrl = `${staticUrl}/img/${img.type}/${img.filename}`;
            // 缩略图地址
            const imageMinUrl = img.has_min === "1" ? `${staticUrl}/min-img/${img.filename}` : imageUrl;

            return {
                ...img,
                imageMinUrl,
                imageUrl
            };
        });
        setList(imgList);
    };

    return (
        <PhotoProvider
            maskClosable={true}
            overlayRender={(props) => {
                const { index } = props;
                const img = list[index];
                return <div className={styles.imageInfo}>
                    <div>{img.imgname}</div>
                    <div>{handleComputedFileSize(Number(img.size))}</div>
                    <div>{img.cTime}</div>
                </div>;
            }}
        >
            {list?.map((img) => (
                <PreviewImage key={img.img_id} image={img} style={style} />
            ))}
        </PhotoProvider>
    );
};

export default PreviewImages;
