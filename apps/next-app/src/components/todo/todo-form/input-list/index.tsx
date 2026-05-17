import React from "react";
import { Button, Input, message, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { splitStr } from "@xiaxiazheng/blog-libs";

const { TextArea } = Input;

const InputList = ({ value = "", onChange, handleParse }: any) => {
    const l = value.split(splitStr);

    const handleChange = (val: string, index: number) => {
        l[index] = val;
        onChange(l.join(splitStr).replaceAll("\n\n\n\n\n", splitStr));
    };

    const handleDelete = (index: number) => {
        l.splice(index, 1);
        onChange(l.join(splitStr));
    };

    const handleParse1 = async () => {
        const text = await navigator.clipboard.readText();;
        if (text) {
            handleParse(text)
        } else {
            message.warning("暂无文本");
        }
    }

    return (
        <Space size={4} orientation="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex" }}>
                <Button style={{ flex: 1 }} icon={<PlusOutlined />} onClick={() => onChange(`${splitStr}${value}`)}>
                    增加描述
                </Button>
                <Button style={{ width: 70, marginLeft: 5 }} onClick={() => handleParse1()}>
                    粘贴
                </Button>
            </div>
            {l?.map((item: string, index: number) => (
                <div key={index} className={styles.inputItem}>
                    <TextArea
                        className={styles.inputTextArea}
                        placeholder="补充以及具体描述"
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        style={{ wordBreak: "break-all" }}
                        value={item}
                        onChange={(e) => handleChange(e.target.value, index)}
                    />
                    <div className={styles.iconWrapper}>
                        <Button
                            icon={<DeleteOutlined className={styles.deleteIcon} style={{ color: "red" }} />}
                            onClick={() => handleDelete(index)}
                            danger
                            size="small"
                        />
                    </div>
                </div>
            ))}
        </Space>
    );
};

export default InputList;
