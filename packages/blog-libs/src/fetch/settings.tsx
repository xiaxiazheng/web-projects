import { getFetch, postFetch } from ".";

/** 操作 settings */
export async function getSettings(): Promise<any> {
    const data = await getFetch(`/settings/getSettings`);
    return data && data.resultsCode === "success" ? data.data : false;
}

export async function getSettingsList(): Promise<any> {
    const data = await getFetch(`/settings/getSettingsList`);
    return data && data.resultsCode === "success" ? data.data : false;
}

export async function addSettings(params: {
    name: string;
    value: any;
    description?: string;
}): Promise<any> {
    const data = await postFetch(`/settings/addSettings`, params);
    return data && data.resultsCode === "success" ? true : false;
}

export async function updateSettings(params: {
    settings_id: string;
    name: string;
    value: any;
    description?: string;
}): Promise<any> {
    const data = await postFetch(`/settings/updateSettings`, params);
    return data && data.resultsCode === "success" ? true : false;
}

export async function deleteSettings(params: {
    settings_id: string;
}): Promise<any> {
    const data = await postFetch(`/settings/deleteSettings`, params);
    return data && data.resultsCode === "success" ? true : false;
}

export async function getSSLCertExpiry(): Promise<any> {
    const data = await getFetch(`/settings/ssl-cert-expiry`);
    return data && data.resultsCode === "success" ? data.data : false;
}
