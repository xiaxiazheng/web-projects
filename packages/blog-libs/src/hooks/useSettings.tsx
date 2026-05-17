import { useEffect, useReducer, useState } from "react";
import { getSettings } from "../fetch/settings";
import { SettingsType } from "./settingsContext";

let lastSettings = {};
let isRequesting = false;
// 有 bug，无法应对并发
export const useSettings = () => {
    const [settings, setSettings] = useState<Partial<SettingsType>>({});

    const getSettingsData = async () => {
        isRequesting = true;
        const res = await getSettings();
        setSettings(res);
        lastSettings = res;
        isRequesting = false;
    };

    useEffect(() => {
        if (JSON.stringify(settings) === "{}") {
            if (JSON.stringify(lastSettings) !== "{}") {
                setSettings(lastSettings);
            } else {
                !isRequesting && getSettingsData();
            }
        }
    }, [settings]);

    return settings;
};
