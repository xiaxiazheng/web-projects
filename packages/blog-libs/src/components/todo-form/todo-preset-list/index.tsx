import React from "react";
import { useSettingsContext } from "../../../hooks/useSettingsContext";
import { Button, Space } from "antd";
import TodoTypeIcon from "../../todo-type-icon";
import TodoTypeIconList from "../../todo-item/todo-type-icon-list";

interface IProps {
    onClick: (item: any) => void;
}

const TodoPresetList: React.FC<IProps> = props => {
    const { onClick } = props;
    const { todoPreset, todoColorMap } = useSettingsContext();

    return (
        <Space wrap>
            {todoPreset?.map((item: any, index: number) => {
                return (
                    <Button
                        style={{
                            borderColor:
                                todoColorMap?.[item.color],
                        }}
                        key={index}
                        onClick={() => onClick(item)}
                    >
                        {item?.isWork === "0" && (
                            <TodoTypeIcon
                                type={"life"}
                                style={{ color: "#00d4d8" }}
                            />
                        )}
                        <TodoTypeIconList item={item} />
                        <span
                            style={{
                                color: todoColorMap?.[
                                    item.color
                                ],
                            }}
                        >{`${item?.category}`}</span>
                    </Button>
                );
            })}
        </Space>
    )
}

export default TodoPresetList;