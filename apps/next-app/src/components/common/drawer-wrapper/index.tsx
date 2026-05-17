import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Drawer, DrawerProps } from "antd";
import useTouchEvent from "../../../hooks/useTouchEvent";

const DrawerWrapper: React.FC<DrawerProps> = (props) => {
    const { title, open, onClose, placement = "bottom", footer, height = "75vh", className, ...rest } = props;

    const ref = useRef(null);
    // useTouchEvent({
    //     ref,
    //     event: (e) => {
    //         onClose(e);
    //     }
    // });

    return (
        <Drawer
            open={open}
            placement={placement}
            className={`${styles.drawer} ${className}`}
            onClose={onClose}
            footer={footer}
            title={title}
            closeIcon={null}
            closable={false}
            size={height}
            push={{ distance: 5 }}
            {...rest}
        >
            <div ref={ref} className={styles.content}>{props.children}</div>
        </Drawer>
    );
};

export default DrawerWrapper;
