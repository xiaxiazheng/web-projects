'use client';
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { getMediaList } from "@xiaxiazheng/blog-libs";
import { Spin } from "antd";
import MyModal from "../../components/common/my-modal";

export const cdnUrl = 'http://cdn.xiaxiazheng.cn';

export default function Video() {
    const [loading, setLoading] = useState<boolean>(false);

    const [list, setList] = useState<any[]>();

    const getList = async () => {
        setLoading(true);
        const res = await getMediaList();
        if (res) {
            const list = res.filter((item: any) =>
                item.mimeType.includes("video")
            );
            setList(list);
            console.log('list', list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getList();
    }, []);

    const videoBox = useRef(null);
    const handlePlay = (item: any) => {
        const dom: any = videoBox;
        if (dom.current) {
            dom.current.childNodes[0].pause();
            dom.current.childNodes[0].src = "";
            dom.current.childNodes[0].childNodes[0].src = "";
            dom.current.removeChild(dom.current.childNodes[0]);

            const video: any = document.createElement("video");
            video.controls = true;
            video.autoPlay = true;

            const source = document.createElement("source");
            source.src = `${cdnUrl}/${item.key}`;
            source.type = item.mimeType;
            video.appendChild(source);
            dom.current.appendChild(video);
        }
        setVisible(true);
    }

    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <Header title="video" />
            <main>
                <Spin spinning={loading}>
                    <div className={styles.video}>
                        {
                            list?.map((item, index) => {
                                return <div key={index} onClick={() => handlePlay(item)}>{item.key}</div>
                            })
                        }
                    </div>
                    <MyModal visible={visible} onCancel={() => setVisible(false)}>
                        <div className={styles.videoBox} ref={videoBox}>
                            <audio controls autoPlay>
                                <source src={""} />
                            </audio>
                        </div>
                    </MyModal>
                </Spin>
            </main>
        </>
    );
}
