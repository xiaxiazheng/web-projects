export type StatusType = "todo" | "done" | "target" | "bookMark" | "note" | "directory" | "followUp";
export enum TodoStatus {
    todo = 0,
    done = 1,
}

export interface ImageType {
    cTime: string;
    filename: string;
    has_min: "0" | "1"; // 是否有缩略图
    img_id: string;
    imgname: string;
    other_id: string;
    type: string;
    username: string;
    size: string;
  }

export interface FileType {
    cTime: string
    file_id: string
    filename: string
    originalname: string
    other_id: string
    type: string
    username: string
    size: string
  }

export interface TodoItemType extends EditTodoItemReq {
    cTime?: string;
    mTime?: string;

    imgList?: ImageType[];
    fileList?: FileType[];
    other_todo?: TodoItemType;
    child_todo_list?: TodoItemType[];
    child_todo_list_length?: number;
}

export interface CreateTodoItemReq {
  time: string;
  description: string;
  name: string;
  status: number | string;
  color: string;
  category: string;
  other_id?: string;
  doing: "0" | "1";
  isNote: "0" | "1";
  isTarget: "0" | "1";
  isBookMark: "0" | "1";
  isWork: "0" | "1";
  isDirectory: "0" | "1";
  isEncode: "0" | "1";
  isFollowUp: "0" | "1";
  isShow: "0" | "1";
}

export interface EditTodoItemReq extends CreateTodoItemReq {
    todo_id: string;
}