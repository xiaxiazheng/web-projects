import styles from "./index.module.scss";
import { Button } from "antd";

interface Props {
    visible: boolean;
    title?: any;
    onOk?: Function;
    onCancel?: Function;
    children?: any;
    okText?: string;
    cancelText?: string;
    footer?: React.FC;
    showFooter?: boolean;
    style?: any;
}

const MyModal: React.FC<Props> = (props) => {
    const { title, visible, onOk, onCancel, okText, cancelText, footer: Footer, showFooter = true, style } = props;

    return (
        <div className={styles.my_modal} style={{ display: visible ? "flex" : "none" }}>
            <div className={styles.mask} onClick={() => onCancel && onCancel()} />
            <div className={styles.modal_box} style={style}>
                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.content}>{props.children}</div>
                {showFooter && (
                    <div className={styles.btn_wrap}>
                        {Footer ? (
                            <Footer />
                        ) : (
                            <>
                                {onCancel && <Button onClick={() => onCancel()}>{cancelText || "取消"}</Button>}
                                {onOk && (
                                    <Button onClick={() => onOk()} type="primary">
                                        {okText || "确定"}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyModal;
