import { CheckCircle, Clock, DoorOpen, Hourglass, User, X } from "lucide-react";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "../mongoDb/models/schedule";
import { connectDB } from "../mongoDb/mongodb";
import ErrorFallback from "./ErrorFallback";
import { getPHDateTime, slotToMinutes } from "../lib/utils";
import { GetTimeComponentsFromScheduleDocument } from "../lib/clientUtils";
import { Divider } from "./Divider";
import { instructorRoomsPage } from "@/constants";
import clsx from "clsx";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { PopulatedPlainRoomDocument, Room } from "../mongoDb/models/room";
import {
    ClassroomStatus,
    GetClassroomStatus,
    GetNextScheduleForTheDay,
} from "../actions/ScheduleActions";
import { Suspense } from "react";
import Loading from "../(site)/loading";
import { ServerActionResponse } from "../actions/_";
import { CoolSchedules } from "./CoolSchedule";

const StatusMapRounded = {
    free: (
        <div className="font-dm-sans flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/15 px-2 py-1 text-xs font-semibold text-green-400 sm:text-sm">
            <span className="size-2 rounded-full bg-green-400"></span>Available
        </div>
    ),
    occupied: (
        <div className="font-dm-sans flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/15 px-2 py-1 text-xs font-semibold text-red-400 sm:text-sm">
            <span className="size-2 rounded-full bg-red-400"></span>Occupied
        </div>
    ),
    absent: (
        <div className="font-dm-sans flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/15 px-2 py-1 text-xs font-semibold text-orange-300 sm:text-sm">
            <span className="size-2 rounded-full bg-orange-300"></span>Absent
        </div>
    ),
};

async function Schedules({ roomId }: { roomId: string }) {
    let schedules: PopulatedPlainScheduleDocument[];
    try {
        await connectDB();
        schedules = await Schedule.find({ room: roomId })
            .sort({
                "slot.dayOfWeek": 1,
                "slot.start.hour": 1,
                "slot.start.minute": 1,
            })
            .populate("instructor")
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    const grouped = schedules.reduce(
        (acc, curr) => {
            const key = curr.slot.dayOfWeek;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
        },
        {} as { [key: number]: PopulatedPlainScheduleDocument[] },
    );

    const groupedSchedules = JSON.parse(
        JSON.stringify(grouped),
    ) as typeof grouped;

    return (
        <CoolSchedules groupedSchedules={groupedSchedules} type="instructor" />
    );
}

async function TodaysSchedule({ roomId }: { roomId: string }) {
    const { hour, minute, weekday } = getPHDateTime();
    const currentTime = { hour, minute };
    let schedules: PopulatedPlainScheduleDocument[];
    try {
        await connectDB();
        schedules = await Schedule.find({
            room: roomId,
            "slot.dayOfWeek": weekday,
        })
            .sort({ "slot.start.hour": 1, "slot.start.minute": 1 })
            .populate("instructor")
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }
    return (
        schedules.length > 0 && (
            <>
                <Divider text="Today's Schedule" />
                {schedules.map((sched) => {
                    const {
                        startMeridiem,
                        startHour,
                        startMinute,
                        endMeridiem,
                        endHour,
                        endMinute,
                    } = GetTimeComponentsFromScheduleDocument(sched);
                    const ongoing =
                        slotToMinutes(currentTime) >=
                            slotToMinutes(sched.slot.start) &&
                        slotToMinutes(currentTime) <
                            slotToMinutes(sched.slot.end);
                    const past =
                        slotToMinutes(currentTime) >=
                        slotToMinutes(sched.slot.end);
                    return (
                        <div
                            key={sched._id.toString()}
                            className={clsx(
                                "text-text-primary bg-green-secondary mt-2 flex flex-col gap-x-10 gap-y-2 border border-l-3 px-5 py-2.5 font-semibold sm:flex-row sm:items-center",
                                ongoing && "border-red-400/20 border-l-red-400",
                                past
                                    ? "border-transparent border-l-white/20"
                                    : "border-orange-300/20 border-l-orange-300",
                            )}
                        >
                            <div>
                                <p className="font-roboto-mono text-sm sm:text-base">
                                    {startHour}:{startMinute}
                                    {startMeridiem}-{endHour}:{endMinute}
                                    {endMeridiem}
                                </p>
                                <p className="text-text-primary/60 text-xs sm:text-sm">
                                    {ongoing
                                        ? "Now"
                                        : past
                                          ? "Past"
                                          : "Upcoming"}
                                </p>
                            </div>
                            <div className="grow">
                                <p className="font-roboto-mono text-sm sm:text-base">
                                    {sched.subject}
                                </p>
                                <p className="text-text-primary/60 flex items-center gap-1 text-xs sm:text-sm">
                                    <span>
                                        <User size={15} />
                                    </span>
                                    {sched.instructor.fullName}
                                </p>
                            </div>
                            <div
                                className={clsx(
                                    "hidden size-fit rounded-full border px-3 py-1 text-xs sm:block sm:text-sm",
                                    ongoing
                                        ? "border-red-400/20 bg-red-400/15 text-red-400"
                                        : past
                                          ? "border-gray-400/30 bg-gray-400/20 text-gray-200/70"
                                          : "border-orange-300/20 bg-orange-300/15 text-orange-300",
                                )}
                            >
                                {ongoing ? "Now" : past ? "Done" : "Upcoming"}
                            </div>
                        </div>
                    );
                })}
            </>
        )
    );
}

function ClassroomHeader({
    buildingName,
    classroomCode,
    status,
}: {
    buildingName: string;
    classroomCode: string;
    status: "free" | "absent" | "occupied";
}) {
    return (
        <>
            <div className="text-text-primary mx-auto my-5 flex items-center gap-3 space-y-1">
                <span className="rounded-lg border border-white/20 bg-white/10 p-3 sm:hidden">
                    <DoorOpen size={20} />
                </span>
                <span className="hidden rounded-lg border border-white/20 bg-white/10 p-3 sm:inline">
                    <DoorOpen size={30} />
                </span>
                <div className="min-w-0 grow font-bold">
                    <p className="font-poppins text-text-secondary text-sm font-semibold tracking-wide">
                        {buildingName}
                    </p>
                    <p className="truncate text-2xl sm:text-3xl">
                        {classroomCode}
                    </p>
                </div>
                {StatusMapRounded[status]}
            </div>
        </>
    );
}

function Now({
    status,
}: {
    status: ServerActionResponse & {
        classroomStatus: ClassroomStatus;
        schedule?: PopulatedPlainScheduleDocument;
    };
}) {
    const slot = GetTimeComponentsFromScheduleDocument(status.schedule!);
    const now = getPHDateTime();
    const timeLeft = status.schedule
        ? slotToMinutes(status.schedule.slot.end) -
          slotToMinutes({ hour: now.hour, minute: now.minute })
        : null;
    const hourLeft = timeLeft ? Math.floor(timeLeft / 60) : null;
    const minuteLeft = timeLeft ? timeLeft % 60 : null;
    const timeLeftString = `${hourLeft && hourLeft > 0 ? hourLeft + "h" : ""} ${minuteLeft && minuteLeft > 0 ? minuteLeft + "m" : ""} left`;

    return (
        <div
            className={clsx(
                "text-text-primary rounded-lg border px-4 py-3",
                status.classroomStatus === "occupied"
                    ? "border-red-400/25 bg-red-400/15"
                    : "border-orange-300/25 bg-orange-300/10",
            )}
        >
            <div
                className={clsx(
                    "font-dm-sans mb-2 flex w-fit items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold text-white",
                    status.classroomStatus === "occupied"
                        ? "bg-red-400/30"
                        : "bg-orange-300/30",
                )}
            >
                <div
                    className={clsx(
                        "size-2 rounded-md",
                        status.classroomStatus === "occupied"
                            ? "bg-red-400"
                            : "bg-orange-300",
                    )}
                >
                    <div
                        className={clsx(
                            "size-full animate-ping rounded-md",
                            status.classroomStatus === "occupied"
                                ? "bg-red-400"
                                : "bg-orange-300",
                        )}
                    ></div>
                </div>
                Now
            </div>
            <p className="font-dm-sans text-xl font-semibold">
                {status.schedule?.subject}
            </p>
            <p className="text-text-primary/60 font-dm-sans flex items-center gap-1 text-sm">
                <span>
                    <Clock size={15} />
                </span>
                {slot.startHour}:{slot.startMinute}
                {slot.startMeridiem} - {slot.endHour}:{slot.endMinute}
                {slot.endMeridiem}
            </p>
            <p className="font-dm-sans mt-2 flex items-center gap-1 text-sm">
                <span>
                    <User size={15} />
                </span>
                {status.schedule?.instructor.fullName}
            </p>
            <p
                className={clsx(
                    "font-dm-sans mt-1 flex items-start gap-1 text-sm",
                    status.classroomStatus === "occupied"
                        ? "text-green-300"
                        : "text-orange-300",
                )}
            >
                {status.classroomStatus === "occupied" ? (
                    <>
                        <span className="mt-0.75">
                            <CheckCircle size={15} />
                        </span>
                        Instructor is present
                    </>
                ) : (
                    <>
                        <span className="mt-0.75">
                            <X size={15} />
                        </span>
                        Instructor is absent - room is free to use
                    </>
                )}
            </p>
            {status.classroomStatus === "occupied" && (
                <p className="font-dm-sans mt-2 flex w-fit items-center gap-1 rounded-md bg-red-400/20 px-2 py-1 text-sm font-semibold text-red-400">
                    <span>
                        <Hourglass size={15} />
                    </span>
                    {timeLeftString}
                </p>
            )}
        </div>
    );
}

async function Next({ roomId }: { roomId: string }) {
    const nextSchedule = await GetNextScheduleForTheDay(roomId);

    if (!nextSchedule)
        return (
            <div
                className={clsx(
                    "text-text-primary font-poppins flex items-center gap-2 rounded-lg border p-3",
                    "border-green-300/20 bg-green-300/10",
                )}
            >
                <div className="w-fit rounded-lg border-green-300/25 bg-green-300/10 p-3">
                    <CheckCircle />
                </div>
                <div>
                    <p className="text-text-primary font-semibold">
                        No more classes today
                    </p>
                    <p className="text-text-primary/50 text-sm">
                        This room has no remaining schedule for the rest of the
                        day.
                    </p>
                </div>
            </div>
        );

    const now = getPHDateTime();
    const startsIn =
        slotToMinutes(nextSchedule.slot.start) -
        slotToMinutes({ hour: now.hour, minute: now.minute });
    const hourLeft = Math.floor(startsIn / 60);
    const minuteLeft = startsIn % 60;
    const timeLeftString = `${hourLeft > 0 ? hourLeft + "h" : ""} ${minuteLeft > 0 ? minuteLeft + "m" : ""}`;
    const slot = GetTimeComponentsFromScheduleDocument(nextSchedule);

    return (
        <div
            className={clsx(
                "text-text-primary rounded-lg border p-3",
                "border-orange-300/25 bg-orange-300/10",
            )}
        >
            <div className="flex flex-wrap justify-between">
                <div className="font-dm-sans flex w-fit items-center gap-2 rounded-full border border-orange-300/30 bg-orange-300/15 px-2 py-0.5 text-xs font-semibold text-orange-300">
                    <div className="size-1.5 rounded-full bg-orange-300">
                        <div className="size-full animate-ping rounded-full bg-orange-300"></div>
                    </div>
                    UP NEXT
                </div>
                <div className="font-dm-sans flex w-fit items-center gap-1 rounded-full bg-orange-300/15 px-2 py-0.5 text-xs font-semibold text-orange-300">
                    <span>
                        <Clock size={15} />
                    </span>
                    Starts in {timeLeftString}
                </div>
            </div>
            <p className="font-dm-sans mt-2 text-xl font-semibold">
                {nextSchedule.subject}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                <span className="text-white-50 flex items-center gap-1 text-xs">
                    <span>
                        <Clock size={13} />
                    </span>
                    {slot.startHour}:{slot.startMinute}
                    {slot.startMeridiem} - {slot.endHour}:{slot.endMinute}
                    {slot.endMeridiem}
                </span>
                <span className="text-white-50 flex items-center gap-1 text-xs">
                    <span>
                        <User size={13} />
                    </span>
                    {nextSchedule.instructor.fullName}
                </span>
            </div>
        </div>
    );
}

export async function ClassroomPage({
    params,
}: {
    params: Promise<{ classroom: string }>;
}) {
    const roomId = (await params).classroom;
    if (!isValidObjectId(roomId)) redirect(instructorRoomsPage);
    let classroom: PopulatedPlainRoomDocument;

    try {
        await connectDB();
        classroom = await Room.findById(roomId).populate("building").lean();
    } catch (e) {
        console.error(e);
        return (
            <div className="text-text-primary font-semibold">
                {e instanceof Error ? e.message : "Unexpected Error."}
            </div>
        );
    }

    if (!classroom) {
        redirect(instructorRoomsPage);
    }

    const status = await GetClassroomStatus(roomId);

    return (
        <>
            <ClassroomHeader
                buildingName={classroom.building.name}
                classroomCode={classroom.code}
                status={status.classroomStatus}
            />
            <Suspense fallback={<Loading />}>
                {status.classroomStatus !== "free" ? (
                    <Now status={status} />
                ) : (
                    <Next roomId={roomId} />
                )}
                <TodaysSchedule roomId={classroom._id.toString()} />
                <Schedules roomId={roomId} />
            </Suspense>
        </>
    );
}
