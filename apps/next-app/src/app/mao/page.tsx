'use client';
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { Input } from "antd";
import PreviewImages from "../../components/common/preview-images";
import UploadImageFile from "../../components/common/upload-image-file";
import MyModal from "../../components/common/my-modal";
import { getMaoList } from "@xiaxiazheng/blog-libs";
import { IMao } from "../../components/mao/types";
import PreviewFiles from "../../components/common/preview-files";

const { Search } = Input;

export default function MaoPu() {
    const [total, setTotal] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>();

    const [list, setList] = useState<IMao[]>([]);
    const [showList, setShowList] = useState<IMao[]>([]);

    // 处理猫咪的父母层级
    const handleParent = (list: IMao[]) => {
        const map: any = {};
        list.forEach((item) => {
            map[item.mao_id] = item;
        });
        // 给孩子带上父母，给父母带上孩子
        list.forEach((item) => {
            if (item.father_id) {
                if (map[item.father_id].children) {
                    map[item.father_id].children.push(map[item.mao_id]);
                } else {
                    map[item.father_id].children = [map[item.mao_id]];
                }
                item.fatherObject = map[item.father_id];
            }
            if (item.mother_id) {
                if (map[item.mother_id].children) {
                    map[item.mother_id].children.push(map[item.mao_id]);
                } else {
                    map[item.mother_id].children = [map[item.mao_id]];
                }
                item.motherObject = map[item.mother_id];
            }
        });

        return list;
    };

    // 获取猫的数据
    const getData = async () => {
        const res = await getMaoList();
        if (res) {
            const list = res.data.map((item: IMao) => {
                return {
                    ...item,
                    key: item.mao_id,
                    title: item.name,
                };
            });
            setList(handleParent(list));
            setTotal(list.length);
        }
    };

    const getShowList = () => {
        const l = keyword ? list.filter((item) => item.name.indexOf(keyword) !== -1) : list;
        setTotal(l.length);
        setShowList(l);
    };

    useEffect(() => {
        if (list?.length !== 0) {
            getShowList();
        } else {
            setShowList([]);
        }
    }, [list, keyword]);

    useEffect(() => {
        getData();
    }, []);

    const handleClick = (item: IMao) => {
        activeId === item?.mao_id ? setActiveId(undefined) : setActiveId(item?.mao_id);
    };

    const [activeId, setActiveId] = useState<string>();

    const Item = (props: { item: IMao; isShowAll?: boolean }) => {
        const { item, isShowAll = false } = props;
        if (!item) return null;

        const headList = item.headImgList;
        const imgList = item.imgList;
        const fileLsit = item.fileList;

        return (
            <>
                {isShowAll && (
                    <>
                        <div>出生日期：{item.birthday}</div>
                        <div>父亲：{item.father}</div>
                        <div>母亲：{item.mother}</div>
                    </>
                )}
                {isShowAll && <UploadImageFile type="mao" otherId={item.mao_id} refreshImgList={() => getData()} />}
                <PreviewImages imagesList={!isShowAll ? headList.slice(0, 1) : headList.concat(imgList)} />
                {isShowAll && <PreviewFiles filesList={fileLsit} />}
                {!isShowAll && <div style={{ marginTop: 10, fontSize: 16 }}>{item.name}</div>}
            </>
        );
    };

    return (
        <>
            <Header title={"猫"} />
            <main className={styles.note}>
                <h2 className={styles.h2}>
                    <span>猫 ({total})</span>
                </h2>
                <div>
                    <Search
                        className={styles.search}
                        placeholder="输入搜索"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        enterButton
                        allowClear
                        onSearch={() => {
                            getData();
                        }}
                    />
                </div>
                <div className={styles.content}>
                    <div className={styles.list}>
                        {showList.map((item) => {
                            const isActive = activeId === item.mao_id;
                            return (
                                <div
                                    key={item.mao_id}
                                    className={`${styles.list_item} ${isActive ? styles.active : ""}`}
                                    onClick={() => handleClick(item)}
                                >
                                    <Item item={item} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <MyModal
                    visible={!!activeId}
                    title={list.find((item) => item.mao_id === activeId)?.name}
                    onCancel={() => setActiveId(undefined)}
                    footer={() => null}
                    style={{ maxWidth: "100vw" }}
                >
                    {(() => {
                        const activeItem = list.find((item) => item.mao_id === activeId);
                        return activeItem ? <Item item={activeItem} isShowAll={true} /> : null;
                    })()}
                </MyModal>
            </main>
        </>
    );
}
