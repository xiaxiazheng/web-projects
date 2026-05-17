'use client';
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import PreviewImages from "../../components/common/preview-images";
import PreviewFiles, { FileType } from "../../components/common/preview-files";
import UploadImageFile from "../../components/common/upload-image-file";
import { addFolder, getFolder, getFileListByOtherId, getImageListByOtherId, ImageType } from "@xiaxiazheng/blog-libs";
import { FolderType } from "../../components/cloud/type";
import { FolderOutlined } from "@ant-design/icons";
import AffixBack from "../../components/common/affix/affix-back";
import AffixFooter from "../../components/common/affix/affix-footer";
import AffixAdd from "../../components/common/affix/affix-add";
import { Spin, message } from "antd";

export default function Cloud() {
    const [parent_id, setParentId] = useState<string>("root");

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([getFolderList(parent_id), getImageList(parent_id), getFileList(parent_id)]).finally(() => {
            setLoading(false);
        });
    }, [parent_id]);

    // 文件夹列表
    const [folderList, setFolderList] = useState<FolderType[]>([]);
    // 图片列表
    const [imageList, setImageList] = useState<ImageType[]>([]);
    // 文件列表
    const [fileList, setFileList] = useState<FileType[]>([]);

    // 获取文件夹列表
    const getFolderList = async (parent_id: string) => {
        setFolderList([]);
        const username = localStorage.getItem("username");
        if (!username) {
            return;
        }
        const res = await getFolder(parent_id, username);
        if (res) {
            setFolderList(res.data.sort((a: FolderType, b: FolderType) => new Date(b.cTime).getTime() - new Date(a.cTime).getTime()));
        }
    };

    // 获取图片列表
    const getImageList = async (parent_id: string) => {
        setImageList([]);
        const username = localStorage.getItem("username");
        if (!username) {
            return;
        }
        const res = await getImageListByOtherId(parent_id, username);
        console.log(res);
        if (res) {
            setImageList(res as ImageType[]);
        }
    };

    // 获取文件列表
    const getFileList = async (parent_id: string) => {
        setFileList([]);
        const username = localStorage.getItem("username");
        if (!username) {
            return;
        }
        const res = await getFileListByOtherId(parent_id, username);
        if (res) {
            setFileList(res as FileType[]);
        }
    };

    const addAFolder = async () => {
        const params = {
            name: "新建文件夹",
            parent_id,
        };
        const res = await addFolder(params);
        if (res) {
            message.success("新增文件夹成功");
            getFolderList(parent_id);
        } else {
            message.error("新增文件夹失败");
        }
    };

    return (
        <>
            <Header title="云盘" />
            <main>
                <Spin spinning={loading}>
                    <div className={styles.cloud}>
                        {folderList &&
                            folderList.map((item) => (
                                <div
                                    key={item.folder_id}
                                    className={styles.folder}
                                    onClick={() => setParentId(item.folder_id)}
                                >
                                    <FolderOutlined className={styles.icon} />
                                    <span className={styles.name}>{item.name}</span>
                                </div>
                            ))}
                        <PreviewImages imagesList={imageList} style={{ width: 85, height: 85}} />
                        <PreviewFiles filesList={fileList} style={{ width: 85, height: 85}} />
                        <UploadImageFile
                            type="cloud"
                            otherId={parent_id}
                            refreshImgList={() => {
                                getImageList(parent_id);
                                getFileList(parent_id);
                            }}
                        />
                    </div>
                    {parent_id !== "root" ? (
                        <AffixFooter type="fixed">
                            <AffixBack
                                onClick={() => {
                                    setParentId("root");
                                }}
                            />
                        </AffixFooter>
                    ) : (
                        <AffixFooter type="fixed">
                            <AffixAdd
                                isLeft={true}
                                onClick={() => {
                                    addAFolder();
                                }}
                            />
                        </AffixFooter>
                    )}
                </Spin>
            </main>
        </>
    );
}
