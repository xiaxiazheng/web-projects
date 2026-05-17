'use client';
import Header from "../../components/common/header";
import styles from "../blog/[blog_id]/blog_id.module.scss";
import { GetBlogList, GetBlogCont } from "@xiaxiazheng/blog-libs";
import { useEffect, useState } from "react";
import { OneBlogType } from "../../components/blog/types";
import AffixRefresh from "../../components/common/affix/affix-refresh";
import AffixCopy from "../../components/common/affix/affix-copy";
// 代码高亮
import "highlight.js/styles/vs2015.css";

export default function BlogRandom() {
    const [blog, setBlog] = useState<OneBlogType>();
    const [total, setTotal] = useState<number>();

    const getData = async () => {
        let count = total;
        if (!total) {
            // 先获取到 total
            const params = {
                pageNo: 1,
                pageSize: 1,
                orderBy: "modify",
                keyword: "",
                activeTagId: "",
            };
            const res = await GetBlogList(params);
            if (res) {
                const data = res.data;
                count = data.total;
                setTotal(data.total);
            }
        }

        // 如果 count 仍然是 undefined，说明获取 total 失败，直接返回
        if (!count || count === 0) {
            return;
        }

        // 然后计算出 offset，随机选一篇
        const params = {
            pageNo: Math.floor(count * Math.random()) + 1,
            pageSize: 1,
            orderBy: "modify",
            keyword: "",
            activeTagId: "",
        };
        const res = await GetBlogList(params);
        if (res) {
            const data = res.data;
            // 最后获取该日志
            const res1 = await GetBlogCont(data.list[0].blog_id);
            if (res1) {
                const data = res1.data;
                setBlog(data);
            }
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSwitch = () => {
        getData();
    };

    return (
        <>
            <Header title="随机日志" />
            <main>
                <div className={styles.blog_cont}>
                    <h3 className={styles.head}>{blog?.title}</h3>
                    <div className={styles.blogcontEditor}>
                        {blog?.blogcont && <div dangerouslySetInnerHTML={{ __html: blog.blogcont }}></div>}
                    </div>
                </div>
                <AffixCopy
                    copyUrl={blog?.blog_id ? `https://www.xiaxiazheng.cn/blog/${btoa(decodeURIComponent(blog.blog_id))}` : ''}
                />
                <AffixRefresh onClick={() => handleSwitch()} />
            </main>
        </>
    );
}
