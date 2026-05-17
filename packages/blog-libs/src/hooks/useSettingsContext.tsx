import { useContext, useEffect, useReducer, useState } from "react";
import { SettingsContext } from "./settingsContext";

/** 使用该 hooks 的组件需要包裹 SettingsProvider */
export const useSettingsContext = () => {
    const settings = useContext(SettingsContext);
    return settings;
};
