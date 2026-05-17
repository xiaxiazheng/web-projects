import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import markdownIt from "markdown-it";
import hljs from 'highlight.js'
import "highlight.js/styles/vs2015.css";
import ImgShowModal from "../img-show-modal";
import { message } from "antd";
import { decodeForHTMLAttribute, encodeForHTMLAttribute, getIsH5, handleCopy } from "../../utils";

interface PropsType {
    blogcont: string | undefined;
    style?: React.CSSProperties;
    keyword?: string; // 用于高亮的关键字
}

const MarkdownShow: React.FC<PropsType> = (props) => {
    const { blogcont, style, keyword } = props;

    const isH5 = getIsH5();

    function keywordHighlightPlugin(md: any, options: any) {
        const { keyword } = options;
        const originalTextRenderer = md.renderer.rules.text; // 原本的默认处理也只是 escapeHtml 而已

        md.renderer.rules.text = (tokens: any, idx: any, options: any, env: any, self: any) => {
            const text = originalTextRenderer(tokens, idx, options, env, self);
            let k = keyword?.trim();
            if (!k || k === "") {
                return text;
            }
            const list = k.split(" ").filter((item: string) => !!item);
            const regex = new RegExp(list.join('|'), 'gi');
            // 使用正则表达式替换关键词
            return text.replace(regex, (match: any) => {
                return `<span class=${styles.highLightKeyword}>${match}</span>`;
            });
        };
    }

    function imagePlugin(md: any, options: any) {
        const originalImageRenderer = md.renderer.rules.image;

        md.renderer.rules.image = (tokens: any, idx: any, options: any, env: any, self: any) => {
            const image = originalImageRenderer(tokens, idx, options, env, self);
            return `<div style="display: inline-block;">${image}<div style="text-align: center;color: #908080;">${tokens[idx].content}</div></div>`;
        }
    }

    const md: any = markdownIt({
        highlight: function (str: string, lang: string) {
            const copyBtn = `<div
                class="copybtn ${isH5 ? '' : 'copybtnWeb'}"
                data-type="copy"
                data-copydata="${encodeForHTMLAttribute(str)}"
            >复制</div>`;
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return `<pre><code class="hljs">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code>${copyBtn}</pre>`;
                } catch (__) { }
            }
            return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code>${copyBtn}</pre>`;
        }
    }).use(keywordHighlightPlugin, {
        keyword
    }).use(imagePlugin);

    /** image 和 code 点击的事件委托 */
    const ref = React.useRef(null);
    const handleClick = (e: any) => {
        const target: HTMLImageElement = e.target;
        if (target?.tagName === 'IMG') {
            setCurrentImage(target.src);
            setCurrentAlt(target.alt);
        }
        if (target?.dataset?.type === 'copy' && target?.dataset?.copydata) {
            try {
                const codeData = decodeForHTMLAttribute(target.dataset.copydata);
                handleCopy(codeData);
            } catch(e) {
                message.error('解析出错了')
            }
        }
    }

    const [currentAlt, setCurrentAlt] = useState<string>();
    const [currentImage, setCurrentImage] = useState<string>();
    useEffect(() => {
        const container = ref.current;
        if (container) {
            // @ts-ignore
            container.addEventListener('click', handleClick);
        }

        return () => {
            if (container) {
                // @ts-ignore
                container.removeEventListener('click', handleClick);
            }
        }
    }, []);

    return (
        <>
            <div
                className={styles.markdownShower}
                ref={ref}
                style={style}
                dangerouslySetInnerHTML={{
                    __html: md.render(blogcont || ''),
                }}
            />
            {currentImage && <ImgShowModal
                imgUrl={currentImage}
                title={currentAlt}
                onClose={() => {
                    setCurrentImage(undefined);
                    setCurrentAlt(undefined);
                }}
            />}
        </>
    );
};

export default MarkdownShow;
