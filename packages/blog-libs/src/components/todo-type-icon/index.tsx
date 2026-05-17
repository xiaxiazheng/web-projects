import React from "react";
import { TodoIconMap } from "../../utils/todo";

export type TodoType = keyof typeof TodoIconMap;

interface IProps {
    type: TodoType;
    [x: string]: any;
}

const TodoTypeIcon: React.FC<IProps> = (props) => {
    const { type, ...rest } = props;

    const Component = TodoIconMap[type];

    if (!Component) {
        return <></>;
    }

    return <Component {...rest} />;
};

export default TodoTypeIcon;
