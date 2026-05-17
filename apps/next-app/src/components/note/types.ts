import { FileType } from "../common/preview-files";
import { ImgType } from "../common/preview-images";

export type NoteType = {
    cTime: string;
    mTime: string;
    note: string;
    note_id: string;
    username: string;
    category: string;
    imgList: ImgType[];
    fileList: FileType[];
};
