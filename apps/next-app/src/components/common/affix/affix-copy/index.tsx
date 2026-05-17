import styles from "./index.module.scss";
import { Button } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { message } from "antd";

interface Props {
    copyUrl?: string;
}

const AffixCopy: React.FC<Props> = (props) => {
    const { copyUrl } = props;

    const router = useRouter();

    // 复制文件的 url
    const copyFileUrl = () => {
        if (!copyUrl) {
            message.warning("没有可复制的内容");
            return;
        }
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", copyUrl);
        input.select();
        document.execCommand("copy");
        message.success("复制文件路径成功", 1);
        document.body.removeChild(input);
    };

    return (
        <Button
            className={styles.back}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => copyFileUrl()}
            icon={<ShareAltOutlined />}
        />
    );
};

export default AffixCopy;
