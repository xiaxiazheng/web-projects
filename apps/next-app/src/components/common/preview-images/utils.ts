import localforage from "localforage";

// 将 canvas 变成 blob
// const canvasResizetoBlob = async (canvas) => {
//     return new Promise((resolve) => {
//         canvas.toBlob(
//             function (blob) {
//                 resolve(blob);
//             }
//             // imageType,
//             // quality
//         );
//     });
// };

// 将 image 对象变成 canvas 对象
export function imagetoCanvas(image: HTMLImageElement) {
    var cvs = document.createElement("canvas");
    var ctx = cvs.getContext("2d");
    if (!ctx) {
        throw new Error("无法获取 canvas context");
    }
    cvs.width = image.width;
    cvs.height = image.height;
    ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
    return cvs;
}

// 将 canvas 变成 blob
export const canvasResizetoDataUrl = (canvas: HTMLCanvasElement): string => {
    return canvas.toDataURL();
};

// 将 image 变成 base64
export const handleImageToBase64 = (src: string) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = (e) => {
            const canvas = imagetoCanvas(e.target as HTMLImageElement);
            const base64 = canvasResizetoDataUrl(canvas);
            resolve(base64);
        };
        img.crossOrigin = ""; // 让图片可以跨域，不会触发 canvas 的 CORS
        img.src = src;
    });
};

// 从缓存里找原图，如果没有找到，就返回 src，同时下载图片缓存到本地
export const handleOnloadImage = async (imageUrl: string, img_id: string, imgname: string) => {
    // gif 图是动画不能绘制在 canvas 上，出来的会是 png 图片，所以不能走 cache 了
    if (imgname.indexOf(".gif") !== -1) {
        return imageUrl;
    }

    // 其他类型的图片就走 cache 缓存
    const cache = await localforage.getItem(img_id);
    if (!cache) {
        const base64 = (await handleImageToBase64(imageUrl)) as string;
        localforage.setItem(img_id, base64);
        return base64;
    }
    return cache as string;
};

export const base64ByBlob = (base64: string) => {
    return new Promise((resolve) => {
        let arr = base64.split(",");
        const match = arr[0].match(/:(.*?);/);
        if (!match || !match[1]) {
            throw new Error("无效的 base64 格式");
        }
        const mime = match[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        resolve(new Blob([u8arr], { type: mime }));
    });
};

export const blobToUrl = (blob: Blob) => {
    return window.URL.createObjectURL(blob);
}
