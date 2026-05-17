import { getFetch, postFetch } from ".";

export const GetNoteList = async (params: any) => {
    const res = await postFetch(`/note/getNoteList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const GetNoteCategory = async () => {
    return await getFetch(`/note/getNoteCategory`);
};

export const GetNoteById = async (note_id: string) => {
    const res: any = await getFetch(`/note/getNoteById?note_id=${note_id}`);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const AddNote = async (params: any) => {
    const res = await postFetch(`/note/addNote`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const EditNote = async (params: any) => {
    const res = await postFetch(`/note/editNote`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};
