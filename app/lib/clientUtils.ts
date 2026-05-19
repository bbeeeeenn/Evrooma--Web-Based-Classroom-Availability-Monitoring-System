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
