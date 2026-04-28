import { isValidObjectId } from "mongoose";
import {
    PlainScheduleDocument,
    PopulatedPlainScheduleDocument,
    Schedule,
} from "../mongoDb/models/schedule";
import { connectDB } from "../mongoDb/mongodb";
import { AttendanceLog } from "../mongoDb/models/log";

export function slotToMinutes(
    value: { hour: number; minute: number } | Date,
): number {
    if (value instanceof Date) {
        return value.getHours() * 60 + value.getMinutes();
    }

    return value.hour * 60 + value.minute;
}

export function formatPH(date = new Date()): string {
    return date.toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function formatPHDateKey(date = new Date()): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    if (!year || !month || !day) {
        throw new Error("Unable to format PH date key.");
    }

    return `${year}-${month}-${day}`;
}

export function getAttendanceDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function GetTimeComponentsFromScheduleDocument(
    sched: PlainScheduleDocument | PopulatedPlainScheduleDocument,
) {
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
    const now = new Date(formatPH());
    try {
        await connectDB();
        const activeSchedule = await Schedule.findOne({
            room: roomId,
            "slot.dayOfWeek": now.getDay(),
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
                            now.getHours() * 60 + now.getMinutes(),
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
                            now.getHours() * 60 + now.getMinutes(),
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
) {
    const now = new Date(formatPH());
    const markedInUse = await AttendanceLog.findOne({
        schedule: activeSchedule._id,
        user: activeSchedule.instructor,
        attendanceDate: getAttendanceDateKey(now),
    }).lean();

    return markedInUse;
}
