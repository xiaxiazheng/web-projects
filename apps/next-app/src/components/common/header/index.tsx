'use client';
import React, { useEffect } from "react";

interface Props {
    title?: string;
    description?: string;
}

/**
 * Header 组件 - 用于在客户端组件中设置页面 metadata
 * 
 * 在 Next.js App Router 中：
 * - 服务端组件可以使用 metadata export
 * - 客户端组件需要使用 useEffect + document.title
 * 
 * 这个组件兼容原有的使用方式，同时支持动态设置 title
 */
const Header = (props: Props) => {
    const { title, description } = props;

    useEffect(() => {
        if (title) {
            // 设置页面标题
            document.title = title;
        }

        if (description) {
            // 更新或创建 description meta 标签
            let metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                metaDescription.setAttribute('content', description);
                document.head.appendChild(metaDescription);
            }
        }
    }, [title, description]);

    // 在 App Router 中，next/head 不会生效
    // viewport 和 favicon 已经在 layout.tsx 中配置
    // 这里只需要设置 title 和 description
    // 对于客户端组件，这是设置动态 metadata 的标准方式
    return null;
};

export default Header;
