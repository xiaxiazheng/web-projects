import { message } from "antd";
import { staticUrl } from "../../fetch";

export type UploadType = "main" | "cloud" | "treecont" | "blog" | "mao" | "note" | "todo";

export const handleUploadFile = async (params: { file: File, other_id?: string; username?: string; upload_type?: UploadType }) => {
    const formData = new FormData();
    formData.append("other_id", params?.other_id || "");
    formData.append("username", params?.username || "");
    formData.append(params?.upload_type || "", params.file);

    try {
        const res = await fetch(`${staticUrl}/api/${params?.upload_type || ""}_upload`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        return data;
    } catch (e: any) {
        console.log(e);
        message.error(e.message);
        return false;
    }
};

export const handleComputedFileSize = (size: number) => {
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)}KB`;
    } else {
        return `${(size / 1024 / 1024).toFixed(2)}MB`;
    }
};