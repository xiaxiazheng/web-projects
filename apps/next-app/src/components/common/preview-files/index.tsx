import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { handleComputedFileSize, staticUrl } from "@xiaxiazheng/blog-libs";
import MyModal from "../my-modal";
import { Button, message, Space } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

export interface FileType {
    cTime: string;
    filename: string;
    originalname: string;
    file_id: string;
    other_id: string;
    type: string;
    username: string;
    size: string;
    fileUrl?: string;
}

interface Props {
    filesList: FileType[];
    style?: any;
}

const PreviewFiles: React.FC<Props> = (props) => {
    const { filesList, style } = props;

    const [list, setList] = useState<FileType[]>([]);

    useEffect(() => {
        if (filesList) {
            handleFileData(filesList);
        }
    }, [filesList]);

    const handleFileData = (filesList: FileType[]) => {
        const fileList: FileType[] = filesList.map((file) => {
            // 文件地址
            const fileUrl = `${staticUrl}/file/${file.type}/${file.filename}`;

            return {
                ...file,
                fileUrl,
            };
        });
        setList(fileList);
    };

    // 下载文件
    const handleDownload = async (fileUrl: string) => {
        const a: any = document.createElement("a");
        a.style.display = "none";
        a.download = true;
        a.href = fileUrl;

        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const [active, setActive] = useState<FileType>();
    const [isShow, setIsShow] = useState<boolean>(false);

    // 复制文件的 url
    const copyFileUrl = (fileUrl: string) => {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", fileUrl);
        input.select();
        document.execCommand("copy");
        message.success("复制文件路径成功", 1);
        document.body.removeChild(input);
    };

    const videoBox = useRef(null);
    const handlePlay = (file: FileType) => {
        const dom: any = videoBox;
        if (dom.current) {
            dom.current.childNodes[0].pause();
            dom.current.childNodes[0].src = "";
            dom.current.childNodes[0].childNodes[0].src = "";
            dom.current.removeChild(dom.current.childNodes[0]);

            const video: any = document.createElement("video");
            video.controls = true;
            video.autoPlay = true;

            if (!file.fileUrl) {
                message.error("文件URL不存在");
                return;
            }
            const source = document.createElement("source");
            source.src = file.fileUrl;
            source.type = "video/mp4";
            video.appendChild(source);
            dom.current.appendChild(video);
        }
    };

    const isVideo = (file: FileType) => {
        if (!file) {
            return false;
        }
        const tail = file.filename.split(".")?.slice(-1)?.[0];
        const videoTailList = ["mov", "mp4"];
        return videoTailList.some((item) => item === tail.toLowerCase());
    };

    return (
        <>
            {list.map((file) => (
                <div
                    key={file.file_id}
                    className={styles.fileBox}
                    style={style}
                    onClick={() => {
                        if (isVideo(file)) {
                            handlePlay(file);
                        }
                        setActive(file);
                        setIsShow(true);
                    }}
                >
                    <div className={styles.name}>
                        {file.originalname}
                        <div className={styles.background}>
                            <PlayCircleOutlined />
                        </div>
                    </div>
                </div>
            ))}
            <MyModal title={active?.originalname} visible={isShow} onCancel={() => setIsShow(false)} showFooter={false}>
                <Space size={10} orientation="vertical" style={{ display: "flex" }}>
                    <div className={styles.videoBox} style={{ display: active && isVideo(active) ? "" : "none" }} ref={videoBox}>
                        <audio controls autoPlay>
                            <source src={""} />
                        </audio>
                    </div>
                    {/* <div className={styles.name}>{active?.originalname}</div> */}
                    <div className={styles.size}>大小：{handleComputedFileSize(Number(active?.size || 0))}</div>
                    <div className={styles.time}>创建时间：{active?.cTime}</div>
                    <Space size={8}>
                        {active && !isVideo(active) && active.fileUrl && <Button onClick={() => handleDownload(active.fileUrl!)}>下载文件</Button>}
                        {active && active.fileUrl && <Button onClick={() => copyFileUrl(active.fileUrl!)}>复制文件路径</Button>}
                    </Space>
                </Space>
            </MyModal>
        </>
    );
};

export default PreviewFiles;
