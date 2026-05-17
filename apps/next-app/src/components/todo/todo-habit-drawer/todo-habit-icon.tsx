import React, { useContext } from "react";
import styles from "./index.module.scss";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { handleIsTodayPunchTheClock } from "../todo-form-habit/utils";
import { TodoTypeIcon } from "@xiaxiazheng/blog-libs";

const TodoHabitIcon = (props: { item: TodoItemType }) => {
    const { item } = props;

    if (item.isDirectory !== '1') {
        return null;
    }

    const isTodayDone = handleIsTodayPunchTheClock(item);

    return (
      <TodoTypeIcon
        type="isDirectory"
          className={styles.habitIcon}
          style={{
              color: isTodayDone ? "#52d19c" : "#f5222d",
          }}
      />
    );
};

export default TodoHabitIcon;
