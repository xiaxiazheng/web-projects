import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, message, Space, Modal, Tabs, Pagination, Tooltip, Drawer, Radio } from "antd";
import { deleteTranslateItem, getTranslate, getTranslateList, switchTranslateMark } from "@xiaxiazheng/blog-libs";
import { StarFilled, InfoCircleFilled, DeleteOutlined } from "@ant-design/icons";
import DrawerWrapper from "../common/drawer-wrapper";

interface TranslateType {
    isMark: 0 | 1;
    isWord: 0 | 1;
    keyword: string;
    result: any;
    cTime: string;
    mTime: string;
    translate_id: string;
}

interface IProps {}

const { TextArea } = Input;
const { confirm } = Modal;

const HomeTranslate: React.FC<IProps> = (props) => {
    const pageSize = 8;
    const [keyword, setKeyword] = useState<string>();
    const [translate, setTranslate] = useState<any>();
    const [isMark, setIsMark] = useState<number>(1);
    const [pageNo, setPageNo] = useState<number>(1);
    const [list, setList] = useState<TranslateType[]>();
    const [total, setTotal] = useState<number>(0);
    const getList = async () => {
        const params: any = {
            pageNo,
            pageSize,
        };
        if (isMark) {
            params.isMark = isMark;
        }
        const res = await getTranslateList(params);
        if (res) {
            setList(
                res.data.list.map((item: any) => {
                    return {
                        ...item,
                        result: JSON.parse(item.result),
                    };
                })
            );
            setTotal(res.data.total);
        }
    };

    useEffect(() => {
        getList();
    }, [pageNo, isMark]);

    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    const handleTranslate = async () => {
        const str = keyword?.trim();
        if (!str) {
            message.warning("请输入要翻译的内容");
            return;
        }
        const res = await getTranslate(str);
        if (res) {
            const result = res?.result ? JSON.parse(res.result) : null;
            console.log(result);
            setTranslate({
                ...res,
                result,
            });
            if (pageNo === 1) {
                getList();
            }
        } else {
            setTranslate(undefined);
        }
    };

    // 加入 or 移出单词本
    const switchMark = async () => {
        if (!translate || !translate.translate_id) {
            message.error("请先查询翻译");
            return;
        }
        const newMark = translate.isMark === 1 ? 0 : 1;
        const res = await switchTranslateMark(translate.translate_id, newMark);
        if (res) {
            setTranslate({
                ...translate,
                isMark: newMark,
            });
            message.success("操作成功");
            getList();
        } else {
            message.error("操作失败");
        }
    };

    const handleDelete = async (e: any, item: TranslateType) => {
        e.stopPropagation();
        confirm({
            title: `你将删除"${item.keyword}"`,
            content: "Are you sure？",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                const res = await deleteTranslateItem(item.translate_id);
                if (res) {
                    message.success(`删除"${item.keyword}"成功`);
                    getList();
                } else {
                    message.error(`删除"${item.keyword}"失败，请重试`);
                }
            },
            onCancel() {
                message.info("已取消删除", 1);
            },
        });
    };

    const renderTranslateDict = (result: any, simple: boolean = false) => {
        if (!result?.dict) {
            return null;
        }
        const { ec, blng_sents_part, fanyi } = result.dict;
        return (
            <>
                {ec && (
                    <div>
                        {ec?.word?.map((word: any, wordIndex: number) => (
                            <Space key={wordIndex} orientation="vertical">
                                {(word?.usphone || word?.usphone) && (
                                    <div>
                                        <div className={styles.label}>音标：</div>
                                        <Space>
                                            {word?.usphone && (
                                                <span>
                                                    us: <span className={styles.phonetic}>[{word.usphone}]</span>
                                                </span>
                                            )}
                                            {word.ukphone && (
                                                <span>
                                                    uk: <span className={styles.phonetic}>[{word.ukphone}]</span>
                                                </span>
                                            )}
                                        </Space>
                                    </div>
                                )}
                                <div>
                                    <div className={styles.label}>单词翻译：</div>
                                    <div>
                                        {word?.trs?.map((trs: any, trsIndex: number) => (
                                            <div key={trsIndex}>
                                                {trs.tr.map((tr: any, trIndex: number) => (
                                                    <div key={trIndex}>
                                                        {tr?.l?.i?.map((i: any, iIndex: number) => (
                                                            <div key={iIndex}>{i}</div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {!simple && word?.wfs && (
                                    <div>
                                        <div className={styles.label}>其他形式：</div>
                                        <Space wrap>
                                            {word.wfs?.map((wfs: any, index: number) => (
                                                <div key={index}>
                                                    <span>{wfs?.wf?.name}</span>：<span>{wfs?.wf?.value}</span>
                                                </div>
                                            ))}
                                        </Space>
                                    </div>
                                )}
                            </Space>
                        ))}
                    </div>
                )}
                {fanyi?.tran && (
                    <div>
                        <div className={styles.label}>语句翻译：</div>
                        <div>{fanyi?.tran}</div>
                    </div>
                )}
                {!simple && blng_sents_part && (
                    <div>
                        <div className={styles.label}>例句：</div>
                        <Space orientation="vertical">
                            {blng_sents_part?.["sentence-pair"]?.map((item: any, index: number) => (
                                <div key={index}>
                                    <div>
                                        {index + 1}. {item?.["sentence"]}
                                    </div>
                                    <div>{item?.["sentence-translation"]}</div>
                                </div>
                            ))}
                        </Space>
                    </div>
                )}
            </>
        );
    };

    const renderTranslateSentence = (result: any) => {
        if (!result?.youdao) {
            return null;
        }
        return (
            <div>
                <div className={styles.label}>有道翻译：</div>
                {result.youdao?.translation?.map((item: any) => {
                    return <div key={item}>{item}</div>;
                })}
            </div>
        );
    };

    return (
        <div className={styles.content}>
            <Space orientation="vertical" style={{ width: "100%" }}>
                <TextArea value={keyword} onChange={(e) => setKeyword(e.target.value)} rows={3} />
                <Space className={styles.search}>
                    <Button onClick={() => handleTranslate()} type="primary" disabled={!keyword}>
                        查询
                    </Button>
                    {translate?.isMark === 1 && <span>当前查询已记录</span>}
                    {translate && (
                        <Button onClick={() => switchMark()} danger={translate.isMark === 1}>
                            {translate.isMark === 0 ? "save" : "remvoe"}
                        </Button>
                    )}
                    {translate && <Button onClick={() => setTranslate(undefined)}>clear</Button>}
                </Space>
                <Space
                    orientation="vertical"
                    className={styles.scrollArea}
                    onClick={() => {
                        !translate && setShowDrawer(true);
                    }}
                >
                    <div className={styles.keyword}>{translate?.keyword}</div>
                    {translate?.keyword && (
                        <Space orientation="vertical" className={`${styles.result} ScrollBar`}>
                            {renderTranslateDict(translate?.result)}
                            {renderTranslateSentence(translate?.result)}
                        </Space>
                    )}
                    {!translate && <div className={styles.btnMask}>查看搜索历史</div>}
                </Space>
                <Button type="primary" onClick={() => setShowDrawer(true)}>
                    查看搜索历史
                </Button>
                <DrawerWrapper
                    className={styles.drawer}
                    open={showDrawer}
                    onClose={() => setShowDrawer(false)}
                    height="85vh"
                    title={
                        <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            value={isMark}
                            onChange={(e) => {
                                setIsMark(e.target.value);
                                setPageNo(1);
                            }}
                        >
                            <Radio.Button value={1}>mark</Radio.Button>
                            <Radio.Button value={0}>all history</Radio.Button>
                        </Radio.Group>
                    }
                >
                    <Space orientation="vertical" className={styles.list}>
                        {list?.map((item) => {
                            return (
                                <div
                                    key={item.translate_id}
                                    className={`${styles.item} ${
                                        translate?.translate_id === item.translate_id ? styles.activeItem : ""
                                    }`}
                                    onClick={() => {
                                        setTranslate(item);
                                        setShowDrawer(false);
                                    }}
                                >
                                    {!!item.isMark && <StarFilled className={styles.starIcon} />}
                                    <div className={styles.keyword}>{item.keyword}</div>
                                    <div className={styles.content}>
                                        {renderTranslateDict(item.result, true)}
                                        {renderTranslateSentence(item.result)}
                                    </div>
                                    <Tooltip
                                        placement="left"
                                        title={
                                            <>
                                                <div>创建:{item.cTime}</div>
                                                <div>修改:{item.mTime}</div>
                                            </>
                                        }
                                    >
                                        <InfoCircleFilled className={styles.infoIcon} />
                                    </Tooltip>
                                    <Tooltip title="删除" placement="left">
                                        <DeleteOutlined
                                            onClick={(e) => handleDelete(e, item)}
                                            className={styles.deleteIcon}
                                        />
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </Space>
                    <Pagination
                        style={{ background: "#345582" }}
                        pageSize={pageSize}
                        total={total}
                        current={pageNo}
                        onChange={(page) => {
                            setPageNo(page);
                        }}
                    />
                </DrawerWrapper>
            </Space>
        </div>
    );
};

export default HomeTranslate;
