import { getSettings } from "@xiaxiazheng/blog-libs";
import React, { createContext, useEffect, useState } from "react";

type NameType = "today" |
    "done" |
    "after" |
    "footprint" |
    "onlyToday" |
    "life" |
    "doing" |
    "isTarget" |
    "isNote" |
    "isDirectory" |
    "isWork" |
    "isEncode" |
    "isFollowUp" |
    "isBookMark" |
    "isShow";

export interface SettingsType {
    todoNameMap?: Record<NameType, any>;
    todoDescriptionMap?: Record<string, any>;
    todoPoolDefaultShow?: number;
    todoColorNameMap?: Record<string, any>;
    todoColorMap?: Record<string, any>;
    todoCategoryDefaultShow?: number;
    todoDefaultColor?: number;
    quickDecisionConfig?: Record<string, any>;
    todoShowBeforeToday?: Record<string, any>;
    todoPreset?: Record<string, any>;
    HomeTodoAllowConfig?: Record<string, any>;
    HomeTodoAllowShow?: boolean;
};

export const SettingsContext = createContext<Partial<SettingsType>>({});

/** 保存用户信息 */
export const SettingsProvider: React.FC = (props) => {
    const [settings, setSettings] = useState<Partial<SettingsType>>({});

    useEffect(() => {
        getSettings().then((res) => {
            setSettings(res);
        });
    }, []);

    return (
        <SettingsContext.Provider value={settings}>
            {/* @ts-ignore */}
            {props?.children}
        </SettingsContext.Provider>
    );
};

export const SettingsConsumer = SettingsContext.Consumer;