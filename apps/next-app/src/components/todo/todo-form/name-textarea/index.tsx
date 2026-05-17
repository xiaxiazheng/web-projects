import { useState, useEffect, useRef } from "react";
import { Button, Input } from "antd";
import styles from "./index.module.scss";
import { DeleteOutlined } from "@ant-design/icons";

const NameTextArea = ({ value, onChange, handleDelete }: any) => {
    return (
        <div className={styles.nameTextArea}>
            <Input.TextArea
                value={value}
                onChange={onChange}
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
            />
            <Button
                className={styles.deleteIcon}
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={handleDelete}
                size="small"
                danger
            />
        </div>
    );
};

export default NameTextArea;
