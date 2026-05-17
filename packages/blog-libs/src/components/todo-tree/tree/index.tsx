import React from "react";
import sytles from "./index.module.scss";

interface Props<T> {
    treeList: T[];
    renderTitle: (item: T) => React.ReactNode;
    renderChildren: (item: T) => React.ReactNode;
}

const Tree: <T>(props: Props<T>) => React.ReactElement = (
    props
) => {
    const { treeList, renderTitle, renderChildren } = props;

    const renderItem = (treeList?: any[]) => {
        return treeList?.map((item, index) => {
            const key = item?.key || index;
            if (item?.children?.length > 0) {
                return (
                    <div className={sytles.subTree} key={key}>
                        <div className={sytles.subTreeHeader}>
                            {renderTitle?.(item)}
                        </div>
                        <div className={sytles.subTreeContent}>
                            {renderItem(item.children)}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={key} className={sytles.treeItem}>
                        {renderChildren?.(item)}
                    </div>
                );
            }
        });
    };

    return <div className={sytles.tree}>{renderItem(treeList)}</div>;
};

export default Tree;
