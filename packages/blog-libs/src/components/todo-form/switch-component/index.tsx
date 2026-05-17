import React, { PropsWithChildren } from "react";
import { Button } from "antd";
import TodoTypeIcon, { TodoType } from "../../todo-type-icon";
import ButtonSwitch from "../button-switch";
import { useSettingsContext } from "../../../hooks/useSettingsContext";

interface IProps {
    type: TodoType;
    value?: string;
    onChange?: (val: '0' | '1') => void;
}

const SwitchCompent = (props: IProps) => {
    const { type, value, onChange } = props;

    const { todoNameMap } = useSettingsContext();

    return (
        <ButtonSwitch value={value} onChange={onChange}>
            <span>
                <TodoTypeIcon
                    type={type}
                    style={{
                        marginRight: 5,
                        color: type === 'isWork' ? "#00d4d8" : "#ffeb3b",
                    }}
                />{" "}
                {todoNameMap?.[type]}
            </span>
        </ButtonSwitch>
    );
};

export default SwitchCompent;
