/**
 * 在客户端组件中设置页面 metadata 的工具函数
 * 适用于 App Router 中的客户端组件
 */

export const setPageMetadata = (metadata: {
    title?: string;
    description?: string;
}) => {
    if (typeof window === 'undefined') return;

    if (metadata.title) {
        document.title = metadata.title;
    }

    if (metadata.description) {
        // 更新或创建 description meta 标签
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', metadata.description);
        } else {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            metaDescription.setAttribute('content', metadata.description);
            document.head.appendChild(metaDescription);
        }
    }
};
