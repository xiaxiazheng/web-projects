import { postFetch } from ".";

export const postLogin = async ({ username, password }: { username: string; password: string }) => {
    const params = {
        username,
        password,
    };
    const res: any = await postFetch(`/auth/login`, params);
    if (res) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token)
        localStorage.setItem("username", username);
        return res;
    } else {
        return false;
    }
};

export async function checkLogin(): Promise<any> {
    return await postFetch(`/auth/checkLogin`, {});
}
