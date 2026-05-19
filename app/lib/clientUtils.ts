import {
    PlainScheduleDocument,
    PopulatedPlainScheduleDocument,
} from "../mongoDb/models/schedule";

export function GetTimeComponentsFromScheduleDocument(
    sched: PlainScheduleDocument | PopulatedPlainScheduleDocument,
): {
    startMeridiem: "AM" | "PM";
    startHour: number;
    startMinute: string;
    endMeridiem: "AM" | "PM";
    endHour: number;
    endMinute: string;
} {
    const startMeridiem: "AM" | "PM" = sched.slot.start.hour < 12 ? "AM" : "PM";
    const startHour =
        sched.slot.start.hour % 12 === 0 ? 12 : sched.slot.start.hour % 12;
    const startMinute = `${sched.slot.start.minute < 10 ? "0" : ""}${sched.slot.start.minute}`;
    const endMeridiem: "AM" | "PM" = sched.slot.end.hour < 12 ? "AM" : "PM";
    const endHour =
        sched.slot.end.hour % 12 === 0 ? 12 : sched.slot.end.hour % 12;
    const endMinute = `${sched.slot.end.minute < 10 ? "0" : ""}${sched.slot.end.minute}`;
    return {
        startMeridiem,
        startHour,
        startMinute,
        endMeridiem,
        endHour,
        endMinute,
    };
}
export function getPHDateTime(date = new Date()): {
    hour: number;
    minute: number;
    day: number;
    month: number;
    year: number;
    weekday: number; // 0 = Sunday, 6 = Saturday
} {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        weekday: "long",
        hour12: false,
    }).formatToParts(date);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parseInt(parts.find((p) => p.type === type)!.value, 10);

    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const weekdayName = parts.find((p) => p.type === "weekday")!.value;

    return {
        hour: get("hour"),
        minute: get("minute"),
        day: get("day"),
        month: get("month") - 1,
        year: get("year"),
        weekday: weekdays.indexOf(weekdayName),
    };
}
