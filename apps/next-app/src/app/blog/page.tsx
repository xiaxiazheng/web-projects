'use client';
import Header from "../../components/common/header";
import { useRouter } from "next/navigation";
import styles from "./index.module.scss";
import { GetBlogList } from "@xiaxiazheng/blog-libs";
import { useEffect, useState } from "react";
import { Input, Pagination } from "antd";
import { BlogListType } from "../../components/blog/types";

const { Search } = Input;

export default function Blog() {
    const router = useRouter();

    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const pageSize = 10;

    const [list, setList] = useState<BlogListType[]>([]);
    const [keyword, setKeyword] = useState<string>("");

    const getData = async () => {
        const params = {
            pageNo,
            pageSize,
            orderBy: "modify",
            keyword,
            activeTagId: "",
        };
        const res = await GetBlogList(params);
        if (res) {
            const data = res.data;
            setList(data.list);
            setTotal(data.total);
        }
    };

    useEffect(() => {
        getData();
    }, [pageNo]);

    const handleClick = (item: BlogListType) => {
        router.push(`/blog/${item.blog_id}`);
    };

    return (
        <>
            <Header title="我的日志" />
            <main>
                <div className={styles.blog}>
                    <h3 className={styles.head}>我的日志({total})</h3>
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
                    <div className={styles.list}>
                        {list.map((item) => {
                            return (
                                <div
                                    key={item.blog_id}
                                    className={`${styles.list_item} ${item.isStick === "true" ? styles.isStick : ""}`}
                                    onClick={() => handleClick(item)}
                                >
                                    <div className={styles.title}>{item.title}</div>
                                    <div>
                                        {item.mTime}
                                        {item.tag && (
                                            <span className={styles.tag}>
                                                {item.tag.map((item) => (
                                                    <span key={item.tag_id}>{item.tag_name}</span>
                                                ))}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Pagination
                        className={styles.pagination}
                        pageSize={pageSize}
                        current={pageNo}
                        total={total}
                        size="small"
                        onChange={(val) => setPageNo(val)}
                    />
                </div>
            </main>
        </>
    );
}
