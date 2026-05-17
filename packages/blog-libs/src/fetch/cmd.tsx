import { postFetch } from ".";

/** exec */
export async function exec(cmd: string): Promise<any> {
    const res = await postFetch(`/cmd/exec`, {
        cmd,
    });
    if (res) {
        return res && res.resultsCode === "success" ? res.data : false;;
    } else {
        return false;
    }
}