import styles from "./index.module.scss";
import PreviewImages from "../common/preview-images";
import UploadImageFile from "../common/upload-image-file";
import PreviewFiles from "../common/preview-files";
import { TodoItemType, TodoItem, TodoDescription } from "@xiaxiazheng/blog-libs";

interface Props {
    item: TodoItemType;
    isActive: boolean;
    showTitle?: boolean;
    getData: Function;
    maxImgCount?: number;
    descriptionClassName?: string;
    keyword?: string;
}

const TodoNoteItem = (props: Props) => {
    const { item, isActive, showTitle = true, getData, maxImgCount = -1, descriptionClassName, keyword } = props;
    return (
        <>
            <div className={`${styles.note_cont} ${isActive ? styles.active : ""}`}>
                {showTitle && <TodoItem item={item} showTime={false} keyword={keyword} />}
                {item.description !== "" && (
                    <div className={descriptionClassName}>
                        <TodoDescription
                            todoDescription={item.description}
                            keyword={keyword}
                        />
                    </div>
                )}
            </div>
            <div className={styles.imgFileList}>
                <PreviewImages
                    imagesList={maxImgCount !== -1 ? (item.imgList || []).slice(0, maxImgCount) : (item.imgList || [])}
                    style={{ margin: 0 }}
                />
                <PreviewFiles filesList={item.fileList || []} style={{ margin: 0 }} />
                {isActive && (
                    <UploadImageFile
                        type="todo"
                        otherId={item.todo_id}
                        refreshImgList={() => getData()}
                        style={{ margin: 0 }}
                    />
                )}
                {maxImgCount !== -1 && item.imgList && item.imgList.length > maxImgCount && (
                    <div style={{ opacity: 0.7 }}>还有 {item.imgList.length - maxImgCount} 张图</div>
                )}
            </div>
        </>
    );
};

export default TodoNoteItem;
