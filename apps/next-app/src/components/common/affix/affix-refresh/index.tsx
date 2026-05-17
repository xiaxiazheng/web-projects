import styles from "./index.module.scss";
import { Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";

interface Props {
    onClick: Function;
}

const AffixRefresh: React.FC<Props> = (props) => {
    const { onClick } = props;

    return (
        <Button
            className={styles.refresh}
            type="primary"
            danger
            shape="circle"
            size="large"
            onClick={() => onClick()}
            icon={<SyncOutlined spin />}
        />
    );
};

export default AffixRefresh;
