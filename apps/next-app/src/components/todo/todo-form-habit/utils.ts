import dayjs from "dayjs";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface TimeRange {
    startTime: string;
    target: number;
}

export const getToday = () => {
    return getZeroDay(dayjs().format('YYYY-MM-DD'));
}

export const getZeroDay = (date: string) => {
    return dayjs(`${date} 00:00:00`);
}

// 计算时间相关
// export const handleTimeRange = (timeRange: string) => {
//     const { startTime, target } = timeRangeParse(timeRange);
//     return {
//         startTime,
//         endTime: dayjs().format("YYYY-MM-DD"),
//         target,
//     };
// };

// 判断今天是否已打卡
export const handleIsTodayPunchTheClock = (item: TodoItemType): boolean => {
    if (!item || item?.isDirectory !== '1') return false;

    // 没有截止时间了，所以不用判断是否在打卡任务范围内了
    return item?.child_todo_list?.map((item) => item.time).includes(dayjs().format("YYYY-MM-DD")) || false;
};

// export const timeRangeStringify = ({ startTime, target }: TimeRange): string => {
//     return JSON.stringify({ startTime, target });
// };

// export const timeRangeParse = (val: string): TimeRange => {
//     return JSON.parse(val);
// };
