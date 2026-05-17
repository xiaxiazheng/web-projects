import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { message, Progress, UploadFile } from "antd";
import { UploadType, handleComputedFileSize, UploadComponent } from "@xiaxiazheng/blog-libs";
import { PlusOutlined } from "@ant-design/icons";
import MyModal from "../my-modal";

interface Props {
    type: UploadType;
    otherId?: string;
    refreshImgList: Function;
    style?: any;
}

let maxConcurrent = 5;

const UploadImageFile: React.FC<Props> = (props) => {
    const { type, otherId = '', refreshImgList, style } = props;

    const [username, setUsername] = useState<string>('');
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername || '');
    }, []);

    const [uploadFileList, setUploadFileList] = useState<UploadFile<any>[]>([]);

    const handleChange = (info: any) => {
        if (info.fileList.length > maxConcurrent) {
            return;
        }
        setUploadFileList(info.fileList);
        if (info.fileList.every((item: UploadFile<any>) => item.status === "done" || item.status === "error")) {
            refreshImgList();
        }
        // 上传成功触发
        if (info.file.status === "done") {
            message.success("上传图片成功");
        }
        // 上传失败触发
        if (info.file.status === "error") {
            message.error("上传图片失败");
        }
    };

    const beforeUpload = async (info: any, infoList: UploadFile<any>[]) => {
        if (infoList.length > maxConcurrent) {
            message.error(`单次最多只能上传 ${maxConcurrent} 张图片/文件`);
            return false;
        } else {
            setUploadFileList(infoList.map(item => {
                return {
                    ...item, // 这里的 item 是 File 类型的对象，直接用 ...item 没法获取到 File 类型的属性，所以需要手动添加
                    name: item.name,
                    size: item.size || 0,
                    type: item.type || '',
                    percent: 0,
                    status: "uploading",
                }
            }));
        }
    };

    const getUploadingList = (list: UploadFile<any>[]) => {
        return list.filter((item) => item.status !== "done" && item.status !== "error");
    };

    return (
        <div className={styles.upload_wrapper} onClick={(e) => {
            message.warning(`单次最多只能上传 ${maxConcurrent} 张图片/文件`);
            e.stopPropagation();
        }} style={style}>
            <UploadComponent
                upload_type={type}
                other_id={otherId}
                username={username}

                className={styles.upload}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                multiple
            >
                <PlusOutlined className={styles.addIcon} />
                点击上传图片/文件
            </UploadComponent>
            <MyModal visible={getUploadingList(uploadFileList).length !== 0} showFooter={false} title={"上传图片/文件"}>
                {getUploadingList(uploadFileList).map((item, index) => {
                    return (
                        <div className={styles.progress} key={index}>
                            <div className={styles.name}>{item.name}</div>
                            <div>{handleComputedFileSize(item.size || 0)}</div>
                            <div>进度：{(item.percent || 0).toFixed(1)}%</div>
                            <Progress
                                className={styles.progressBar}
                                strokeColor={{
                                    from: "#108ee9",
                                    to: "#87d068",
                                }}
                                percent={Number((item.percent || 0).toFixed(1))}
                                status="active"
                            />
                        </div>
                    );
                })}
            </MyModal>
        </div>
    );
};

export default UploadImageFile;
