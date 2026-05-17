import { Upload, UploadProps } from "antd";
import React from "react";
import { staticUrl } from "../../fetch";
import { UploadType } from "./utils";

interface IProps extends UploadProps {
    other_id?: string;
    username: string;
    upload_type: UploadType;
}

const UploadComponent: React.FC<IProps> = (props) => {
    const { other_id, username, upload_type, ...rest } = props;

    return (
        <Upload
            name={upload_type}
            showUploadList={false}
            action={`${staticUrl}/api/${upload_type}_upload`}
            data={{
                other_id,
                username,
            }}
            listType="picture-card"
            {...rest}
        >
            {props.children}
        </Upload>
    );
}

export default UploadComponent;