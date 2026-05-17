import styles from "./index.module.scss";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface Props {
    style?: any;
    type?: 'sticky' | 'fixed';
    children?: React.ReactNode;
}

const AffixFooter: React.FC<Props> = (props) => {
    const { type = 'sticky', children } = props;

    return (
        <div style={props.style} className={type === 'sticky' ? styles.footer : styles.fixed}>
            {children}
        </div>
    );
};

export default AffixFooter;
