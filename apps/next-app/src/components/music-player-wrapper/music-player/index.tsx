import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { message, Input } from "antd";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    RedoOutlined,
    TrademarkOutlined,
} from "@ant-design/icons";

import { MusicListType } from "../index";
import AffixSong from "../../common/affix/affix-song";

interface PropsType {
    list: MusicListType[];
}

// 放组件内会被不断初始化，要放这做全局变量
let timer: any = -1;

const Music: React.FC<PropsType> = (props) => {
    const { list: musicList } = props;

    useEffect(() => {
        setRandomList(musicList);
    }, [musicList]);

    const [isRandom, setIsRandom] = useState<boolean>(false);
    const [randomList, setRandomList] = useState<MusicListType[]>([]);
    const getRandomList = () => {
        if (!isRandom) {
            // 每次初始化生成随机列表
            const l = [...musicList].sort(() => Math.random() - Math.random());
            setRandomList(l);
            setIsRandom(true);
        } else {
            setRandomList(musicList);
            setIsRandom(false);
        }
        setTimeout(() => {
            anchoring();
        }, 200);
    };

    // 是否单曲循环
    const [isOneCircle, setIsOneCircle] = useState<boolean>(false);

    const musicBox = useRef(null);
    const [active, setActive] = useState<MusicListType>(); // 当前播放歌曲
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // 根据 active 的不同切换播放的歌曲
    useEffect(() => {
        if (active) {
            changeSong(active);
            setIsPlaying(false);
        }
    }, [active]);

    // 播放 song
    const changeSong = (song: MusicListType) => {
        // 清除上一个的定时器
        clearTimeout(timer);

        const dom: any = musicBox;
        if (dom.current) {
            dom.current.childNodes[0].pause();
            dom.current.childNodes[0].src = "";
            dom.current.childNodes[0].childNodes[0].src = "";
            dom.current.removeChild(dom.current.childNodes[0]);

            const audio: any = document.createElement("audio");
            audio.controls = true;
            audio.autoplay = true;

            // 更新播放按钮的状态
            audio.onplay = () => setIsPlaying(true);
            audio.onpause = () => setIsPlaying(false);

            // 监听播放结束，单曲循环或下一首
            audio.onended = handleFinish;

            const source = document.createElement("source");
            source.src = song.url;
            source.type = "audio/flac";

            audio.appendChild(source);
            dom.current.appendChild(audio);
        }
    };

    // 播放 & 暂停
    const handlePlaying = (bool: boolean) => {
        const dom: any = musicBox;
        if (dom.current && dom.current.childNodes && dom.current.childNodes.length === 1) {
            const music: any = dom.current.childNodes[0];
            if (bool) {
                music.play();
            } else {
                music.pause();
            }
            setIsPlaying(bool);
        }
    };

    // 处理播放完之后
    const handleFinish = () => {
        if (isOneCircle) {
            // 单曲循环
            active && changeSong(active);
        } else {
            // 播放完随机播放下一首
            playAfterSong();
        }
    };

    // 由于 hooks 的原因，要重新绑定这个事件才能获取到当前的 isOneCircle 的状态
    useEffect(() => {
        const dom: any = musicBox;
        if (dom.current) {
            const audio = dom.current.childNodes[0];
            audio.onended = handleFinish;
        }
    }, [isOneCircle]);

    // 处理选择歌曲
    const handleChoice = (item: MusicListType) => {
        setActive(item);
        message.success(`当前播放：${item.name}`, 1);
    };

    // 播放上一首
    const playBeforeSong = () => {
        let index = randomList.findIndex((item) => active && item === active);
        index = index === 0 ? randomList.length - 1 : index - 1;
        setActive(randomList[index]);
        message.success(`当前播放：${randomList[index].name}`, 1);
    };

    // 播放下一首
    const playAfterSong = () => {
        let index = randomList.findIndex((item) => active && item === active);
        index = index === randomList.length - 1 ? 0 : index + 1;
        setActive(randomList[index]);
        message.success(`当前播放：${randomList[index].name}`, 1);
    };

    // 获取上一首的名称
    const getBeforeSong = () => {
        let index = randomList.findIndex((item) => active && item === active);
        index = index === 0 ? randomList.length - 1 : index - 1;
        return randomList[index] ? randomList[index] : "";
    };

    // 获取下一首的名称
    const getAfterSong = () => {
        let index = randomList.findIndex((item) => active && item === active);
        index = index === randomList.length - 1 ? 0 : index + 1;
        return randomList[index] ? randomList[index] : "";
    };

    const [keyword, setKeyword] = useState<string>("");
    const getShowList = (list: MusicListType[]) => {
        if (keyword && keyword !== "") {
            return list.filter((item) => item.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
        } else {
            return list;
        }
    };

    const anchoring = () => {
        if (active?.key) {
            document.getElementById(`${active.key}`)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    };

    return (
        <div className={`${styles.music}`}>
            {/* 列表 */}
            <div className={`${styles.musicList}`}>
                {getShowList(randomList)?.map((item, index) => (
                    <span
                        key={item.key}
                        id={item.key}
                        onClick={() => handleChoice(item)}
                        className={active && active === item ? styles.active : ""}
                    >
                        <span className={styles.songIndex}>{index + 1}.</span> {item.name}
                    </span>
                ))}
            </div>
            <div className={styles.box}>
                <div className={styles.search}>
                    <Input value={keyword} onChange={(val) => setKeyword(val.target.value)} allowClear />
                </div>
                {/* 播放 */}
                <div className={styles.musicBox} ref={musicBox}>
                    <audio controls>
                        <source src={""} />
                    </audio>
                </div>
                <div className={styles.playingName} title={active?.name || ""}>
                    <span>{active?.name || "暂无播放"}</span>
                </div>
                {/* 控件 */}
                <div className={styles.iconBox}>
                    <RedoOutlined
                        className={`${styles.playIcon} ${isOneCircle ? styles.active : ""}`}
                        title={"单曲循环"}
                        onClick={() => setIsOneCircle(!isOneCircle)}
                    />
                    <ArrowLeftOutlined
                        className={styles.playIcon}
                        title={`上一首：${getBeforeSong()}`}
                        onClick={playBeforeSong}
                    />
                    {!isPlaying && (
                        <PlayCircleOutlined
                            className={`${styles.playIcon}`}
                            title={`播放`}
                            onClick={handlePlaying.bind(null, true)}
                        />
                    )}
                    {isPlaying && (
                        <PauseCircleOutlined
                            className={`${styles.playIcon}`}
                            title={`暂停`}
                            onClick={handlePlaying.bind(null, false)}
                        />
                    )}
                    <ArrowRightOutlined
                        className={styles.playIcon}
                        title={`下一首：${getAfterSong()}`}
                        onClick={playAfterSong}
                    />
                    <TrademarkOutlined
                        className={`${styles.playIcon} ${isRandom ? styles.active : ""}`}
                        title={"乱序循环"}
                        onClick={getRandomList}
                    />
                </div>
            </div>
            <AffixSong onClick={anchoring} />
        </div>
    );
};

export default Music;
