import Link from "next/link";
import ErrorFallback from "../components/ErrorFallback";
import { PopulatedPlainLogDocument } from "../mongoDb/models/log";
import { PopulatedPlainRoomDocument, Room } from "../mongoDb/models/room";
import { connectDB } from "../mongoDb/mongodb";
import {
    BadgeCheck,
    BookOpen,
    Calendar1,
    CalendarOff,
    Clock,
    DoorOpen,
    User,
    UserCheck,
    UserX,
} from "lucide-react";
import clsx from "clsx";
import { isValidObjectId } from "mongoose";
import {
    GetClassroomStatus,
    GetNextScheduleForTheDay,
} from "../actions/ScheduleActions";
import {
    getPHDateTime,
    GetTimeComponentsFromScheduleDocument,
    slotToMinutes,
} from "../lib/utils";

export function ScheduleCardSkeleton() {
    return (
        <div className="text-text-primary bg-green-secondary mt-3 block w-full animate-pulse space-y-1 overflow-hidden rounded-md px-5 py-3 text-start opacity-70 shadow-md">
            <div className="h-7.5 w-1/2 min-w-50 bg-white/5"></div>
            <div className="h-5.5 w-1/3 min-w-20 bg-white/5"></div>
        </div>
    );
}

export function UserListSkeleton() {
    return (
        <ul className="space-y-3 opacity-50">
            {Array.from({ length: 3 }).map((_, i) => (
                <li
                    key={i}
                    className="bg-green-secondary border-green-tertiary/30 block w-full space-y-2 rounded-md border-b-4 px-5 py-5 shadow-md"
                >
                    <div className="h-6 max-w-2xs animate-pulse bg-white/30"></div>
                    <div className="h-3 max-w-xs animate-pulse bg-white/30"></div>
                </li>
            ))}
        </ul>
    );
}

export function LogCard({
    log,
}: {
    log: PopulatedPlainLogDocument;
}): React.ReactNode {
    if (!log.schedule) {
        return null;
    }
    const date = log.createdAt.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
    });
    const day = log.createdAt.toLocaleDateString("en-PH", {
        weekday: "long",
    });
    const time = log.createdAt.toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
    });
    return (
        <div
            key={log._id.toString()}
            className="bg-green-secondary text-text-primary border-green-tertiary relative my-3 grow rounded-md border-2 px-5 py-3 text-sm shadow-md"
        >
            <p>
                Subject:{" "}
                <span className="text-yellow-primary">
                    {log.schedule.subject}
                </span>
            </p>
            <p>
                Venue:{" "}
                <span className="text-yellow-primary">
                    {log.schedule.room.building.name} - {log.schedule.room.code}
                </span>
            </p>
            <p>
                Date:{" "}
                <span className="text-yellow-primary">
                    {date} - {day}
                </span>
            </p>
            <p>
                Time: <span className="text-yellow-primary">{time}</span>
            </p>
            <div className="absolute inset-y-0 left-0 flex -translate-x-1/2 flex-col justify-evenly">
                <div className="bg-green-tertiary h-2 w-5 rounded-full" />
                <div className="bg-green-tertiary h-2 w-5 rounded-full" />
            </div>
        </div>
    );
}

// ###################################################
// Classroom Status
// ###################################################

const IconStatusMap = {
    free: (
        <span className="size-fit rounded-md bg-green-400/20 p-3 text-green-400">
            <BadgeCheck size={20} />
        </span>
    ),
    occupied: (
        <span className="size-fit rounded-md bg-red-400/20 p-3 text-red-400">
            <UserCheck />
        </span>
    ),
    absent: (
        <span className="size-fit rounded-md bg-orange-300/20 p-3 text-orange-300">
            <UserX size={20} />
        </span>
    ),
};

const StatusMap = {
    free: (
        <div className="font-dm-sans flex items-center gap-2 rounded-sm bg-green-400/20 px-2 py-1 text-sm font-semibold text-green-400">
            <span className="size-2 rounded-full bg-green-400"></span>Available
        </div>
    ),
    occupied: (
        <div className="font-dm-sans flex items-center gap-2 rounded-sm bg-red-400/20 px-2 py-1 text-sm font-semibold text-red-400">
            <span className="size-2 rounded-full bg-red-400"></span>Occupied
        </div>
    ),
    absent: (
        <div className="font-dm-sans flex items-center gap-2 rounded-sm bg-orange-300/20 px-2 py-1 text-sm font-semibold text-orange-300">
            <span className="size-2 rounded-full bg-orange-300"></span>Absent
        </div>
    ),
};

export async function Classrooms({
    searchParams,
    roomsUrl,
}: {
    searchParams: { b?: string; r?: string };
    roomsUrl: string;
}) {
    const { b, r } = searchParams;
    let classrooms: PopulatedPlainRoomDocument[];

    try {
        await connectDB();
        classrooms = await Room.find({
            ...(b && { building: b }),
            ...(r && { code: { $regex: r, $options: "i" } }),
        })
            .populate("building")
            .lean();
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {classrooms.map(async (classroom) => {
                const status = await GetClassroomStatus(
                    classroom._id.toString(),
                );
                const time = status.schedule
                    ? GetTimeComponentsFromScheduleDocument(status.schedule)
                    : null;
                const now = getPHDateTime();
                const timeLeft = status.schedule
                    ? slotToMinutes(status.schedule.slot.end) -
                      slotToMinutes({ hour: now.hour, minute: now.minute })
                    : null;
                const hourLeft = timeLeft ? Math.floor(timeLeft / 60) : null;
                const minuteLeft = timeLeft ? timeLeft % 60 : null;
                const timeLeftString = `${hourLeft && hourLeft > 0 ? hourLeft + "h" : ""} ${minuteLeft && minuteLeft > 0 ? minuteLeft + "m" : ""} left`;

                return (
                    classroom.building && (
                        <Link
                            href={`${roomsUrl}/${classroom._id.toString()}`}
                            key={classroom._id.toString()}
                            className={clsx(
                                "text-text-primary/50 bg-green-secondary block w-full rounded-xl p-4",
                                "transition-all hover:-translate-y-px hover:brightness-110",
                                status.classroomStatus === "absent" &&
                                    "border border-orange-300/30",
                                status.classroomStatus === "occupied" &&
                                    "border border-red-400/30",
                            )}
                        >
                            <div className="flex items-center gap-2 border-b border-white/20 pb-3">
                                {
                                    IconStatusMap[
                                        status.classroomStatus ?? "free"
                                    ]
                                }
                                <div className="grow">
                                    <p className="text-text-primary font-semibold">
                                        {classroom.code}
                                    </p>
                                    <p className="text-sm">
                                        {classroom.building.name}
                                    </p>
                                </div>
                                {StatusMap[status.classroomStatus ?? "free"]}
                            </div>
                            <div className="mt-2 space-y-2">
                                {status.classroomStatus !== "free" ? (
                                    <>
                                        <div className="font-dm-sans flex items-center gap-2 text-sm">
                                            <span>
                                                <BookOpen size={15} />
                                            </span>
                                            <p className="text-text-primary">
                                                {status.schedule?.subject}
                                            </p>
                                        </div>
                                        <div className="font-dm-sans flex items-center gap-2 text-sm">
                                            <span>
                                                <User size={15} />
                                            </span>

                                            {status.classroomStatus ===
                                            "absent" ? (
                                                <p className="text-orange-300">
                                                    Instructor absent - room is
                                                    free to use
                                                </p>
                                            ) : (
                                                <p className="text-text-primary">
                                                    {
                                                        status.schedule
                                                            ?.instructor
                                                            .fullName
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="font-dm-sans flex items-center gap-2 text-sm">
                                            <span>
                                                <Clock size={15} />
                                            </span>
                                            {status.classroomStatus ===
                                            "absent" ? (
                                                <>
                                                    Scheduled {time?.startHour}:
                                                    {time?.startMinute}
                                                    {time?.startMeridiem}-
                                                    {time?.endHour}:
                                                    {time?.endMinute}
                                                    {time?.endMeridiem}
                                                </>
                                            ) : (
                                                <>
                                                    {time?.startHour}:
                                                    {time?.startMinute}
                                                    {time?.startMeridiem}-
                                                    {time?.endHour}:
                                                    {time?.endMinute}
                                                    {time?.endMeridiem}{" "}
                                                    <p className="text-text-primary">
                                                        {timeLeftString}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <NextSchedule
                                        classroomId={classroom._id.toString()}
                                    />
                                )}
                            </div>
                        </Link>
                    )
                );
            })}
        </div>
    );
}

async function NextSchedule({ classroomId }: { classroomId: string }) {
    if (!isValidObjectId(classroomId)) return null;
    const nextSchedule = await GetNextScheduleForTheDay(classroomId);
    const slot = nextSchedule
        ? GetTimeComponentsFromScheduleDocument(nextSchedule)
        : null;
    return (
        <div className="font-dm-sans flex items-center gap-2 text-sm">
            <span>
                {nextSchedule ? (
                    <Calendar1 size={15} />
                ) : (
                    <CalendarOff size={15} />
                )}
            </span>
            {nextSchedule ? (
                <>
                    Next:{" "}
                    <p className="text-text-primary">{nextSchedule.subject}</p>{" "}
                    @ {slot?.startHour}:{slot?.startMinute}{" "}
                    {slot?.startMeridiem}
                </>
            ) : (
                <>No more classes today</>
            )}
        </div>
    );
}
