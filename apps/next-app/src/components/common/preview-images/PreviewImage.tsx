/**
 * 控制单个图片的状态，主要还是为了状态自治
 * 还有实现了查看 & 下载原图
 */
import React, { useEffect, useState, createRef } from "react";
import styles from "./index.module.scss";
import { handleComputedFileSize } from "@xiaxiazheng/blog-libs";
import { PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { handleOnloadImage } from "./utils";
import MinImg from "./MinImg";
import { ImgType } from ".";

interface IProps {
    image: ImgType;
    style?: any;
}

const PreviewImage: React.FC<IProps> = (props) => {
    const { image, style } = props;

    // 这里各个 image 的状态必须自治，不能统一去修改传入的 list，不然由于副作用里的异步的原因，会导致每次最后的那次修改会覆盖前面的所有的修改
    const [img, setImg] = useState(image);
    const [loading, setLoading] = useState<boolean>(false);

    // 是否显示原图
    const [isShowOrigin, setIsShowOrigin] = useState(false);

    // 查看原图
    const handlePreviewOrigin = async (img_id: string, imageUrl: string, imgname: string) => {
        setLoading(true);
        const url = await handleOnloadImage(imageUrl, img_id, imgname);

        setImg({
            ...img,
            imageUrl: url,
        });
        setIsShowOrigin(true);
        setLoading(false);
    };

    // 下载原图
    const handleDownload = async (imageUrl: string) => {
        // 这里这样操作是因为图片原本是不同源的，只能用这种方式下载
        // const base64 = await handleOnloadImage(imageUrl, img_id, imgname);
        // const blob = await base64ByBlob(base64);
        // const url = blobToUrl(blob);
        // 不过某些移动端浏览器比较落后，不支持 blob:https 下载，所以只能改 nginx 让线上图片同源了
        // 所以这里改成只用 a 标签的 download 下载同源图片

        const a: any = document.createElement("a");
        a.style.display = "none";
        a.download = true;
        a.href = imageUrl;

        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const ref = createRef();

    return (
        <PhotoView
            key={img.img_id}
            src={isShowOrigin ? img.imageUrl : img.imageMinUrl}
            // overlay={
            //     <div className={styles.imageInfo}>
            //         <div className={styles.infoIcons}>
            //             {!isShowOrigin && (
            //                 <Button
            //                     onClick={() => handlePreviewOrigin(img.img_id, img.imageUrl, img.imgname)}
            //                     type="primary"
            //                 >
            //                     {loading ? "加载中..." : "查看原图"}
            //                 </Button>
            //             )}
            //             <Button icon={<DownloadOutlined />} onClick={() => handleDownload(img.imageUrl)} />
            //         </div>
            //     </div>
            // }
        >
            <MinImg ref={ref} img={img} setImg={setImg} style={style} />
        </PhotoView>
    );
};

export default PreviewImage;
