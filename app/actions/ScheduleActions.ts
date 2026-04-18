"use server";

import { adminRoomsPage, instructorSchedulesPage } from "@/constants";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Room } from "@/app/mongoDb/models/room";
import { Schedule } from "@/app/mongoDb/models/schedule";
import { Instructor } from "@/app/mongoDb/models/user";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { AuthenticateAdmin } from "./AdminAuthActions";
import type { ServerActionResponse } from "./_";
import type {
    DayOfWeek,
    Meridiem,
    Minute,
    NewSchedule,
} from "../(site)/admin/(dashboard)/rooms/[building]/[classroom]/create-schedule/NewScheduleProvider";

export type NewScheduleInput = Omit<NewSchedule, "day"> & {
    day: DayOfWeek[];
};

const dayOrder: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat"];

function normalizeHour(hour: number, meridiem: Meridiem): number {
    const safeHour = Math.trunc(hour);
    const normalizedHour = safeHour % 12;
    const baseHour = normalizedHour === 0 ? 12 : normalizedHour;
    return meridiem === "am"
        ? baseHour % 12
        : baseHour === 12
          ? 12
          : baseHour + 12;
}

function normalizeMinute(minute: Minute): number {
    return minute;
}

function toMinutes(hour: number, minute: number): number {
    return hour * 60 + minute;
}

function hasTimeConflict(
    existingStart: number,
    existingEnd: number,
    newStart: number,
    newEnd: number,
): boolean {
    return existingStart < newEnd && existingEnd > newStart;
}

function dayLabel(day: DayOfWeek): string {
    switch (day) {
        case "mon":
            return "Monday";
        case "tue":
            return "Tuesday";
        case "wed":
            return "Wednesday";
        case "thu":
            return "Thursday";
        case "fri":
            return "Friday";
        case "sat":
            return "Saturday";
    }
}

export async function CreateSchedule(
    newSchedule: NewScheduleInput,
): Promise<ServerActionResponse> {
    if (!(await AuthenticateAdmin())) {
        return {
            status: "error",
            message: "Unauthorized.",
        };
    }

    const selectedDays = [...new Set(newSchedule.day)].filter((day) =>
        dayOrder.includes(day),
    );
    const instructorId = newSchedule.instructor?.id.trim() ?? "";
    const subject = newSchedule.subject.trim().toUpperCase();
    const roomId = newSchedule.roomId.trim();

    if (!isValidObjectId(roomId)) {
        return {
            status: "error",
            message: "Invalid classroom ID.",
        };
    }

    if (!isValidObjectId(instructorId)) {
        return {
            status: "error",
            message: "Please select a valid instructor.",
        };
    }

    if (!subject) {
        return {
            status: "error",
            message: "Please provide a subject or course name.",
        };
    }

    if (selectedDays.length === 0) {
        return {
            status: "error",
            message: "Please select at least one day.",
        };
    }

    const startHour = normalizeHour(
        newSchedule.startTime.hour,
        newSchedule.startTime.meridiem,
    );
    const endHour = normalizeHour(
        newSchedule.endTime.hour,
        newSchedule.endTime.meridiem,
    );
    const startMinute = normalizeMinute(newSchedule.startTime.minute);
    const endMinute = normalizeMinute(newSchedule.endTime.minute);
    const newStartMinutes = toMinutes(startHour, startMinute);
    const newEndMinutes = toMinutes(endHour, endMinute);

    if (
        endHour < startHour ||
        (endHour === startHour && endMinute <= startMinute)
    ) {
        return {
            status: "error",
            message: "End time must be later than start time.",
        };
    }

    try {
        await connectDB();

        const room = await Room.findById(roomId).lean();
        if (!room) {
            return {
                status: "error",
                message: "Classroom with such ID was not found.",
            };
        }

        const instructor = await Instructor.findById(instructorId).lean();
        if (!instructor) {
            return {
                status: "error",
                message: "Instructor with such ID was not found.",
            };
        }

        for (const day of selectedDays) {
            const dayOfWeek = dayLabel(day);
            const daySchedules = await Schedule.find({
                $or: [{ room: room._id }, { instructor: instructor._id }],
                "slot.dayOfWeek": dayOfWeek,
            }).lean();

            const conflictingSchedule = daySchedules.find((schedule) => {
                if (!schedule.slot) {
                    return false;
                }

                const existingStart = toMinutes(
                    schedule.slot.start.hour,
                    schedule.slot.start.minute,
                );
                const existingEnd = toMinutes(
                    schedule.slot.end.hour,
                    schedule.slot.end.minute,
                );

                return hasTimeConflict(
                    existingStart,
                    existingEnd,
                    newStartMinutes,
                    newEndMinutes,
                );
            });

            if (conflictingSchedule) {
                const matchesRoom =
                    conflictingSchedule.room.toString() === room._id.toString();
                const matchesInstructor =
                    conflictingSchedule.instructor.toString() ===
                    instructor._id.toString();

                return {
                    status: "error",
                    message: `Schedule conflicts with an existing ${
                        matchesRoom && matchesInstructor
                            ? "room and instructor"
                            : matchesRoom
                              ? "classroom"
                              : "instructor"
                    } schedule on ${dayOfWeek}.`,
                };
            }
        }

        const createdSchedules = await Promise.all(
            selectedDays
                .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
                .map((day) =>
                    Schedule.create({
                        room: room._id,
                        instructor: instructor._id,
                        subject,
                        slot: {
                            dayOfWeek: dayLabel(day),
                            start: {
                                hour: startHour,
                                minute: startMinute,
                            },
                            end: {
                                hour: endHour,
                                minute: endMinute,
                            },
                        },
                    }),
                ),
        );

        revalidatePath(`${adminRoomsPage}/${room.building}/${room._id}`);
        revalidatePath(`${adminRoomsPage}/${room.building}`);
        revalidatePath(adminRoomsPage);
        revalidatePath(instructorSchedulesPage);

        return {
            status: "success",
            message: `${createdSchedules.length} schedule${
                createdSchedules.length === 1 ? "" : "s"
            } created successfully.`,
        };
    } catch (e) {
        console.error("[CreateSchedule]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}
