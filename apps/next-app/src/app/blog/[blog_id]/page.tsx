'use client';
import Header from "../../../components/common/header";
import { useParams } from "next/navigation";
import styles from "./blog_id.module.scss";
import { GetBlogCont, MarkdownShow } from "@xiaxiazheng/blog-libs";
import { useEffect, useState } from "react";
import { OneBlogType } from "../../../components/blog/types";
import AffixBack from "../../../components/common/affix/affix-back";
import AffixCopy from "../../../components/common/affix/affix-copy";
// 代码高亮
import "highlight.js/styles/vs2015.css";

export default function BlogDetail() {
    const params = useParams();
    const blog_id = params.blog_id as string;

    const [blog, setBlog] = useState<OneBlogType>();

    const getData = async () => {
        const res = await GetBlogCont(blog_id);
        if (res) {
            const data = res.data;
            setBlog(data);
        }
    };

    useEffect(() => {
        if (blog_id) {
            getData();
        }
    }, [blog_id]);

    return (
        <>
            <Header title={blog?.title || "日志详情"} />
            <main>
                <div className={styles.blog_cont}>
                    <h3 className={styles.head}>{blog?.title}</h3>
                    <div className={styles.blogcontEditor}>
                        {blog?.edittype === 'richtext' && blog?.blogcont && <div dangerouslySetInnerHTML={{ __html: blog.blogcont }}></div>}
                        {blog?.edittype === 'markdown' && blog?.blogcont && <MarkdownShow blogcont={blog.blogcont} style={{ paddingLeft: 4 }} />}
                    </div>
                </div>
                <AffixCopy
                    copyUrl={blog?.blog_id ? `https://www.xiaxiazheng.cn/blog/${btoa(decodeURIComponent(blog.blog_id))}` : ''}
                />
                <AffixBack backUrl={"/blog"} />
            </main>
        </>
    );
}
