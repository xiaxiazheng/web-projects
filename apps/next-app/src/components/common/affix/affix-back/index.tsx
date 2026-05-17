import styles from "./index.module.scss";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface Props {
    backUrl?: string;
    onClick?: Function;
}

const AffixBack: React.FC<Props> = (props) => {
    const { backUrl, onClick } = props;

    const router = useRouter();

    return (
        <Button
            className={styles.back}
            type="primary"
            danger
            shape="circle"
            size="large"
            onClick={() => (onClick ? onClick() : backUrl ? router.push(backUrl) : router.back())}
            icon={<RollbackOutlined />}
        />
    );
};

export default AffixBack;
