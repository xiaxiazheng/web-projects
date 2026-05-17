import { message } from "antd";

/** 复制到粘贴板（使用 Clipboard API） */
export const handleCopy = async (str: string) => {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(str);
            message.success("已复制到粘贴板");
        } else {
            throw new Error("Clipboard API 不可用");
        }
    } catch(e: any) {
        message.error(e.message);
        
        // 兼容性处理
        const input = document.createElement("textarea");
        document.body.appendChild(input);
        input.value = str;
        input.select();
        document.execCommand("copy");
        message.success("已复制到粘贴板");
        document.body.removeChild(input);
    }
};

export const debounce = (fn: (...args: any) => void, ms: number = 200) => {
    let timer: NodeJS.Timeout | null = null;
    return (...args: any) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, ms);
    }
}

export const getIsH5 = () => {
    return /\/m/i.test(location.href);
}

export const encodeForHTMLAttribute = (str: string) => {
    return str.replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;');
}

export const decodeForHTMLAttribute = (str: string) => {
    return str.replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}