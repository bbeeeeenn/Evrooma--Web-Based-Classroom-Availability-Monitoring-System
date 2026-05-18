import { isValidObjectId } from "mongoose";
import {
    PlainScheduleDocument,
    PopulatedPlainScheduleDocument,
    Schedule,
} from "../mongoDb/models/schedule";
import { connectDB } from "../mongoDb/mongodb";
import { AttendanceLog, PlainLogDocument } from "../mongoDb/models/log";
import crypto from "crypto";

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
        month: get("month"),
        year: get("year"),
        weekday: weekdays.indexOf(weekdayName),
    };
}

export function slotToMinutes(
    value: { hour: number; minute: number } | Date,
): number {
    if (value instanceof Date) {
        return value.getHours() * 60 + value.getMinutes();
    }

    return value.hour * 60 + value.minute;
}

export function formatPHDateKey(date = new Date()): string {
    const { year, month, day } = getPHDateTime(date);

    return `${year}-${month}-${day}`;
}

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
    const endMeridiem: "AM" | "PM" = sched.slot.start.hour < 12 ? "AM" : "PM";
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

export async function GetActiveSchedule(
    roomId: string,
): Promise<PopulatedPlainScheduleDocument | null> {
    if (!isValidObjectId(roomId)) return null;
    const { hour, minute, weekday } = getPHDateTime();

    try {
        await connectDB();
        const activeSchedule = await Schedule.findOne({
            room: roomId,
            "slot.dayOfWeek": weekday,
            $expr: {
                $and: [
                    {
                        $lte: [
                            {
                                $add: [
                                    {
                                        $multiply: ["$slot.start.hour", 60],
                                    },
                                    "$slot.start.minute",
                                ],
                            },
                            hour * 60 + minute,
                        ],
                    },
                    {
                        $gt: [
                            {
                                $add: [
                                    { $multiply: ["$slot.end.hour", 60] },
                                    "$slot.end.minute",
                                ],
                            },
                            hour * 60 + minute,
                        ],
                    },
                ],
            },
        })
            .populate("room")
            .populate("instructor")
            .lean({ virtuals: true });
        return activeSchedule;
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 *
 * Tells whether the schedule is currently marked in-use for the current day
 */
export async function IsInUseSchedule(
    activeSchedule: PopulatedPlainScheduleDocument | PlainScheduleDocument,
): Promise<boolean> {
    const markedInUse: PlainLogDocument = await AttendanceLog.findOne({
        schedule: activeSchedule._id,
        user: activeSchedule.instructor,
        attendanceDate: formatPHDateKey(),
    }).lean();

    return !!markedInUse;
}

export function NormalizeName(name: string): string {
    if (!name) return "";
    const cleaned = name
        .trim()
        .replace(/[^a-zA-Z\s'-]/g, "")
        .replace(/\s+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");

    return cleaned;
}

export function generateSimplePassword(length = 8): string {
    // AI GENERATED FUNCTION
    const charset = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    const hasWebCrypto =
        typeof globalThis !== "undefined" &&
        typeof globalThis.crypto !== "undefined" &&
        typeof globalThis.crypto.getRandomValues === "function";
    const hasNodeCrypto =
        typeof crypto !== "undefined" &&
        typeof crypto.randomBytes === "function";
    if (hasWebCrypto) {
        const cryptoObj = globalThis.crypto;
        const arr = new Uint32Array(length);
        cryptoObj.getRandomValues(arr);
        for (let i = 0; i < length; i++) {
            result += charset[arr[i] % charset.length];
        }
    } else if (hasNodeCrypto) {
        const buf = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
            result += charset[buf[i] % charset.length];
        }
    } else {
        for (let i = 0; i < length; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }
    }
    return result;
}
