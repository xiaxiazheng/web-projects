import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import useStorageState from "../../hooks/useStorageState";

const TitleWrapper: React.FC<any> = (props) => {
    const { title, list } = props;
    const [isCollapse, updateIsCollapse] = useStorageState(`isCollapse-${title}`);

    if (!list?.length) return null;

    return (
        <>
            <div className={styles.time} onClick={() => updateIsCollapse()}>
                <span>
                    {title} ({list?.length}) {!isCollapse ? <CaretDownOutlined /> : <CaretUpOutlined />}
                </span>
            </div>
            {!isCollapse && props.children}
        </>
    );
};

export default TitleWrapper;