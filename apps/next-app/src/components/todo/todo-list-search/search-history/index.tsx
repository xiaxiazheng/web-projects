import { Space } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

interface IProps {
    onSearch: (keyword: string) => void;
}

export const getHisotryList = () => {
    try {
        const historyList = localStorage.getItem("historyList");
        return historyList ? JSON.parse(historyList) : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const setHistoryWord = (item: string) => {
    if (item) {
        try {
            localStorage.setItem("historyList", JSON.stringify(Array.from(new Set([item].concat(getHisotryList())))));
        } catch (e) {
            console.error(e);
        }
    }
};

const clearHistoryWord = () => {
    try {
        localStorage.setItem("historyList", JSON.stringify([]));
    } catch (e) {
        console.error(e);
    }
};

const SearchHistory: React.FC<IProps> = (props) => {
    const { onSearch } = props;

    const [list, setList] = useState<string[]>([]);
    useEffect(() => {
        setList(getHisotryList());
    }, []);

    return (
        <Space size={8} orientation="vertical" className={styles.history}>
            {list.map((item, index) => {
                return (
                    <div key={index} className={styles.word}>
                        <span
                            onClick={() => {
                                onSearch(item);
                                setHistoryWord(item);
                            }}
                        >
                            {item}
                        </span>
                    </div>
                );
            })}
            {!!list.length && (
                <div className={styles.clearAll}>
                    <span
                        onClick={() => {
                            clearHistoryWord();
                            onSearch('');
                        }}
                    >
                        清空
                    </span>
                </div>
            )}
        </Space>
    );
};

export default SearchHistory;
