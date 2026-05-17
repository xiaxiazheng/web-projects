import styles from "./index.module.scss";
import { Button } from "antd";
import { FolderAddOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface Props {
    onClick: Function;
    isLeft?: boolean;
}

const AffixAdd: React.FC<Props> = (props) => {
    const { onClick, isLeft = false } = props;

    const router = useRouter();

    return (
        <Button
            className={styles.back}
            style={{ left: isLeft ? 20 : 'unset'}}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => onClick()}
            icon={<FolderAddOutlined />}
        />
    );
};

export default AffixAdd;
