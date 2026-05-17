import styles from "./index.module.scss";
import { getMediaList } from "@xiaxiazheng/blog-libs";
import { useEffect, useState } from "react";
import MusicPlayerComp from "./music-player";

const obj = {
    key: "杨宗纬 - 我离开我自己 (Live).flac",
    mimeType: "audio/flac",
};

type MusicType = typeof obj;

export interface MusicListType extends MusicType {
    name: string;
    url: string;
}

const cdnUrl = "http://cdn.xiaxiazheng.cn";
const hCdnUrl = "http://hcdn.xiaxiazheng.cn";

const MusicPlayerWrapper = () => {
    const [list, setList] = useState<MusicListType[]>([]);

    const getData = async () => {
        const data: MusicType[] = await getMediaList();
        if (!data) {
            return;
        }
        const username = localStorage.getItem("username");
        const url = username === "zyb" ? cdnUrl : hCdnUrl;
        setList(
            data
                .filter((item) => item.mimeType.indexOf("audio") !== -1)
                .map((item: MusicType) => {
                    return {
                        name: item.key,
                        url: `${url}/${item.key}`,
                        key: item.key,
                        mimeType: item.mimeType,
                    };
                })
        );
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className={styles.musicPlayer}>
            <MusicPlayerComp list={list} />
        </div>
    );
};

export default MusicPlayerWrapper;
